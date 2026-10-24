require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const { connectDB, DB_NAME } = require("./config/db");
const { seedFoods } = require("./lib/seedFoods");

const authRoutes = require("./routes/auth");
const foodRoutes = require("./routes/foods");
const goalRoutes = require("./routes/goal");
const pantryRoutes = require("./routes/pantry");
const mealRoutes = require("./routes/meals");
const recommendationRoutes = require("./routes/recommendations");

const PORT = process.env.PORT || 5055;
const SESSION_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

async function start() {
    await connectDB();
    await seedFoods();

    const app = express();

    app.set("trust proxy", 1);

    app.use(cors({ origin: true, credentials: true }));
    app.use(express.json({ limit: "2mb" }));
    app.use(cookieParser());

    app.use(
        session({
            name: "mm.sid",
            secret: process.env.SESSION_SECRET || "macromatch-development-secret-change-me",
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                client: mongoose.connection.getClient(),
                dbName: DB_NAME,
                collectionName: "sessions",
                ttl: SESSION_MAX_AGE_MS / 1000
            }),
            cookie: {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: SESSION_MAX_AGE_MS
            }
        })
    );

    app.get("/api/health", (req, res) => {
        res.json({
            status: "ok",
            database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
        });
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/foods", foodRoutes);
    app.use("/api/goal", goalRoutes);
    app.use("/api/pantry", pantryRoutes);
    app.use("/api/meals", mealRoutes);
    app.use("/api/recommendations", recommendationRoutes);

    app.use("/api", (req, res) => {
        res.status(404).json({ message: "API endpoint not found." });
    });

    const frontendDir = path.join(__dirname, "..", "frontend");
    app.use(express.static(frontendDir));

    app.use((err, req, res, next) => {
        console.error(err);

        if (err && err.code === 11000) {
            return res.status(409).json({ message: "That record already exists." });
        }

        if (err && err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
        }

        res.status(err.status || 500).json({
            message: err.publicMessage || "Something went wrong on the server."
        });
    });

    app.listen(PORT, () => {
        console.log(`MacroMatch server running at http://localhost:${PORT}`);
    });
}

start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
