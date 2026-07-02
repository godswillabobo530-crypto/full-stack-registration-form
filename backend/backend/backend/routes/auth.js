const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Registration route
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "Email already registered." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword, phone });
        await newUser.save();

        res.json({ message: "Registration successful!" });
    } catch (error) {
        res.json({ message: "Error occurred: " + error.message });
    }
});

module.exports = router;
