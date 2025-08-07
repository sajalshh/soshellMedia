// server/routes/blogRoutes.js

const express = require("express");
const router = express.Router();
const slugify = require("slugify");

const { protect, authorize } = require("../middleware/authMiddleware");
// ✅ 1. The upload middleware is imported
const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");
const BlogPost = require("../models/BlogPost");

// @desc    Get all blog posts (public)
// @route   GET /api/blog
router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 }); // Show newest first
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get a single blog post by its slug (public)
// @route   GET /api/blog/:slug
router.get("/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Create a new blog post
// @route   POST /api/blog
// @access  Private (Client)
router.post(
  "/",
  protect,
  authorize("client"),
  // ✅ 2. The middleware is correctly placed here to handle the image upload
  upload.single("featuredImage"),
  async (req, res) => {
    try {
      const { title, content, excerpt, author, category } = req.body;
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Please upload a featured image" });
      }

      // --- START: FIX FOR DUPLICATE SLUG ---
      // 1. Generate the base slug
      let slug = slugify(title, { lower: true, strict: true });

      // 2. Check if a post with this slug already exists
      const existingPost = await BlogPost.findOne({ slug: slug });

      // 3. If it exists, append a short random string to make it unique
      if (existingPost) {
        const randomSuffix = Math.random().toString(36).substring(2, 7);
        slug = `${slug}-${randomSuffix}`;
      }
      // --- END: FIX FOR DUPLICATE SLUG ---

      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "blog-posts",
      });

      const newPost = await BlogPost.create({
        title,
        content,
        excerpt,
        author,
        category,
        slug: slug, // Use the new, unique slug
        featuredImage: result.secure_url,
      });

      res.status(201).json({ success: true, data: newPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
);

// @desc    Update a blog post
// @route   PUT /api/blog/:id
// @access  Private (Client)
router.put(
  "/:id",
  protect,
  authorize("client"),
  // ✅ 3. The middleware is also correctly placed here for updates
  upload.single("featuredImage"),
  async (req, res) => {
    try {
      const { title, content, excerpt, author, category } = req.body;
      const updateData = {
        title,
        content,
        excerpt,
        author,
        category,
        slug: slugify(title, { lower: true, strict: true }),
      };

      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "blog-posts",
        });
        updateData.featuredImage = result.secure_url;
      }

      const updatedPost = await BlogPost.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true },
      );

      if (!updatedPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  },
);

// @desc    Delete a blog post
// @route   DELETE /api/blog/:id
// @access  Private (Client)
router.delete("/:id", protect, authorize("client"), async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    await post.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get a single blog post by its ID (for editing)
// @route   GET /api/blog/id/:id
router.get("/id/:id", protect, authorize("client"), async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
