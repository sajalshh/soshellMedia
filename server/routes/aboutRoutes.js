const express = require("express");
const router = express.Router();
const AboutPage = require("../models/AboutPage");

// GET About Page Content
router.get("/", async (req, res) => {
  try {
    const about = await AboutPage.findOne();
    if (!about) {
      return res.status(404).json({ message: "About page content not found" });
    }
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// UPDATE About Page Content
router.put("/", async (req, res) => {
  try {
    const { headingPrefix, headingHighlight, subHeading, paragraphs } =
      req.body;

   if (!headingPrefix || !headingHighlight || !Array.isArray(paragraphs)) {
     return res.status(400).json({
       message: "headingPrefix, headingHighlight and paragraphs[] are required",
     });
   }

    let about = await AboutPage.findOne();

    // If doesn't exist, create first time
   if (!about) {
     about = await AboutPage.create({
       headingPrefix,
       headingHighlight,
       subHeading,
       paragraphs,
     });

     return res.json({ message: "About page created", about });
   }

    about.headingPrefix = headingPrefix;
    about.headingHighlight = headingHighlight;
    about.subHeading = subHeading || "";
    about.paragraphs = paragraphs;


    await about.save();

    res.json({ message: "About page updated", about });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
