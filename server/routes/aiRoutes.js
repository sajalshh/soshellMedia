const express = require("express");
const router = express.Router();
const { triggerCall, getCalls } = require("../controllers/aiController");
const { protect, checkPermission } = require("../middleware/authMiddleware");

// POST /api/ai-call/trigger -> triggers a call (public, customer-facing)
router.post("/trigger", triggerCall);

// GET /api/ai-call/logs -> gets the history (protected)
router.get("/logs", protect, checkPermission("aiCalls", "view"), getCalls);

module.exports = router;
