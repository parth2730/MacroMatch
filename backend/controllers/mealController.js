"use strict";

const MealLog = require("../models/MealLog");
const SavedMeal = require("../models/SavedMeal");

const {
    todayString,
    isValidDateString,
    serializeMeal,
    computeTotals
} = require("../lib/helpers");

function randomId(prefix) {
    return prefix + "_" + Date.now() + "_" +
        Math.floor(Math.random() * 1e6);
}

function sanitizeItems(items) {
    if (!Array.isArray(items)) return [];

    return items.slice(0, 20).map((item) => ({
        id: String(item.id || ""),
        name: String(item.name || ""),
        unit: String(item.unit || "g"),
        quantity: Number(item.quantity) || 0,
        calories: Number(item.calories) || 0,
        protein: Number(item.protein) || 0,
        carbs: Number(item.carbs) || 0,
        fat: Number(item.fat) || 0
    }));
}

function sanitizeTotals(totals) {
    totals = totals || {};

    return {
        calories: Number(totals.calories) || 0,
        protein: Number(totals.protein) || 0,
        carbs: Number(totals.carbs) || 0,
        fat: Number(totals.fat) || 0
    };
}

function buildMealFields(body) {
    return {
        signature: String(body.signature || ""),
        name: String(body.name || "Meal"),
        mealType: String(body.mealType || "lunch"),
        dietLabel: String(body.dietLabel || ""),
        itemCount: Number(body.itemCount) || 0,
        items: sanitizeItems(body.items),
        totals: sanitizeTotals(body.totals)
    };
}

// GET /api/meals/log/totals
async function getLogTotals(req, res, next) {
    try {
        const date = isValidDateString(req.query.date)
            ? req.query.date
            : todayString();

        const entries = await MealLog.find({
            userId: req.user._id,
            date
        }).lean();

        return res.json({
            date,
            totals: computeTotals(entries)
        });
    } catch (error) {
        return next(error);
    }
}

// GET /api/meals/log
async function getMealLog(req, res, next) {
    try {
        const filter = {
            userId: req.user._id
        };

        if (req.query.date) {
            if (!isValidDateString(req.query.date)) {
                return res.status(400).json({
                    message: "date must use the YYYY-MM-DD format."
                });
            }

            filter.date = req.query.date;
        }

        const entries = await MealLog.find(filter)
            .sort({ loggedAt: 1 })
            .lean();

        return res.json({
            log: entries.map(serializeMeal),
            totals: computeTotals(entries)
        });
    } catch (error) {
        return next(error);
    }
}

// POST /api/meals/log
async function createMealLog(req, res, next) {
    try {
        const fields = buildMealFields(req.body);

        if (!fields.name || !fields.items.length) {
            return res.status(400).json({
                message: "A meal needs a name and at least one item."
            });
        }

        const date = isValidDateString(req.body.date)
            ? req.body.date
            : todayString();

        const entry = await MealLog.create({
            ...fields,
            userId: req.user._id,
            logId: randomId("log"),
            date,
            loggedAt: new Date()
        });

        const entries = await MealLog.find({
            userId: req.user._id,
            date
        }).sort({ loggedAt: 1 }).lean();

        return res.status(201).json({
            entry: serializeMeal(entry),
            log: entries.map(serializeMeal),
            totals: computeTotals(entries)
        });
    } catch (error) {
        return next(error);
    }
}

// DELETE /api/meals/log/:logId
async function deleteMealLog(req, res, next) {
    try {
        await MealLog.deleteOne({
            userId: req.user._id,
            logId: String(req.params.logId)
        });

        const date = isValidDateString(req.query.date)
            ? req.query.date
            : todayString();

        const entries = await MealLog.find({
            userId: req.user._id,
            date
        }).sort({ loggedAt: 1 }).lean();

        return res.json({
            log: entries.map(serializeMeal),
            totals: computeTotals(entries)
        });
    } catch (error) {
        return next(error);
    }
}

// GET /api/meals/saved
async function getSavedMeals(req, res, next) {
    try {
        const meals = await SavedMeal.find({
            userId: req.user._id
        }).sort({ savedAt: -1 }).lean();

        return res.json({
            meals: meals.map(serializeMeal)
        });
    } catch (error) {
        return next(error);
    }
}

// POST /api/meals/saved
async function createSavedMeal(req, res, next) {
    try {
        const fields = buildMealFields(req.body);

        if (!fields.name || !fields.signature) {
            return res.status(400).json({
                message: "A saved meal needs a name and a signature."
            });
        }

        const existing = await SavedMeal.findOne({
            userId: req.user._id,
            signature: fields.signature
        });

        if (existing) {
            const meals = await SavedMeal.find({
                userId: req.user._id
            }).sort({ savedAt: -1 }).lean();

            return res.json({
                added: false,
                meal: serializeMeal(existing),
                meals: meals.map(serializeMeal)
            });
        }

        const saved = await SavedMeal.create({
            ...fields,
            userId: req.user._id,
            savedId: randomId("saved"),
            savedAt: new Date()
        });

        const meals = await SavedMeal.find({
            userId: req.user._id
        }).sort({ savedAt: -1 }).lean();

        return res.status(201).json({
            added: true,
            meal: serializeMeal(saved),
            meals: meals.map(serializeMeal)
        });
    } catch (error) {
        return next(error);
    }
}

// DELETE /api/meals/saved/:savedId
async function deleteSavedMeal(req, res, next) {
    try {
        await SavedMeal.deleteOne({
            userId: req.user._id,
            savedId: String(req.params.savedId)
        });

        const meals = await SavedMeal.find({
            userId: req.user._id
        }).sort({ savedAt: -1 }).lean();

        return res.json({
            meals: meals.map(serializeMeal)
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getLogTotals,
    getMealLog,
    createMealLog,
    deleteMealLog,
    getSavedMeals,
    createSavedMeal,
    deleteSavedMeal
};