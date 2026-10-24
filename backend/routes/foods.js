const express = require("express");
const Food = require("../models/Food");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
    const filter = {};

    if (req.query.category && req.query.category !== "all") {
        filter.category = req.query.category;
    }

    if (req.query.diet && req.query.diet !== "all") {
        filter.diet = req.query.diet;
    }

    if (req.query.mealType) {
        filter.mealTypes = req.query.mealType;
    }

    if (req.query.search) {
        filter.name = { $regex: String(req.query.search).trim(), $options: "i" };
    }

    const foods = await Food.find(filter)
        .select("-_id -__v -createdAt -updatedAt")
        .sort({ name: 1 })
        .lean();

    res.json({ foods, count: foods.length });
});

router.get("/:id", async (req, res) => {
    const food = await Food.findOne({ id: req.params.id })
        .select("-_id -__v -createdAt -updatedAt")
        .lean();

    if (!food) {
        return res.status(404).json({ message: "Food not found." });
    }

    res.json({ food });
});

module.exports = router;
