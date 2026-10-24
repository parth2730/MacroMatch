const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL_RE = /[!@#$%^&*(),.?":{}|<>]/;

function validateSignup({ name, email, password }) {
    if (!name || !name.trim()) return "Please enter your name.";
    if (!email || !email.trim()) return "Please enter your email.";
    if (!EMAIL_RE.test(email.trim())) return "Please enter a valid email address.";
    if (!password) return "Please create a password.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Za-z]/.test(password)) return "Password must contain at least one alphabet.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (!SPECIAL_RE.test(password)) return "Password must contain at least one special character.";
    return null;
}

router.post("/signup", async (req, res) => {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    const validationError = validateSignup({ name, email, password });
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const existing = await User.findOne({ email });
    if (existing) {
        return res.status(409).json({ message: "An account with this email already exists. Please login instead." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    req.session.userId = user._id.toString();

    res.status(201).json({ user: user.toPublicJSON() });
});

router.post("/login", async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email) return res.status(400).json({ message: "Please enter your email." });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: "Please enter a valid email address." });
    if (!password) return res.status(400).json({ message: "Please enter your password." });

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "No account found with this email. Please sign up first." });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
        return res.status(401).json({ message: "Incorrect password. Please try again." });
    }

    req.session.userId = user._id.toString();

    res.json({ user: user.toPublicJSON() });
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Could not log out. Please try again." });
        }
        res.clearCookie("mm.sid");
        res.json({ message: "Logged out." });
    });
});

router.get("/me", requireAuth, (req, res) => {
    res.json({ user: req.user.toPublicJSON() });
});

module.exports = router;
