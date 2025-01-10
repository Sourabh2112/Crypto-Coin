const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const coinRoutes = require("./routes/coinRoutes");
const startCronJobs = require("./config/cronJobs");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api", coinRoutes);

// Start cron jobs
startCronJobs();

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
