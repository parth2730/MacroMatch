"use strict";

const PantryItem = require("../models/PantryItem");

// Helper: Get all food IDs for the current user
async function getFoodIds(userId) {
    const items = await PantryItem.find({ userId })
        .select("foodId")
        .sort({ createdAt: 1 })
        .lean();

    return items.map((item) => item.foodId);
}

// GET /api/pantry
async function getPantry(req, res, next) {
    try {
        const foodIds = await getFoodIds(req.user._id);

        return res.json({ foodIds });
    } catch (error) {
        return next(error);
    }
}

// PUT /api/pantry
async function replacePantry(req, res, next) {
    try {
        const foodIds = Array.isArray(req.body.foodIds)
            ? [...new Set(req.body.foodIds.map(String))]
            : [];

        await PantryItem.deleteMany({
            userId: req.user._id
        });

        if (foodIds.length > 0) {
            await PantryItem.insertMany(
                foodIds.map((foodId) => ({
                    userId: req.user._id,
                    foodId
                })),
                { ordered: false }
            );
        }

        return res.json({
            foodIds: await getFoodIds(req.user._id)
        });
    } catch (error) {
        return next(error);
    }
}

// POST /api/pantry/:foodId/toggle
async function togglePantryItem(req, res, next) {
    try {
        const foodId = String(req.params.foodId);

        const existing = await PantryItem.findOne({
            userId: req.user._id,
            foodId
        });

        if (existing) {
            await PantryItem.deleteOne({
                _id: existing._id
            });
        } else {
            await PantryItem.create({
                userId: req.user._id,
                foodId
            });
        }

        return res.json({
            foodIds: await getFoodIds(req.user._id),
            inPantry: !existing
        });
    } catch (error) {
        return next(error);
    }
}

// DELETE /api/pantry/:foodId
async function deletePantryItem(req, res, next) {
    try {
        await PantryItem.deleteOne({
            userId: req.user._id,
            foodId: String(req.params.foodId)
        });

        return res.json({
            foodIds: await getFoodIds(req.user._id)
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getPantry,
    replacePantry,
    togglePantryItem,
    deletePantryItem
};