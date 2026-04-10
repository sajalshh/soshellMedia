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
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const homepageRoutes = require("./routes/homepageRoutes");
const blogRoutes = require("./routes/blogRoutes");
const seoRoutes = require("./routes/seoRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const caseStudyRoutes = require("./routes/caseStudyRoutes");
const showcaseRoutes = require("./routes/showcaseRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminRoleRoutes = require("./routes/adminRoleRoutes");
const seedSystemRoles = require("./utils/seedRoles");
const seedOwner = require("./utils/seedOwner");
const attendanceRoutes = require("./routes/attendanceRoutes");
const taskRoutes = require("./routes/taskRoutes");
const mediaProjectRoutes = require("./routes/mediaProjectRoutes");

// Connect to Database
connectDB().then(async () => {
  await seedSystemRoles();
  await seedOwner();
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
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
app.use("/api/services", serviceRoutes);
app.use("/api/casestudies", caseStudyRoutes);
app.use("/api/work-process", require("./routes/workProcessRoutes"));
app.use("/api/pricing", require("./routes/pricingRoutes"));
app.use("/api/showcase", showcaseRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/ai-call", aiRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/roles", adminRoleRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/media-projects", mediaProjectRoutes);
// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
