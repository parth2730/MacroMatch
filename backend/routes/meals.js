"use strict";

const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const {
    getLogTotals,
    getMealLog,
    createMealLog,
    deleteMealLog,
    getSavedMeals,
    createSavedMeal,
    deleteSavedMeal
} = require("../controllers/mealController");

const router = express.Router();

// All meal routes require authentication
router.use(requireAuth);

// Daily meal log
router.get("/log/totals", getLogTotals);
router.get("/log", getMealLog);
router.post("/log", createMealLog);
router.delete("/log/:logId", deleteMealLog);

// Saved meals
router.get("/saved", getSavedMeals);
router.post("/saved", createSavedMeal);
router.delete("/saved/:savedId", deleteSavedMeal);

module.exports = router;