// server/routes/homepageRoutes.js

const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware"); 
const cloudinary = require("../config/cloudinary");

const { protect, authorize } = require("../middleware/authMiddleware");
const HeroContent = require("../models/HeroContent");
const AboutTab = require("../models/AboutTab");
const ServiceCard = require("../models/ServiceCard");
const Project = require("../models/Project");
const AboutSectionContent = require("../models/AboutSectionContent");

// @desc    Get Hero section content
// @route   GET /api/homepage/hero
// @access  Public
router.get("/hero", async (req, res) => {
  try {
    const heroContent = await HeroContent.findOne();
    res.status(200).json({ success: true, data: heroContent });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Update Hero section content
// @route   PUT /api/homepage/hero
// @access  Private (Client)
router.put("/hero", protect, authorize("client"), async (req, res) => {
  try {
    // Since there's only one hero document, we find and update it.
    // The 'new: true' option returns the document after it has been updated.
    const updatedHeroContent = await HeroContent.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedHeroContent) {
      // If it doesn't exist for some reason, create it.
      const newHeroContent = await HeroContent.create(req.body);
      return res.status(201).json({ success: true, data: newHeroContent });
    }

    res.status(200).json({ success: true, data: updatedHeroContent });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


// About tabs

router.get("/about-tabs", async (req, res) => {
  try {
    const aboutTabs = await AboutTab.find();
    res.status(200).json({ success: true, data: aboutTabs });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Update an About Tab
// @route   PUT /api/homepage/about-tabs/:id
// @access  Private (Client)
router.put(
  "/about-tabs/:id",
  protect,
  authorize("client"),
  async (req, res) => {
    try {
      const updatedTab = await AboutTab.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        },
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

// ... after the about-tabs PUT route ...

// @desc    Get About Section content (the video URL)
// @route   GET /api/homepage/about-section
// @access  Public
router.get("/about-section", async (req, res) => {
  try {
    const sectionContent = await AboutSectionContent.findOne();
    res.status(200).json({ success: true, data: sectionContent });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Update About Section content
// @route   PUT /api/homepage/about-section
// @access  Private (Client)
router.put("/about-section", protect, authorize("client"), async (req, res) => {
  try {
    const updatedContent = await AboutSectionContent.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true, // Creates the document if it doesn't exist
      runValidators: true,
    });
    res.status(200).json({ success: true, data: updatedContent });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});



// --- SERVICE CARDS ROUTES ---
router.get("/service-cards", async (req, res) => {
    try {
        const serviceCards = await ServiceCard.find().sort({ displayOrder: 'asc' });
        res.status(200).json({ success: true, data: serviceCards });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// @desc    Update a Service Card
// @route   PUT /api/homepage/service-cards/:id
// @access  Private (Client)
router.put(
  "/service-cards/:id",
  protect,
  authorize("client"),
  upload.single("image"),
  async (req, res) => {
    try {
      // Because the description array is stringified on the frontend, we need to parse it back
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
        {
          new: true,
          runValidators: true,
        },
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


// === PROJECTS ===

// @desc    Get all Projects
// @route   GET /api/homepage/projects
// @access  Public
router.get("/projects", async (req, res) => {
    try {
        const projects = await Project.find().sort({ displayOrder: 'asc' });
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// @desc    Add a new Project
// @route   POST /api/homepage/projects
// @access  Private (Client)
router.post("/projects", protect, authorize("client"), upload.single('image'), async (req, res) => {
    try {
        const { title, date, description, projectLink, displayOrder } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a project image' });
        }
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI, { folder: "projects" });

        const newProject = await Project.create({
            title, date, description, projectLink, displayOrder,
            image: result.secure_url
        });
        res.status(201).json({ success: true, data: newProject });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// @desc    Update a Project
// @route   PUT /api/homepage/projects/:id
// @access  Private (Client)
router.put("/projects/:id", protect, authorize("client"), upload.single('image'), async (req, res) => {
    try {
        const { title, date, description, projectLink, displayOrder } = req.body;
        let image = req.body.image;

        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const result = await cloudinary.uploader.upload(dataURI, { folder: "projects" });
            image = result.secure_url;
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { title, date, description, projectLink, displayOrder, image },
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ success: true, data: updatedProject });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// @desc    Delete a Project
// @route   DELETE /api/homepage/projects/:id
// @access  Private (Client)
router.delete("/projects/:id", protect, authorize("client"), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        await project.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
