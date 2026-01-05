const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer"); // Import Multer
const { protect, authorize } = require("../middleware/authMiddleware");
const PortfolioItem = require("../models/PortfolioItem");

// --- 1. SETUP SMART STORAGE (Same as homepageRoutes) ---
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    // Check if we are on the VPS (CDN folder)
    if (fs.existsSync("/var/www/soshell-cdn/videos")) {
      uploadPath = "/var/www/soshell-cdn/videos";
    } else {
      // Localhost fallback
      uploadPath = path.join(__dirname, "../uploads/videos");
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "portfolio-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const videoFilter = (req, file, cb) => {
  if (file.mimetype === "video/mp4" || file.mimetype === "video/webm") {
    cb(null, true);
  } else {
    cb(new Error("Only MP4 or WebM video files are allowed!"), false);
  }
};

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: videoFilter,
});

// --- ROUTES ---

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await PortfolioItem.find()
      .populate("category")
      .sort({ displayOrder: "asc" });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Create Item (With Video Upload)
router.post(
  "/",
  protect,
  authorize("client"),
  uploadVideo.single("videoFile"),
  async (req, res) => {
    try {
      // 1. Construct the Base URL
      const baseUrl = fs.existsSync("/var/www/soshell-cdn/videos")
        ? "https://cdn.soshellmedia.co/videos"
        : "http://localhost:3001/uploads/videos";

      let videoUrl = "";

      // 2. Handle File
      if (req.file) {
        videoUrl = `${baseUrl}/${req.file.filename}`;
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Please upload a video file" });
      }

      // 3. Create Record
      const newItem = await PortfolioItem.create({
        title: req.body.title,
        category: req.body.category,
        displayOrder: req.body.displayOrder,
        videoUrl: videoUrl, // Save the CDN URL
      });

      res.status(201).json({ success: true, data: newItem });
    } catch (error) {
      console.error("Portfolio Upload Error:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  },
);

// Update Item (With Optional Video Upload)
router.put(
  "/:id",
  protect,
  authorize("client"),
  uploadVideo.single("videoFile"),
  async (req, res) => {
    try {
      const updateData = {
        title: req.body.title,
        category: req.body.category,
        displayOrder: req.body.displayOrder,
      };

      // Only update video URL if a new file is uploaded
      if (req.file) {
        const baseUrl = fs.existsSync("/var/www/soshell-cdn/videos")
          ? "https://cdn.soshellmedia.co/videos"
          : "http://localhost:3001/uploads/videos";

        updateData.videoUrl = `${baseUrl}/${req.file.filename}`;
      }

      const item = await PortfolioItem.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true },
      );

      if (!item) {
        return res
          .status(404)
          .json({ success: false, message: "Item not found" });
      }
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
);

// Delete Item
router.delete("/:id", protect, authorize("client"), async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    // Optional: Delete actual file from disk here if you want to save space

    await item.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
