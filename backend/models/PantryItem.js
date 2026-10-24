const mongoose = require("mongoose");

const pantryItemSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        foodId: { type: String, required: true, index: true }
    },
    { timestamps: true }
);

pantryItemSchema.index({ userId: 1, foodId: 1 }, { unique: true });

module.exports = mongoose.model("PantryItem", pantryItemSchema);
