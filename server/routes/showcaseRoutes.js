const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const { protect, authorize } = require("../middleware/authMiddleware");
const ShowcaseItem = require("../models/ShowcaseItem");

// --- STORAGE ---
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    // VPS CDN folder
    if (fs.existsSync("/var/www/soshell-cdn/videos")) {
      uploadPath = "/var/www/soshell-cdn/videos";
    } else {
      uploadPath = path.join(__dirname, "../uploads/videos");
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "showcase-" + uniqueSuffix + path.extname(file.originalname));
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
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: videoFilter,
});

// --- GET ALL (PUBLIC) ---
router.get("/", async (req, res) => {
  try {
    const items = await ShowcaseItem.find({ isActive: true }).sort({
      displayOrder: "asc",
    });

    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// --- CREATE (ADMIN) ---
router.post(
  "/",
  protect,
  authorize("client"),
  uploadVideo.single("videoFile"),
  async (req, res) => {
    try {
      const baseUrl = fs.existsSync("/var/www/soshell-cdn/videos")
        ? "https://cdn.soshellmedia.co/videos"
        : "http://localhost:3001/uploads/videos";

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Please upload a video file" });
      }

      const newItem = await ShowcaseItem.create({
        title: req.body.title || "",
        displayOrder: req.body.displayOrder || 0,
        videoUrl: `${baseUrl}/${req.file.filename}`,
        isActive: req.body.isActive ?? true,
      });

      res.status(201).json({ success: true, data: newItem });
    } catch (error) {
      console.error("Showcase Upload Error:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  },
);

// --- UPDATE (ADMIN) ---
router.put(
  "/:id",
  protect,
  authorize("client"),
  uploadVideo.single("videoFile"),
  async (req, res) => {
    try {
      const updateData = {
        title: req.body.title,
        displayOrder: req.body.displayOrder,
        isActive: req.body.isActive,
      };

      if (req.file) {
        const baseUrl = fs.existsSync("/var/www/soshell-cdn/videos")
          ? "https://cdn.soshellmedia.co/videos"
          : "http://localhost:3001/uploads/videos";

        updateData.videoUrl = `${baseUrl}/${req.file.filename}`;
      }

      const item = await ShowcaseItem.findByIdAndUpdate(
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

// --- DELETE (ADMIN) ---
router.delete("/:id", protect, authorize("client"), async (req, res) => {
  try {
    const item = await ShowcaseItem.findById(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    await item.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
