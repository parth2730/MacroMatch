const mongoose = require("mongoose");

const DB_NAME = process.env.DB_NAME || "macromatch";

async function connectDB() {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error("MONGO_URI is missing. Add it to backend/.env");
    }

    mongoose.set("strictQuery", true);

    await mongoose.connect(uri, { dbName: DB_NAME });
    console.log(`MongoDB connected (database: ${DB_NAME})`);

    return mongoose.connection;
}

module.exports = { connectDB, DB_NAME };
