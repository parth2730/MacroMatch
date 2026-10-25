"use strict";

const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const {
    getPantry,
    replacePantry,
    togglePantryItem,
    deletePantryItem
} = require("../controllers/pantryController");

const router = express.Router();

// All pantry routes require authentication
router.use(requireAuth);

// GET: Fetch current user's pantry
router.get("/", getPantry);

// PUT: Replace pantry items
router.put("/", replacePantry);

// POST: Add or remove a food from pantry
router.post("/:foodId/toggle", togglePantryItem);

// DELETE: Remove a food from pantry
router.delete("/:foodId", deletePantryItem);

module.exports = router;