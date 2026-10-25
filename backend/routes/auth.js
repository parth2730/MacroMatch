"use strict";

const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const {
    signup,
    login,
    logout,
    getCurrentUser
} = require("../controllers/authController");

const router = express.Router();

// Register a new user
router.post("/signup", signup);

// Log in an existing user
router.post("/login", login);

// Log out the current user
router.post("/logout", logout);

// Get current authenticated user
router.get("/me", requireAuth, getCurrentUser);

module.exports = router;