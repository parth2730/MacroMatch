const Goal = require("../models/Goal");

const {
    DEFAULT_GOAL,
    toNonNegativeNumber
} = require("../lib/helpers");


function serializeGoal(goal) {
    if (!goal) {
        return { ...DEFAULT_GOAL };
    }

    return {
        calories: goal.calories,
        protein: goal.protein,
        carbs: goal.carbs,
        fat: goal.fat
    };
}


// GET: Fetch user's daily goals
async function getGoal(req, res, next) {
    try {
        const goal = await Goal.findOne({
            userId: req.user._id
        }).lean();

        return res.json({
            goal: serializeGoal(goal)
        });
    } catch (error) {
        return next(error);
    }
}


// PUT: Update user's daily goals
async function updateGoal(req, res, next) {
    try {
        const goal = {
            calories: toNonNegativeNumber(
                req.body.calories,
                DEFAULT_GOAL.calories
            ),
            protein: toNonNegativeNumber(
                req.body.protein,
                DEFAULT_GOAL.protein
            ),
            carbs: toNonNegativeNumber(
                req.body.carbs,
                DEFAULT_GOAL.carbs
            ),
            fat: toNonNegativeNumber(
                req.body.fat,
                DEFAULT_GOAL.fat
            )
        };

        const saved = await Goal.findOneAndUpdate(
            { userId: req.user._id },
            { $set: goal },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        ).lean();

        return res.json({
            goal: serializeGoal(saved)
        });
    } catch (error) {
        return next(error);
    }
}


module.exports = {
    getGoal,
    updateGoal
};