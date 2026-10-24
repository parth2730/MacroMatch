const fs = require("fs");
const path = require("path");
const Food = require("../models/Food");

const SEED_PATH = path.join(__dirname, "..", "data", "foods.json");

async function seedFoods() {
    const foods = JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));

    await Food.bulkWrite(
        foods.map((food) => ({
            updateOne: {
                filter: { id: food.id },
                update: { $set: food },
                upsert: true
            }
        })),
        { ordered: false }
    );

    const validIds = foods.map((food) => food.id);
    await Food.deleteMany({ id: { $nin: validIds } });

    console.log(`Food database ready (${foods.length} foods).`);
}

module.exports = { seedFoods };
