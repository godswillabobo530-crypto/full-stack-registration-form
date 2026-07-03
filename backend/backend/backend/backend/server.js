const express = require("express");
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors({
    origin: "*", // Allow all origins in development. For production, specify your domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/", authRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Backend is running" });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
