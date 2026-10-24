const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
        calories: { type: Number, default: 2200, min: 0 },
        protein: { type: Number, default: 150, min: 0 },
        carbs: { type: Number, default: 220, min: 0 },
        fat: { type: Number, default: 65, min: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);
