const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 80 },
        email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
        passwordHash: { type: String, required: true }
    },
    { timestamps: true }
);

userSchema.methods.toPublicJSON = function () {
    return {
        id: this._id.toString(),
        name: this.name,
        email: this.email,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model("User", userSchema);
