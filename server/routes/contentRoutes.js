// server/routes/contentRoutes.js

const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
// --- 1. IMPORT THE UPLOAD AND CLOUDINARY MIDDLEWARE ---
const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");

// Import your Mongoose models
const TeamMember = require("../models/TeamMember");
const CounterStat = require("../models/CounterStat");
const AboutPage = require("../models/AboutPage");

// --- PUBLIC GET ROUTE ---
router.get("/about", async (req, res) => {
  try {
    const [teamMembers, stats, pageContent] = await Promise.all([
      TeamMember.find(),
      CounterStat.find(),
      AboutPage.findOne(),
    ]);
    const finalPageContent = pageContent || { paragraphs: [] };
    res.json({ teamMembers, stats, pageContent: finalPageContent });
  } catch (error) {
    console.error("Error fetching about page content:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// --- PROTECTED PUT ROUTE FOR ABOUT PAGE TEXT ---
router.put("/about", protect, authorize("client"), async (req, res) => {
  try {
    const { paragraphs } = req.body;
    let aboutPageContent = await AboutPage.findOne();
    if (!aboutPageContent) {
      aboutPageContent = await AboutPage.create({ paragraphs });
    } else {
      aboutPageContent.paragraphs = paragraphs;
      await aboutPageContent.save();
    }
    res.status(200).json({ success: true, data: aboutPageContent });
  } catch (error) {
    console.error("Error updating about page content:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// =======================================================
// === 2. ROUTES FOR TEAM MANAGEMENT WITH UPLOAD MIDDLEWARE ===
// =======================================================

// @desc    Add a new team member
// @route   POST /api/content/team
// @access  Private (Client)
router.post(
  "/team",
  protect,
  authorize("client"),
  upload.single("image"), // <-- This line is added and is crucial
  async (req, res) => {
    try {
      const { name, title } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "Please upload an image" });
      }

      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "team-members",
      });

      const newMember = await TeamMember.create({
        name,
        title,
        imgSrc: result.secure_url,
      });

      res.status(201).json({ success: true, data: newMember });
    } catch (error) {
      console.error("Error adding team member:", error);
      res.status(500).json({ message: "Server Error" });
    }
  },
);

// @desc    Update a team member
// @route   PUT /api/content/team/:id
// @access  Private (Client)
router.put(
  "/team/:id",
  protect,
  authorize("client"),
  upload.single("image"), // <-- This line is added and is crucial
  async (req, res) => {
    try {
      const { name, title } = req.body;
      let imgSrc = req.body.imgSrc;

      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "team-members",
        });
        imgSrc = result.secure_url;
      }

      const updatedMember = await TeamMember.findByIdAndUpdate(
        req.params.id,
        { name, title, imgSrc },
        { new: true, runValidators: true },
      );

      if (!updatedMember) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.status(200).json({ success: true, data: updatedMember });
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(500).json({ message: "Server Error" });
    }
  },
);

// @desc    Delete a team member
// @route   DELETE /api/content/team/:id
// @access  Private (Client)
router.delete("/team/:id", protect, authorize("client"), async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }
    await member.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
