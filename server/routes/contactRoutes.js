const express = require("express");
const router = express.Router();

const { sendContactMessage } = require("../controllers/contactController");

// PUBLIC route
// POST /api/contact
router.post("/", sendContactMessage);

module.exports = router;
