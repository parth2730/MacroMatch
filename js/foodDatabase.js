/* =========================================================
   foodDatabaseService.js
   -------------------------------------------------------
   LocalStorage-backed food/meal database for MacroMatch.

   Responsibilities:
   - Seed LocalStorage with a starter dataset on first load
     (never overwrites existing/customized data)
   - Provide read access to the food database
   - Provide small write helpers (add/reset) for later use

   Storage key: "mm_food_database"
   ========================================================= */

(function (global) {
    "use strict";

    var STORAGE_KEY = "mm_food_database";
    var VERSION_KEY = "mm_food_database_version";
    // Bump this whenever SEED_FOODS changes in a way that old cached
    // LocalStorage data (from a previous version of this file) would
    // no longer match -- e.g. the vegan/vegetarian/non-vegetarian
    // hierarchy fix below. This makes sure returning users automatically
    // get the corrected dataset instead of being stuck on a stale copy.
    var DATA_VERSION = 2;

    /* ---------------------------------------------------
       Seed dataset (~85 items).
       diet: "vegan" | "vegetarian" | "non-vegetarian"
         - "vegan" items are also valid for vegetarian &
           non-vegetarian searches
         - "vegetarian" items are valid for vegetarian &
           non-vegetarian searches, but NOT vegan
         - "non-vegetarian" items only show for the
           non-vegetarian selection
       unit: "g" | "ml" | "piece"
       servingSize: the amount the nutrition values below
       refer to (e.g. 100 g, 1 piece)
    --------------------------------------------------- */
    var SEED_FOODS = [
        // ---------------- Grains & Starches ----------------
        { id: "food_001", name: "White Rice (cooked)", category: "Grain", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3 },
        { id: "food_002", name: "Brown Rice (cooked)", category: "Grain", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 123, protein: 2.7, carbs: 25.6, fat: 1.0 },
        { id: "food_003", name: "Roti (whole wheat)", category: "Grain", diet: "vegan", mealTypes: ["breakfast", "lunch", "dinner"], servingSize: 40, unit: "g", calories: 104, protein: 3.1, carbs: 18.0, fat: 2.2 },
        { id: "food_004", name: "Quinoa (cooked)", category: "Grain", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9 },
        { id: "food_005", name: "Oats (cooked, water)", category: "Grain", diet: "vegan", mealTypes: ["breakfast"], servingSize: 100, unit: "g", calories: 71, protein: 2.5, carbs: 12.0, fat: 1.5 },
        { id: "food_006", name: "Whole Wheat Bread", category: "Grain", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 28, unit: "g", calories: 69, protein: 3.6, carbs: 11.6, fat: 0.9 },
        { id: "food_007", name: "Whole Grain Pasta (cooked)", category: "Grain", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 124, protein: 5.0, carbs: 25.0, fat: 1.1 },
        { id: "food_008", name: "Poha (flattened rice, cooked)", category: "Grain", diet: "vegan", mealTypes: ["breakfast"], servingSize: 100, unit: "g", calories: 110, protein: 2.1, carbs: 24.0, fat: 0.6 },
        { id: "food_009", name: "Idli (steamed rice cake)", category: "Grain", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 1, unit: "piece", calories: 39, protein: 1.5, carbs: 8.0, fat: 0.1 },
        { id: "food_010", name: "Dosa (plain)", category: "Grain", diet: "vegan", mealTypes: ["breakfast"], servingSize: 1, unit: "piece", calories: 133, protein: 2.7, carbs: 20.0, fat: 4.5 },
        { id: "food_011", name: "Sweet Corn (boiled)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner", "snack"], servingSize: 100, unit: "g", calories: 96, protein: 3.4, carbs: 21.0, fat: 1.5 },

        // ---------------- Potatoes / Roots ----------------
        { id: "food_012", name: "Potato (boiled)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 87, protein: 1.9, carbs: 20.1, fat: 0.1 },
        { id: "food_013", name: "Sweet Potato (boiled)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner", "snack"], servingSize: 100, unit: "g", calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1 },

        // ---------------- Legumes / Pulses ----------------
        { id: "food_014", name: "Dal (yellow lentil, cooked)", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 116, protein: 9.0, carbs: 20.1, fat: 0.4 },
        { id: "food_015", name: "Masoor Dal (cooked)", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 116, protein: 9.0, carbs: 20.0, fat: 0.4 },
        { id: "food_016", name: "Rajma (kidney beans, cooked)", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 127, protein: 8.7, carbs: 22.8, fat: 0.5 },
        { id: "food_017", name: "Chickpeas / Chana (cooked)", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner", "snack"], servingSize: 100, unit: "g", calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6 },
        { id: "food_018", name: "Black Beans (cooked)", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5 },
        { id: "food_019", name: "Moong Dal (cooked)", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner", "breakfast"], servingSize: 100, unit: "g", calories: 105, protein: 7.0, carbs: 19.2, fat: 0.4 },
        { id: "food_020", name: "Soy Chunks (rehydrated)", category: "Protein", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 101, protein: 15.6, carbs: 8.0, fat: 0.5 },
        { id: "food_021", name: "Hummus", category: "Legume", diet: "vegan", mealTypes: ["snack", "lunch"], servingSize: 100, unit: "g", calories: 166, protein: 7.9, carbs: 14.3, fat: 9.6 },
        { id: "food_022", name: "Edamame (cooked)", category: "Legume", diet: "vegan", mealTypes: ["snack", "dinner"], servingSize: 100, unit: "g", calories: 121, protein: 11.0, carbs: 10.0, fat: 5.0 },

        // ---------------- Tofu / Soy / Vegan protein ----------------
        { id: "food_023", name: "Tofu (firm)", category: "Protein", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 76, protein: 8.0, carbs: 1.9, fat: 4.8 },
        { id: "food_024", name: "Tempeh", category: "Protein", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 192, protein: 20.3, carbs: 7.6, fat: 10.8 },
        { id: "food_025", name: "Soy Milk", category: "Dairy Alternative", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "ml", calories: 33, protein: 2.9, carbs: 1.8, fat: 1.6 },

        // ---------------- Paneer / Dairy (Vegetarian) ----------------
        { id: "food_026", name: "Paneer", category: "Protein", diet: "vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 265, protein: 18.3, carbs: 1.2, fat: 20.8 },
        { id: "food_027", name: "Curd / Yogurt (plain)", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast", "lunch", "dinner", "snack"], servingSize: 100, unit: "g", calories: 60, protein: 3.5, carbs: 4.7, fat: 3.3 },
        { id: "food_028", name: "Greek Yogurt (plain)", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 59, protein: 10.0, carbs: 3.6, fat: 0.4 },
        { id: "food_029", name: "Milk (toned)", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "ml", calories: 58, protein: 3.4, carbs: 5.0, fat: 3.0 },
        { id: "food_030", name: "Cottage Cheese", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 98, protein: 11.1, carbs: 3.4, fat: 4.3 },
        { id: "food_031", name: "Cheddar Cheese", category: "Dairy", diet: "vegetarian", mealTypes: ["snack", "breakfast"], servingSize: 30, unit: "g", calories: 120, protein: 7.4, carbs: 0.4, fat: 9.9 },

        // ---------------- Eggs (Vegetarian in this app's model) ----------------
        { id: "food_032", name: "Egg (boiled, whole)", category: "Protein", diet: "vegetarian", mealTypes: ["breakfast", "snack"], servingSize: 1, unit: "piece", calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
        { id: "food_033", name: "Egg White (boiled)", category: "Protein", diet: "vegetarian", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 52, protein: 11.0, carbs: 0.7, fat: 0.2 },
        { id: "food_034", name: "Omelette (2 eggs)", category: "Protein", diet: "vegetarian", mealTypes: ["breakfast"], servingSize: 1, unit: "piece", calories: 154, protein: 12.6, carbs: 1.6, fat: 11.0 },

        // ---------------- Non-Vegetarian ----------------
        { id: "food_035", name: "Chicken Breast (grilled)", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 165, protein: 31.0, carbs: 0.0, fat: 3.6 },
        { id: "food_036", name: "Chicken Curry", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 180, protein: 16.0, carbs: 6.0, fat: 10.0 },
        { id: "food_037", name: "Chicken Tikka", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner", "snack"], servingSize: 100, unit: "g", calories: 190, protein: 27.0, carbs: 3.0, fat: 7.5 },
        { id: "food_038", name: "Turkey Breast (cooked)", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 135, protein: 30.0, carbs: 0.0, fat: 1.0 },
        { id: "food_039", name: "Salmon (cooked)", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 206, protein: 22.0, carbs: 0.0, fat: 13.0 },
        { id: "food_040", name: "Tilapia (cooked)", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 128, protein: 26.0, carbs: 0.0, fat: 2.7 },
        { id: "food_041", name: "Tuna (canned, water)", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner", "snack"], servingSize: 100, unit: "g", calories: 116, protein: 25.5, carbs: 0.0, fat: 0.8 },
        { id: "food_042", name: "Shrimp (cooked)", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 99, protein: 24.0, carbs: 0.2, fat: 0.3 },
        { id: "food_043", name: "Fish Curry", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 150, protein: 18.0, carbs: 4.0, fat: 7.0 },
        { id: "food_044", name: "Mutton Curry", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 250, protein: 20.0, carbs: 4.0, fat: 17.0 },
        { id: "food_045", name: "Chicken Sausage", category: "Protein", diet: "non-vegetarian", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 180, protein: 15.0, carbs: 4.0, fat: 12.0 },

        // ---------------- Vegetables ----------------
        { id: "food_046", name: "Mixed Vegetables (steamed)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 35, protein: 2.0, carbs: 7.0, fat: 0.3 },
        { id: "food_047", name: "Broccoli (steamed)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4 },
        { id: "food_048", name: "Spinach (cooked)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 23, protein: 2.9, carbs: 3.8, fat: 0.4 },
        { id: "food_049", name: "Cauliflower (cooked)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 25, protein: 1.9, carbs: 5.0, fat: 0.3 },
        { id: "food_050", name: "Bhindi / Okra (sauteed)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 63, protein: 1.9, carbs: 7.0, fat: 3.2 },
        { id: "food_051", name: "Cucumber (raw)", category: "Vegetable", diet: "vegan", mealTypes: ["snack", "lunch"], servingSize: 100, unit: "g", calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1 },
        { id: "food_052", name: "Tomato (raw)", category: "Vegetable", diet: "vegan", mealTypes: ["snack", "lunch"], servingSize: 100, unit: "g", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
        { id: "food_053", name: "Salad (mixed greens, no dressing)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 20, protein: 1.5, carbs: 3.5, fat: 0.2 },

        // ---------------- Fruits ----------------
        { id: "food_054", name: "Banana", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 1, unit: "piece", calories: 105, protein: 1.3, carbs: 27.0, fat: 0.4 },
        { id: "food_055", name: "Apple", category: "Fruit", diet: "vegan", mealTypes: ["snack"], servingSize: 1, unit: "piece", calories: 95, protein: 0.5, carbs: 25.0, fat: 0.3 },
        { id: "food_056", name: "Orange", category: "Fruit", diet: "vegan", mealTypes: ["snack", "breakfast"], servingSize: 1, unit: "piece", calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2 },
        { id: "food_057", name: "Mango (sliced)", category: "Fruit", diet: "vegan", mealTypes: ["snack", "breakfast"], servingSize: 100, unit: "g", calories: 60, protein: 0.8, carbs: 15.0, fat: 0.4 },
        { id: "food_058", name: "Papaya (sliced)", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 43, protein: 0.5, carbs: 11.0, fat: 0.3 },
        { id: "food_059", name: "Watermelon (cubed)", category: "Fruit", diet: "vegan", mealTypes: ["snack"], servingSize: 100, unit: "g", calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2 },
        { id: "food_060", name: "Grapes", category: "Fruit", diet: "vegan", mealTypes: ["snack"], servingSize: 100, unit: "g", calories: 69, protein: 0.7, carbs: 18.0, fat: 0.2 },
        { id: "food_061", name: "Pomegranate (seeds)", category: "Fruit", diet: "vegan", mealTypes: ["snack", "breakfast"], servingSize: 100, unit: "g", calories: 83, protein: 1.7, carbs: 18.7, fat: 1.2 },

        // ---------------- Nuts / Seeds / Fats ----------------
        { id: "food_062", name: "Almonds", category: "Nuts", diet: "vegan", mealTypes: ["snack"], servingSize: 30, unit: "g", calories: 174, protein: 6.4, carbs: 6.5, fat: 15.0 },
        { id: "food_063", name: "Walnuts", category: "Nuts", diet: "vegan", mealTypes: ["snack"], servingSize: 30, unit: "g", calories: 196, protein: 4.6, carbs: 4.1, fat: 19.6 },
        { id: "food_064", name: "Peanut Butter", category: "Nuts", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 32, unit: "g", calories: 188, protein: 8.0, carbs: 6.0, fat: 16.0 },
        { id: "food_065", name: "Mixed Nuts", category: "Nuts", diet: "vegan", mealTypes: ["snack"], servingSize: 30, unit: "g", calories: 180, protein: 5.0, carbs: 6.0, fat: 16.0 },
        { id: "food_066", name: "Chia Seeds", category: "Seeds", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 15, unit: "g", calories: 73, protein: 2.5, carbs: 6.3, fat: 4.6 },
        { id: "food_067", name: "Flax Seeds", category: "Seeds", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 15, unit: "g", calories: 80, protein: 2.7, carbs: 4.3, fat: 6.3 },
        { id: "food_068", name: "Avocado", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "lunch", "snack"], servingSize: 100, unit: "g", calories: 160, protein: 2.0, carbs: 8.5, fat: 14.7 },
        { id: "food_069", name: "Olive Oil", category: "Fat", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 14, unit: "g", calories: 119, protein: 0.0, carbs: 0.0, fat: 13.5 },

        // ---------------- More grains / snack foods ----------------
        { id: "food_070", name: "Muesli", category: "Grain", diet: "vegan", mealTypes: ["breakfast"], servingSize: 50, unit: "g", calories: 180, protein: 4.5, carbs: 33.0, fat: 3.0 },
        { id: "food_071", name: "Granola Bar", category: "Snack", diet: "vegetarian", mealTypes: ["snack"], servingSize: 1, unit: "piece", calories: 140, protein: 3.0, carbs: 20.0, fat: 5.5 },
        { id: "food_072", name: "Protein Shake (whey, water)", category: "Protein", diet: "vegetarian", mealTypes: ["breakfast", "snack"], servingSize: 250, unit: "ml", calories: 120, protein: 24.0, carbs: 3.0, fat: 1.5 },
        { id: "food_073", name: "Plant Protein Shake (pea, water)", category: "Protein", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 250, unit: "ml", calories: 110, protein: 22.0, carbs: 2.0, fat: 1.5 },
        { id: "food_074", name: "Sprouts Salad (mixed)", category: "Legume", diet: "vegan", mealTypes: ["breakfast", "snack", "lunch"], servingSize: 100, unit: "g", calories: 90, protein: 7.0, carbs: 15.0, fat: 0.6 },
        { id: "food_075", name: "Vegetable Soup (clear)", category: "Vegetable", diet: "vegan", mealTypes: ["dinner", "lunch"], servingSize: 200, unit: "ml", calories: 70, protein: 2.5, carbs: 12.0, fat: 1.2 },
        { id: "food_076", name: "Lentil Soup", category: "Legume", diet: "vegan", mealTypes: ["dinner", "lunch"], servingSize: 200, unit: "ml", calories: 150, protein: 10.0, carbs: 24.0, fat: 1.5 },
        { id: "food_077", name: "Chicken Soup", category: "Protein", diet: "non-vegetarian", mealTypes: ["dinner"], servingSize: 200, unit: "ml", calories: 120, protein: 12.0, carbs: 8.0, fat: 4.5 },
        { id: "food_078", name: "Sweet Potato Fries (baked)", category: "Vegetable", diet: "vegan", mealTypes: ["snack", "dinner"], servingSize: 100, unit: "g", calories: 150, protein: 2.0, carbs: 26.0, fat: 4.5 },
        { id: "food_079", name: "Roasted Chickpeas", category: "Legume", diet: "vegan", mealTypes: ["snack"], servingSize: 30, unit: "g", calories: 120, protein: 5.5, carbs: 17.0, fat: 3.5 },
        { id: "food_080", name: "Rice Cakes", category: "Grain", diet: "vegan", mealTypes: ["snack"], servingSize: 2, unit: "piece", calories: 70, protein: 1.4, carbs: 15.0, fat: 0.4 },
        { id: "food_081", name: "Buttermilk (spiced)", category: "Dairy", diet: "vegetarian", mealTypes: ["lunch", "snack"], servingSize: 200, unit: "ml", calories: 40, protein: 2.6, carbs: 3.6, fat: 1.6 },
        { id: "food_082", name: "Paneer Tikka", category: "Protein", diet: "vegetarian", mealTypes: ["snack", "dinner"], servingSize: 100, unit: "g", calories: 230, protein: 16.0, carbs: 5.0, fat: 16.0 },
        { id: "food_083", name: "Vegetable Pulao", category: "Grain", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 150, unit: "g", calories: 220, protein: 4.5, carbs: 38.0, fat: 5.5 },
        { id: "food_084", name: "Chole (chickpea curry)", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 150, unit: "g", calories: 210, protein: 9.5, carbs: 30.0, fat: 6.0 },
        { id: "food_085", name: "Egg Curry", category: "Protein", diet: "vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 150, unit: "g", calories: 240, protein: 13.5, carbs: 6.0, fat: 18.0 },
        { id: "food_086", name: "Grilled Chicken Salad", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 200, unit: "g", calories: 260, protein: 32.0, carbs: 8.0, fat: 10.0 },
        { id: "food_087", name: "Vegetable Stir Fry (light oil)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 150, unit: "g", calories: 110, protein: 3.5, carbs: 12.0, fat: 5.5 }
    ];

    /* ---------------------------------------------------
       Core storage helpers
    --------------------------------------------------- */
    function safeParse(raw, fallback) {
        try {
            var parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return fallback;
            return parsed;
        } catch (err) {
            console.warn("mm_food_database: corrupted data, reseeding.", err);
            return fallback;
        }
    }

    function reseed() {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_FOODS));
        window.localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
        return SEED_FOODS.slice();
    }

    function init() {
        try {
            var storedVersion = window.localStorage.getItem(VERSION_KEY);
            var existing = window.localStorage.getItem(STORAGE_KEY);

            // No cached data yet -> seed fresh.
            if (existing === null) {
                return reseed();
            }

            // Cached data exists, but it predates data versioning (or was
            // seeded by an older build of this file) -> refresh it so
            // fixes like the vegan/vegetarian/non-vegetarian hierarchy
            // actually reach users who already had a database saved.
            if (storedVersion === null || parseInt(storedVersion, 10) !== DATA_VERSION) {
                return reseed();
            }

            var parsed = safeParse(existing, null);
            if (parsed === null || parsed.length === 0) {
                // corrupted or empty -> reseed, but don't silently destroy
                // anything that looks intentional (empty array from user
                // action is still respected once, but null/invalid is not).
                return reseed();
            }
            return parsed;
        } catch (err) {
            console.warn("LocalStorage unavailable, using in-memory seed data.", err);
            return SEED_FOODS.slice();
        }
    }

    function getAll() {
        try {
            var raw = window.localStorage.getItem(STORAGE_KEY);
            var storedVersion = window.localStorage.getItem(VERSION_KEY);
            if (raw === null || storedVersion === null || parseInt(storedVersion, 10) !== DATA_VERSION) {
                return init();
            }
            var parsed = safeParse(raw, null);
            if (parsed === null) {
                return init();
            }
            return parsed;
        } catch (err) {
            return SEED_FOODS.slice();
        }
    }

    function resetToSeed() {
        return reseed();
    }

    function count() {
        return getAll().length;
    }

    global.FoodDatabaseService = {
        STORAGE_KEY: STORAGE_KEY,
        init: init,
        getAll: getAll,
        resetToSeed: resetToSeed,
        count: count
    };

    // Initialize immediately on script load so the DB is always ready.
    init();

})(window);
