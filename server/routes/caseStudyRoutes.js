// server/routes/caseStudyRoutes.js

const express = require("express");
const router = express.Router();
const slugify = require("slugify");

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");
const CaseStudy = require("../models/CaseStudy");

// @desc    Get all case studies (public)
// @route   GET /api/casestudies
router.get("/", async (req, res) => {
  try {
    const studies = await CaseStudy.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: studies });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get a single case study by its slug (public)
// @route   GET /api/casestudies/:slug
router.get("/:slug", async (req, res) => {
  try {
    const study = await CaseStudy.findOne({ slug: req.params.slug });
    if (!study) {
      return res.status(404).json({ message: "Case study not found" });
    }
    res.status(200).json({ success: true, data: study });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get a single case study by its ID (for editing)
// @route   GET /api/casestudies/id/:id
router.get("/id/:id", protect, authorize("client"), async (req, res) => {
  try {
    const study = await CaseStudy.findById(req.params.id);
    if (!study) {
      return res.status(404).json({ message: "Case study not found" });
    }
    res.status(200).json({ success: true, data: study });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Create a new case study
// @route   POST /api/casestudies
// @access  Private (Client)
router.post(
  "/",
  protect,
  authorize("client"),
  upload.single("featuredImage"),
  async (req, res) => {
    try {
      const {
        title,
        content,
        excerpt,
        client,
        industry,
        metaTitle,
        metaDescription,
        keywords,
        url,
        alt_tag,
        canonicalTag,
      } = req.body;

      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Please upload a featured image" });
      }

      let slug = slugify(url || title, { lower: true, strict: true });
      const existingStudy = await CaseStudy.findOne({ slug: slug });
      if (existingStudy) {
        const randomSuffix = Math.random().toString(36).substring(2, 7);
        slug = `${slug}-${randomSuffix}`;
      }

      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "case-studies",
      });

      const newStudy = await CaseStudy.create({
        title,
        content,
        excerpt,
        client,
        industry,
        slug: slug,
        featuredImage: result.secure_url,
        metaTitle,
        metaDescription,
        keywords,
        altTag: alt_tag,
        canonicalTag,
      });

      res.status(201).json({ success: true, data: newStudy });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
);

// @desc    Upload an image for the case study content (TinyMCE)
// @route   POST /api/casestudies/upload-image
// @access  Private (Client)
router.post(
  "/upload-image",
  protect,
  authorize("client"),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "case-studies",
      });
      res.status(200).json({ location: result.secure_url });
    } catch (error) {
      console.error("Image upload error:", error);
      res
        .status(500)
        .json({ message: "Server Error: Could not upload image." });
    }
  },
);

// @desc    Update a case study
// @route   PUT /api/casestudies/:id
// @access  Private (Client)
router.put(
  "/:id",
  protect,
  authorize("client"),
  upload.single("featuredImage"),
  async (req, res) => {
    try {
      const {
        title,
        content,
        excerpt,
        client,
        industry,
        metaTitle,
        metaDescription,
        keywords,
        url,
        alt_tag,
        canonicalTag,
      } = req.body;

      const updateData = {
        title,
        content,
        excerpt,
        client,
        industry,
        metaTitle,
        metaDescription,
        keywords,
        altTag: alt_tag,
        canonicalTag,
      };

      if (url) {
        updateData.slug = slugify(url, { lower: true, strict: true });
      }

      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "case-studies",
        });
        updateData.featuredImage = result.secure_url;
      }

      const updatedStudy = await CaseStudy.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true },
      );

      if (!updatedStudy) {
        return res.status(404).json({ message: "Case study not found" });
      }
      res.status(200).json({ success: true, data: updatedStudy });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  },
);

// @desc    Delete a case study
// @route   DELETE /api/casestudies/:id
// @access  Private (Client)
router.delete("/:id", protect, authorize("client"), async (req, res) => {
  try {
    const study = await CaseStudy.findById(req.params.id);
    if (!study) {
      return res.status(404).json({ message: "Case study not found" });
    }
    await study.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
