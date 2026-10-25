const Food = require("../models/Food");

// GET: Fetch all foods with optional filters
async function getFoods(req, res, next) {
    try {
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
            filter.name = {
                $regex: String(req.query.search).trim(),
                $options: "i"
            };
        }

        const foods = await Food.find(filter)
            .select("-_id -__v -createdAt -updatedAt")
            .sort({ name: 1 })
            .lean();

        return res.json({
            foods,
            count: foods.length
        });
    } catch (error) {
        return next(error);
    }
}


// GET: Fetch one food by ID
async function getFoodById(req, res, next) {
    try {
        const food = await Food.findOne({
            id: req.params.id
        })
            .select("-_id -__v -createdAt -updatedAt")
            .lean();

        if (!food) {
            return res.status(404).json({
                message: "Food not found."
            });
        }

        return res.json({ food });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getFoods,
    getFoodById
};