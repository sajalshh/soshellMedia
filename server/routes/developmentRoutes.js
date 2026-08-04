// server/routes/developmentRoutes.js

const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect, checkPermission } = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinary");

const DevPageContent = require("../models/DevPageContent");
const DevTechnology = require("../models/DevTechnology");
const DevProcessStep = require("../models/DevProcessStep");
const DevProject = require("../models/DevProject");

const uploadToCloudinary = async (file, folder) => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURI = "data:" + file.mimetype + ";base64," + b64;
  const result = await cloudinary.uploader.upload(dataURI, { folder });
  return result.secure_url;
};

/* =========================================================
   PUBLIC — aggregate everything the /development page needs
   ========================================================= */
// @route   GET /api/development
// @access  Public
router.get("/", async (req, res) => {
  try {
    const [content, technologies, process, projects] = await Promise.all([
      DevPageContent.findOne(),
      DevTechnology.find().sort({ displayOrder: "asc" }),
      DevProcessStep.find().sort({ displayOrder: "asc" }),
      DevProject.find({ isActive: true }).sort({ displayOrder: "asc" }),
    ]);
    res.json({
      success: true,
      data: { content, technologies, process, projects },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/* =========================================================
   CONTENT
   ========================================================= */
router.put(
  "/content",
  protect,
  checkPermission("development", "update"),
  async (req, res) => {
    try {
      const content = await DevPageContent.findOneAndUpdate({}, req.body, {
        new: true,
        upsert: true,
      });
      res.json({ success: true, data: content });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
);

/* =========================================================
   TECHNOLOGIES
   ========================================================= */
router.post(
  "/technologies",
  protect,
  checkPermission("development", "create"),
  async (req, res) => {
    try {
      const tech = await DevTechnology.create(req.body);
      res.status(201).json({ success: true, data: tech });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
);

router.put(
  "/technologies/:id",
  protect,
  checkPermission("development", "update"),
  async (req, res) => {
    try {
      const tech = await DevTechnology.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true },
      );
      if (!tech) {
        return res
          .status(404)
          .json({ success: false, message: "Technology not found" });
      }
      res.json({ success: true, data: tech });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
);

router.delete(
  "/technologies/:id",
  protect,
  checkPermission("development", "delete"),
  async (req, res) => {
    try {
      const tech = await DevTechnology.findById(req.params.id);
      if (!tech) {
        return res
          .status(404)
          .json({ success: false, message: "Technology not found" });
      }
      await tech.deleteOne();
      res.json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
);

/* =========================================================
   PROCESS STEPS
   ========================================================= */
router.post(
  "/process",
  protect,
  checkPermission("development", "create"),
  async (req, res) => {
    try {
      const step = await DevProcessStep.create(req.body);
      res.status(201).json({ success: true, data: step });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
);

router.put(
  "/process/:id",
  protect,
  checkPermission("development", "update"),
  async (req, res) => {
    try {
      const step = await DevProcessStep.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true },
      );
      if (!step) {
        return res
          .status(404)
          .json({ success: false, message: "Process step not found" });
      }
      res.json({ success: true, data: step });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
);

router.delete(
  "/process/:id",
  protect,
  checkPermission("development", "delete"),
  async (req, res) => {
    try {
      const step = await DevProcessStep.findById(req.params.id);
      if (!step) {
        return res
          .status(404)
          .json({ success: false, message: "Process step not found" });
      }
      await step.deleteOne();
      res.json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
);

/* =========================================================
   PROJECTS (showcase)
   ========================================================= */
router.post(
  "/projects",
  protect,
  checkPermission("development", "create"),
  upload.single("thumbnailFile"),
  async (req, res) => {
    try {
      const payload = { ...req.body };
      if (typeof payload.tags === "string") {
        payload.tags = payload.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
      if (req.file) {
        payload.thumbnailOverride = await uploadToCloudinary(
          req.file,
          "development-projects",
        );
      }
      const project = await DevProject.create(payload);
      res.status(201).json({ success: true, data: project });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
);

router.put(
  "/projects/:id",
  protect,
  checkPermission("development", "update"),
  upload.single("thumbnailFile"),
  async (req, res) => {
    try {
      const payload = { ...req.body };
      if (typeof payload.tags === "string") {
        payload.tags = payload.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
      if (req.file) {
        payload.thumbnailOverride = await uploadToCloudinary(
          req.file,
          "development-projects",
        );
      }
      const project = await DevProject.findByIdAndUpdate(
        req.params.id,
        payload,
        { new: true, runValidators: true },
      );
      if (!project) {
        return res
          .status(404)
          .json({ success: false, message: "Project not found" });
      }
      res.json({ success: true, data: project });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
);

router.delete(
  "/projects/:id",
  protect,
  checkPermission("development", "delete"),
  async (req, res) => {
    try {
      const project = await DevProject.findById(req.params.id);
      if (!project) {
        return res
          .status(404)
          .json({ success: false, message: "Project not found" });
      }
      await project.deleteOne();
      res.json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
);

module.exports = router;
