const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true, trim: true },
        category: { type: String, required: true },
        diet: { type: String, required: true, enum: ["vegan", "vegetarian", "non-vegetarian"] },
        mealTypes: { type: [String], default: [] },
        servingSize: { type: Number, required: true },
        unit: { type: String, required: true },
        calories: { type: Number, required: true },
        protein: { type: Number, required: true },
        carbs: { type: Number, required: true },
        fat: { type: Number, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
