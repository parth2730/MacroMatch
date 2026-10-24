const express = require("express");
const Food = require("../models/Food");
const PantryItem = require("../models/PantryItem");
const requireAuth = require("../middleware/requireAuth");
const { generate, TOLERANCE_PERCENT } = require("../lib/recommendationEngine");

const router = express.Router();

router.use(requireAuth);

function parseTarget(value) {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return null;
    return n;
}

router.post("/", async (req, res) => {
    const target = {
        calories: parseTarget(req.body.calories),
        protein: parseTarget(req.body.protein),
        carbs: parseTarget(req.body.carbs),
        fat: parseTarget(req.body.fat)
    };

    if (Object.values(target).some((v) => v === null)) {
        return res.status(400).json({ message: "Please provide a valid non-negative number for every macro." });
    }

    if (Object.values(target).some((v) => v > 5000)) {
        return res.status(400).json({ message: "One of the targets looks unrealistically high." });
    }

    if (target.calories === 0 && (target.protein > 0 || target.carbs > 0 || target.fat > 0)) {
        return res.status(400).json({ message: "Calories can't be 0 if you have macro targets." });
    }

    const options = {
        mealType: req.body.mealType ? String(req.body.mealType) : undefined,
        diet: req.body.diet ? String(req.body.diet) : "all",
        maxItems: req.body.maxItems,
        useWhatIHave: !!req.body.useWhatIHave
    };

    const foods = await Food.find()
        .select("-_id -__v -createdAt -updatedAt")
        .lean();

    let pantryIds = [];
    if (options.useWhatIHave) {
        const items = await PantryItem.find({ userId: req.user._id }).select("foodId").lean();
        pantryIds = items.map((item) => item.foodId);
    }

    const result = generate(target, options, foods, pantryIds);

    res.json({
        ...result,
        tolerancePercent: TOLERANCE_PERCENT,
        target
    });
});

module.exports = router;
