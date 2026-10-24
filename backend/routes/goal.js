const express = require("express");
const Goal = require("../models/Goal");
const requireAuth = require("../middleware/requireAuth");
const { DEFAULT_GOAL, toNonNegativeNumber } = require("../lib/helpers");

const router = express.Router();

router.use(requireAuth);

function serializeGoal(goal) {
    if (!goal) return { ...DEFAULT_GOAL };
    return {
        calories: goal.calories,
        protein: goal.protein,
        carbs: goal.carbs,
        fat: goal.fat
    };
}

router.get("/", async (req, res) => {
    const goal = await Goal.findOne({ userId: req.user._id }).lean();
    res.json({ goal: serializeGoal(goal) });
});

router.put("/", async (req, res) => {
    const goal = {
        calories: toNonNegativeNumber(req.body.calories, DEFAULT_GOAL.calories),
        protein: toNonNegativeNumber(req.body.protein, DEFAULT_GOAL.protein),
        carbs: toNonNegativeNumber(req.body.carbs, DEFAULT_GOAL.carbs),
        fat: toNonNegativeNumber(req.body.fat, DEFAULT_GOAL.fat)
    };

    const saved = await Goal.findOneAndUpdate(
        { userId: req.user._id },
        { $set: goal },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    res.json({ goal: serializeGoal(saved) });
});

module.exports = router;
