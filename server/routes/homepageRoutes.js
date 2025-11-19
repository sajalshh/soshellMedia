// server/routes/homepageRoutes.js

const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");

const { protect, authorize } = require("../middleware/authMiddleware");
const HeroContent = require("../models/HeroContent");
const AboutTab = require("../models/AboutTab");
const ServiceCard = require("../models/ServiceCard");
const Project = require("../models/Project");
const AboutSectionContent = require("../models/AboutSectionContent");

// --- SMART STORAGE CONFIGURATION ---
// This works on both VPS (CDN) and Localhost (Mac)
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    // 1. Check if we are on the VPS (Does the CDN folder exist?)
    if (fs.existsSync("/var/www/soshell-cdn/videos")) {
      uploadPath = "/var/www/soshell-cdn/videos";
    } else {
      // 2. If not (Localhost), save to a local folder so it doesn't crash
      uploadPath = path.join(__dirname, "../uploads/videos");
    }

    // Create folder if missing
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique name: hero-123456789.mp4
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "hero-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Only allow MP4/WebM
const videoFilter = (req, file, cb) => {
  if (file.mimetype === "video/mp4" || file.mimetype === "video/webm") {
    cb(null, true);
  } else {
    cb(new Error("Only MP4 or WebM video files are allowed!"), false);
  }
};

// Initialize the uploader
const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: videoFilter,
});

// @desc    Get Hero section content
router.get("/hero", async (req, res) => {
  try {
    const heroContent = await HeroContent.findOne();
    res.status(200).json({ success: true, data: heroContent });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Update Hero section content (Text + Video)
// @route   PUT /api/homepage/hero
router.put(
  "/hero",
  protect,
  authorize("client"),
  uploadVideo.single("heroVideo"), // <--- THIS WAS MISSING!
  async (req, res) => {
    try {
      let updateData = { ...req.body };

      if (req.file) {
        // If on VPS, use CDN URL. If Local, use a fake localhost URL just for testing.
        const baseUrl = fs.existsSync("/var/www/soshell-cdn/videos")
          ? "https://cdn.soshellmedia.co/videos"
          : "http://localhost:3001/uploads/videos";

        updateData.videoUrl = `${baseUrl}/${req.file.filename}`;
      }

      const updatedHeroContent = await HeroContent.findOneAndUpdate(
        {},
        updateData,
        {
          new: true,
          upsert: true,
          runValidators: true,
        },
      );

      res.status(200).json({ success: true, data: updatedHeroContent });
    } catch (error) {
      console.error("Hero Upload Error:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
);

// --- (The rest of your file remains exactly the same) ---

// About tabs
router.get("/about-tabs", async (req, res) => {
  try {
    const aboutTabs = await AboutTab.find();
    res.status(200).json({ success: true, data: aboutTabs });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.put(
  "/about-tabs/:id",
  protect,
  authorize("client"),
  async (req, res) => {
    try {
      const updatedTab = await AboutTab.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true },
      );
      if (!updatedTab) {
        return res.status(404).json({ message: "Tab content not found" });
      }
      res.status(200).json({ success: true, data: updatedTab });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  },
);

router.get("/about-section", async (req, res) => {
  try {
    const sectionContent = await AboutSectionContent.findOne();
    res.status(200).json({ success: true, data: sectionContent });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/about-section", protect, authorize("client"), async (req, res) => {
  try {
    const updatedContent = await AboutSectionContent.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );
    res.status(200).json({ success: true, data: updatedContent });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/service-cards", async (req, res) => {
  try {
    const serviceCards = await ServiceCard.find().sort({ displayOrder: "asc" });
    res.status(200).json({ success: true, data: serviceCards });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.put(
  "/service-cards/:id",
  protect,
  authorize("client"),
  upload.single("image"),
  async (req, res) => {
    try {
      const updateData = {
        ...req.body,
        description: JSON.parse(req.body.description),
      };
      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "service-cards",
        });
        updateData.image = result.secure_url;
      }
      const updatedCard = await ServiceCard.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true },
      );
      if (!updatedCard) {
        return res.status(404).json({ message: "Service card not found" });
      }
      res.status(200).json({ success: true, data: updatedCard });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
);

router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ displayOrder: "asc" });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post(
  "/projects",
  protect,
  authorize("client"),
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, date, description, projectLink, displayOrder } = req.body;
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Please upload a project image" });
      }
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "projects",
      });
      const newProject = await Project.create({
        title,
        date,
        description,
        projectLink,
        displayOrder,
        image: result.secure_url,
      });
      res.status(201).json({ success: true, data: newProject });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  },
);

router.put(
  "/projects/:id",
  protect,
  authorize("client"),
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, date, description, projectLink, displayOrder } = req.body;
      let image = req.body.image;
      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "projects",
        });
        image = result.secure_url;
      }
      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        { title, date, description, projectLink, displayOrder, image },
        { new: true, runValidators: true },
      );
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json({ success: true, data: updatedProject });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  },
);

router.delete(
  "/projects/:id",
  protect,
  authorize("client"),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      await project.deleteOne();
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  },
);

module.exports = router;
