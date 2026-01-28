const express = require("express");
const router = express.Router();
const { triggerCall, getCalls } = require("../controllers/aiController");

// POST /api/ai-call/trigger -> triggers a call
router.post("/trigger", triggerCall);

// GET /api/ai-call/logs -> gets the history
router.get("/logs", getCalls);

module.exports = router;
