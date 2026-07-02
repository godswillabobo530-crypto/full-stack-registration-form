const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();
const memoryUsers = [];

const saveUser = async (userData) => {
    const user = { ...userData, _id: Date.now().toString() };
    memoryUsers.push(user);
    return user;
};

const findUserByEmail = async (email) => {
    return memoryUsers.find((user) => user.email === email) || null;
};

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await saveUser({ name, email, password: hashedPassword, phone });

        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        res.status(500).json({ message: "Error occurred: " + error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        res.json({ message: "Login successful!", user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Error occurred: " + error.message });
    }
});

module.exports = router;
