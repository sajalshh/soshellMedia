// server/server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// 1. Load environment variables FIRST
dotenv.config();

// 2. Now that .env is loaded, connect to services
const connectDB = require("./config/db");
require("./config/cloudinary"); // This runs the cloudinary.config() method

// Import routes
const contentRoutes = require("./routes/contentRoutes");
const authRoutes = require("./routes/authRoutes");
const homepageRoutes = require("./routes/homepageRoutes");
const blogRoutes = require("./routes/blogRoutes");
const seoRoutes = require("./routes/seoRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");


// Connect to Database
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.get("/", (_req, res) => {
  console.log("Root route hit");
  res.send("API is running...");
});

// API routes
app.use("/api/content", contentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/homepage", homepageRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/seo", seoRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/categories", categoryRoutes);
// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
