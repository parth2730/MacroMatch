const express = require("express");
const PantryItem = require("../models/PantryItem");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

async function getFoodIds(userId) {
    const items = await PantryItem.find({ userId }).select("foodId").sort({ createdAt: 1 }).lean();
    return items.map((item) => item.foodId);
}

router.get("/", async (req, res) => {
    res.json({ foodIds: await getFoodIds(req.user._id) });
});

router.put("/", async (req, res) => {
    const foodIds = Array.isArray(req.body.foodIds)
        ? [...new Set(req.body.foodIds.map(String))]
        : [];

    await PantryItem.deleteMany({ userId: req.user._id });

    if (foodIds.length > 0) {
        await PantryItem.insertMany(
            foodIds.map((foodId) => ({ userId: req.user._id, foodId })),
            { ordered: false }
        );
    }

    res.json({ foodIds: await getFoodIds(req.user._id) });
});

router.post("/:foodId/toggle", async (req, res) => {
    const foodId = String(req.params.foodId);
    const existing = await PantryItem.findOne({ userId: req.user._id, foodId });

    if (existing) {
        await PantryItem.deleteOne({ _id: existing._id });
    } else {
        await PantryItem.create({ userId: req.user._id, foodId });
    }

    res.json({
        foodIds: await getFoodIds(req.user._id),
        inPantry: !existing
    });
});

router.delete("/:foodId", async (req, res) => {
    await PantryItem.deleteOne({ userId: req.user._id, foodId: String(req.params.foodId) });
    res.json({ foodIds: await getFoodIds(req.user._id) });
});

module.exports = router;
