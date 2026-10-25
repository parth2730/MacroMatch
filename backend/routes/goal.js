const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const {
    getGoal,
    updateGoal
} = require("../controllers/goalController");

const router = express.Router();

// Authentication required for all goal routes
router.use(requireAuth);

// GET: Fetch current user's goals
router.get("/", getGoal);

// PUT: Update current user's goals
router.put("/", updateGoal);

module.exports = router;