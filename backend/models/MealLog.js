const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        id: String,
        name: String,
        unit: String,
        quantity: Number,
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number
    },
    { _id: false }
);

const totalsSchema = new mongoose.Schema(
    {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 }
    },
    { _id: false }
);

const mealLogSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        logId: { type: String, required: true, unique: true, index: true },
        signature: { type: String, default: "" },
        name: { type: String, required: true },
        mealType: { type: String, default: "lunch" },
        dietLabel: { type: String, default: "" },
        itemCount: { type: Number, default: 0 },
        items: { type: [itemSchema], default: [] },
        totals: { type: totalsSchema, default: () => ({}) },
        matchScore: Number,
        withinTolerance: Boolean,
        date: { type: String, required: true, index: true },
        loggedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

mealLogSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model("MealLog", mealLogSchema);
