"use strict";

const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const {
    generateRecommendations
} = require("../controllers/recommendationController");

const router = express.Router();

// All recommendation routes require authentication
router.use(requireAuth);

// POST: Generate meal recommendations
router.post("/", generateRecommendations);

module.exports = router;