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
<<<<<<< HEAD
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

{ id: "food_012", name: "Potato (boiled)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 87, protein: 1.9, carbs: 20.1, fat: 0.1 },

{ id: "food_013", name: "Sweet Potato (boiled)", category: "Vegetable", diet: "vegan", mealTypes: ["breakfast", "lunch", "snack"], servingSize: 100, unit: "g", calories: 76, protein: 1.4, carbs: 17.7, fat: 0.1 },

{ id: "food_014", name: "Broccoli (steamed)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4 },

{ id: "food_015", name: "Cauliflower (boiled)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 23, protein: 1.8, carbs: 4.1, fat: 0.5 },

{ id: "food_016", name: "Spinach (cooked)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 23, protein: 3.0, carbs: 3.8, fat: 0.3 },

{ id: "food_017", name: "Carrot (raw)", category: "Vegetable", diet: "vegan", mealTypes: ["snack", "lunch"], servingSize: 100, unit: "g", calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2 },

{ id: "food_018", name: "Cucumber", category: "Vegetable", diet: "vegan", mealTypes: ["snack", "lunch"], servingSize: 100, unit: "g", calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1 },

{ id: "food_019", name: "Tomato", category: "Vegetable", diet: "vegan", mealTypes: ["breakfast", "lunch", "dinner"], servingSize: 100, unit: "g", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },

{ id: "food_020", name: "Onion", category: "Vegetable", diet: "vegan", mealTypes: ["breakfast", "lunch", "dinner"], servingSize: 100, unit: "g", calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1 },

{ id: "food_021", name: "Green Peas", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 81, protein: 5.4, carbs: 14.5, fat: 0.4 },

{ id: "food_022", name: "Mushrooms", category: "Vegetable", diet: "vegan", mealTypes: ["breakfast", "lunch", "dinner"], servingSize: 100, unit: "g", calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3 },

{ id: "food_023", name: "Bell Pepper", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner", "snack"], servingSize: 100, unit: "g", calories: 31, protein: 1.0, carbs: 6.0, fat: 0.3 },

{ id: "food_024", name: "Beetroot", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner", "snack"], servingSize: 100, unit: "g", calories: 43, protein: 1.6, carbs: 10.0, fat: 0.2 },

{ id: "food_025", name: "Cabbage", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1 },

{ id: "food_026", name: "Okra (Bhindi)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 33, protein: 1.9, carbs: 7.5, fat: 0.2 },

{ id: "food_027", name: "Eggplant (Baingan)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 25, protein: 1.0, carbs: 5.9, fat: 0.2 },

{ id: "food_028", name: "Bottle Gourd (Lauki)", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 15, protein: 0.6, carbs: 3.4, fat: 0.1 },

{ id: "food_029", name: "Green Beans", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 31, protein: 1.8, carbs: 7.0, fat: 0.2 },

{ id: "food_030", name: "Pumpkin", category: "Vegetable", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 26, protein: 1.0, carbs: 6.5, fat: 0.1 },

{ id: "food_031", name: "Banana", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 118, unit: "g", calories: 105, protein: 1.3, carbs: 27.0, fat: 0.4 },

{ id: "food_032", name: "Apple", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 182, unit: "g", calories: 95, protein: 0.5, carbs: 25.0, fat: 0.3 },

{ id: "food_033", name: "Orange", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 131, unit: "g", calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2 },

{ id: "food_034", name: "Mango", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 60, protein: 0.8, carbs: 15.0, fat: 0.4 },

{ id: "food_035", name: "Papaya", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 43, protein: 0.5, carbs: 11.0, fat: 0.3 },

{ id: "food_036", name: "Guava", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 68, protein: 2.6, carbs: 14.0, fat: 1.0 },

{ id: "food_037", name: "Pomegranate", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 83, protein: 1.7, carbs: 18.7, fat: 1.2 },

{ id: "food_038", name: "Pineapple", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 50, protein: 0.5, carbs: 13.1, fat: 0.1 },

{ id: "food_039", name: "Watermelon", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2 },

{ id: "food_040", name: "Grapes", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 69, protein: 0.7, carbs: 18.1, fat: 0.2 },

{ id: "food_041", name: "Strawberries", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },

{ id: "food_042", name: "Blueberries", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },

{ id: "food_043", name: "Kiwi", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 61, protein: 1.1, carbs: 14.7, fat: 0.5 },

{ id: "food_044", name: "Pear", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 57, protein: 0.4, carbs: 15.2, fat: 0.1 },

{ id: "food_045", name: "Dates", category: "Fruit", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 40, unit: "g", calories: 113, protein: 0.9, carbs: 30.0, fat: 0.1 },

{ id: "food_046", name: "Chickpeas (boiled)", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner", "snack"], servingSize: 100, unit: "g", calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6 },

{ id: "food_047", name: "Rajma (cooked)", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 127, protein: 8.7, carbs: 22.8, fat: 0.5 },

{ id: "food_048", name: "Moong Dal (cooked)", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 105, protein: 7.0, carbs: 19.2, fat: 0.4 },

{ id: "food_049", name: "Masoor Dal (cooked)", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 116, protein: 9.0, carbs: 20.1, fat: 0.4 },

{ id: "food_050", name: "Toor Dal (cooked)", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 120, protein: 7.0, carbs: 21.0, fat: 1.0 },

{ id: "food_051", name: "Chana Dal (cooked)", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 164, protein: 8.9, carbs: 27.0, fat: 2.6 },

{ id: "food_052", name: "Black Chana (boiled)", category: "Legume", diet: "vegan", mealTypes: ["breakfast", "lunch", "snack"], servingSize: 100, unit: "g", calories: 164, protein: 8.9, carbs: 27.0, fat: 2.6 },

{ id: "food_053", name: "Soybeans (cooked)", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 173, protein: 16.6, carbs: 9.9, fat: 9.0 },

{ id: "food_054", name: "Soy Chunks (cooked)", category: "Protein", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 160, protein: 16.0, carbs: 12.0, fat: 5.0 },

{ id: "food_055", name: "Tofu (firm)", category: "Protein", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 144, protein: 15.0, carbs: 3.0, fat: 9.0 },

{ id: "food_056", name: "Tempeh", category: "Protein", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 193, protein: 19.0, carbs: 9.0, fat: 11.0 },

{ id: "food_057", name: "Edamame", category: "Legume", diet: "vegan", mealTypes: ["snack", "lunch"], servingSize: 100, unit: "g", calories: 121, protein: 11.9, carbs: 8.9, fat: 5.2 },

{ id: "food_058", name: "Paneer", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast", "lunch", "dinner", "snack"], servingSize: 100, unit: "g", calories: 265, protein: 18.0, carbs: 3.4, fat: 20.0 },

{ id: "food_059", name: "Low Fat Paneer", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast", "lunch", "dinner"], servingSize: 100, unit: "g", calories: 180, protein: 25.0, carbs: 3.0, fat: 8.0 },

{ id: "food_060", name: "Greek Yogurt", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast", "snack"], servingSize: 170, unit: "g", calories: 100, protein: 17.0, carbs: 6.0, fat: 0.7 },

{ id: "food_061", name: "Curd", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast", "lunch", "dinner"], servingSize: 200, unit: "g", calories: 122, protein: 7.0, carbs: 9.0, fat: 6.0 },

{ id: "food_062", name: "Milk (toned)", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast"], servingSize: 250, unit: "ml", calories: 122, protein: 8.0, carbs: 12.0, fat: 5.0 },

{ id: "food_063", name: "Skimmed Milk", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast"], servingSize: 250, unit: "ml", calories: 85, protein: 8.5, carbs: 12.0, fat: 0.2 },

{ id: "food_064", name: "Full Cream Milk", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast"], servingSize: 250, unit: "ml", calories: 153, protein: 8.0, carbs: 12.0, fat: 8.0 },

{ id: "food_065", name: "Buttermilk", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast", "lunch"], servingSize: 250, unit: "ml", calories: 75, protein: 4.0, carbs: 7.0, fat: 3.0 },

{ id: "food_066", name: "Cottage Cheese", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 98, protein: 11.0, carbs: 3.4, fat: 4.3 },

{ id: "food_067", name: "Cheddar Cheese", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast", "snack"], servingSize: 30, unit: "g", calories: 121, protein: 7.5, carbs: 0.4, fat: 10.0 },

{ id: "food_068", name: "Mozzarella Cheese", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast", "snack"], servingSize: 30, unit: "g", calories: 85, protein: 6.3, carbs: 0.7, fat: 6.3 },

{ id: "food_069", name: "Whey Protein", category: "Protein", diet: "vegetarian", mealTypes: ["breakfast", "snack"], servingSize: 30, unit: "g", calories: 120, protein: 24.0, carbs: 3.0, fat: 1.5 },

{ id: "food_070", name: "Whey Protein Isolate", category: "Protein", diet: "vegetarian", mealTypes: ["breakfast", "snack"], servingSize: 30, unit: "g", calories: 110, protein: 25.0, carbs: 1.0, fat: 0.5 },

{ id: "food_071", name: "Eggs (whole)", category: "Protein", diet: "vegetarian", mealTypes: ["breakfast", "snack"], servingSize: 50, unit: "g", calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },

{ id: "food_072", name: "Egg Whites", category: "Protein", diet: "vegetarian", mealTypes: ["breakfast", "snack"], servingSize: 100, unit: "g", calories: 52, protein: 11.0, carbs: 0.7, fat: 0.2 },

{ id: "food_073", name: "Omelette", category: "Protein", diet: "vegetarian", mealTypes: ["breakfast"], servingSize: 100, unit: "g", calories: 154, protein: 10.0, carbs: 1.5, fat: 12.0 },

{ id: "food_074", name: "Almonds", category: "Nuts", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 28, unit: "g", calories: 164, protein: 6.0, carbs: 6.0, fat: 14.0 },

{ id: "food_075", name: "Walnuts", category: "Nuts", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 28, unit: "g", calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5 },

{ id: "food_076", name: "Cashews", category: "Nuts", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 28, unit: "g", calories: 157, protein: 5.2, carbs: 9.0, fat: 12.4 },

{ id: "food_077", name: "Pistachios", category: "Nuts", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 28, unit: "g", calories: 159, protein: 5.8, carbs: 8.0, fat: 12.6 },

{ id: "food_078", name: "Peanuts", category: "Nuts", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 28, unit: "g", calories: 166, protein: 7.0, carbs: 6.0, fat: 14.0 },

{ id: "food_079", name: "Peanut Butter", category: "Fat", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 32, unit: "g", calories: 190, protein: 8.0, carbs: 6.0, fat: 16.0 },

{ id: "food_080", name: "Almond Butter", category: "Fat", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 32, unit: "g", calories: 196, protein: 6.7, carbs: 6.0, fat: 18.0 },

{ id: "food_081", name: "Chia Seeds", category: "Seeds", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 28, unit: "g", calories: 138, protein: 4.7, carbs: 12.0, fat: 8.7 },

{ id: "food_082", name: "Flax Seeds", category: "Seeds", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 28, unit: "g", calories: 151, protein: 5.2, carbs: 8.2, fat: 12.0 },

{ id: "food_083", name: "Pumpkin Seeds", category: "Seeds", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 28, unit: "g", calories: 151, protein: 8.5, carbs: 4.2, fat: 13.0 },

{ id: "food_084", name: "Sunflower Seeds", category: "Seeds", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 28, unit: "g", calories: 164, protein: 5.8, carbs: 6.5, fat: 14.3 },

{ id: "food_085", name: "Avocado", category: "Fat", diet: "vegan", mealTypes: ["breakfast", "lunch", "snack"], servingSize: 100, unit: "g", calories: 160, protein: 2.0, carbs: 8.5, fat: 14.7 },

{ id: "food_086", name: "Olive Oil", category: "Fat", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 14, unit: "ml", calories: 119, protein: 0, carbs: 0, fat: 14.0 },

{ id: "food_087", name: "Coconut Oil", category: "Fat", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 14, unit: "ml", calories: 121, protein: 0, carbs: 0, fat: 13.5 },

{ id: "food_088", name: "Ghee", category: "Fat", diet: "vegetarian", mealTypes: ["breakfast", "lunch", "dinner"], servingSize: 14, unit: "g", calories: 126, protein: 0, carbs: 0, fat: 14.0 },

{ id: "food_089", name: "Butter", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast", "lunch"], servingSize: 14, unit: "g", calories: 102, protein: 0.1, carbs: 0, fat: 11.5 },

{ id: "food_090", name: "Chicken Breast (grilled)", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 165, protein: 31.0, carbs: 0, fat: 3.6 },

{ id: "food_091", name: "Chicken Thigh", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 209, protein: 26.0, carbs: 0, fat: 10.9 },

{ id: "food_092", name: "Chicken Tikka", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner", "snack"], servingSize: 100, unit: "g", calories: 150, protein: 24.0, carbs: 3.0, fat: 5.0 },

{ id: "food_093", name: "Chicken Curry", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 200, unit: "g", calories: 300, protein: 30.0, carbs: 8.0, fat: 16.0 },

{ id: "food_094", name: "Chicken Biryani", category: "Grain", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 250, unit: "g", calories: 420, protein: 24.0, carbs: 48.0, fat: 14.0 },

{ id: "food_095", name: "Turkey Breast", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner", "snack"], servingSize: 100, unit: "g", calories: 135, protein: 29.0, carbs: 0, fat: 1.8 },

{ id: "food_096", name: "Salmon", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 208, protein: 20.0, carbs: 0, fat: 13.0 },

{ id: "food_097", name: "Tuna (canned)", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner", "snack"], servingSize: 100, unit: "g", calories: 116, protein: 26.0, carbs: 0, fat: 1.0 },

{ id: "food_098", name: "Prawns (grilled)", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 99, protein: 24.0, carbs: 0.2, fat: 0.3 },

{ id: "food_099", name: "Rohu Fish", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 97, protein: 17.0, carbs: 0, fat: 3.0 },

{ id: "food_100", name: "Mackerel", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 205, protein: 19.0, carbs: 0, fat: 14.0 },

{ id: "food_101", name: "Sardines", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 208, protein: 25.0, carbs: 0, fat: 11.0 },

{ id: "food_102", name: "Mutton", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 258, protein: 25.0, carbs: 0, fat: 17.0 },

{ id: "food_103", name: "Lean Beef", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 100, unit: "g", calories: 217, protein: 26.0, carbs: 0, fat: 12.0 },

{ id: "food_104", name: "Fish Curry", category: "Protein", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 200, unit: "g", calories: 260, protein: 28.0, carbs: 7.0, fat: 13.0 },

{ id: "food_105", name: "Chicken Soup", category: "Soup", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 250, unit: "ml", calories: 120, protein: 15.0, carbs: 5.0, fat: 4.0 },

{ id: "food_106", name: "Chicken Salad", category: "Salad", diet: "non-vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 250, unit: "g", calories: 280, protein: 32.0, carbs: 12.0, fat: 12.0 },

{ id: "food_107", name: "Vegetable Khichdi", category: "Grain", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 250, unit: "g", calories: 280, protein: 9.0, carbs: 48.0, fat: 6.0 },

{ id: "food_108", name: "Dal Khichdi", category: "Grain", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 250, unit: "g", calories: 300, protein: 11.0, carbs: 50.0, fat: 6.0 },

{ id: "food_109", name: "Vegetable Pulao", category: "Grain", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 250, unit: "g", calories: 320, protein: 7.0, carbs: 54.0, fat: 8.0 },

{ id: "food_110", name: "Jeera Rice", category: "Grain", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 200, unit: "g", calories: 270, protein: 5.0, carbs: 48.0, fat: 6.0 },

{ id: "food_111", name: "Rajma Masala", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 200, unit: "g", calories: 260, protein: 14.0, carbs: 42.0, fat: 5.0 },

{ id: "food_112", name: "Chole Masala", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 200, unit: "g", calories: 280, protein: 14.0, carbs: 42.0, fat: 7.0 },

{ id: "food_113", name: "Dal Tadka", category: "Legume", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 200, unit: "g", calories: 230, protein: 12.0, carbs: 30.0, fat: 7.0 },

{ id: "food_114", name: "Palak Paneer", category: "Dairy", diet: "vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 200, unit: "g", calories: 300, protein: 17.0, carbs: 12.0, fat: 21.0 },

{ id: "food_115", name: "Matar Paneer", category: "Dairy", diet: "vegetarian", mealTypes: ["lunch", "dinner"], servingSize: 200, unit: "g", calories: 310, protein: 16.0, carbs: 18.0, fat: 21.0 },

{ id: "food_116", name: "Paneer Tikka", category: "Dairy", diet: "vegetarian", mealTypes: ["lunch", "dinner", "snack"], servingSize: 150, unit: "g", calories: 300, protein: 22.0, carbs: 8.0, fat: 20.0 },

{ id: "food_117", name: "Paneer Bhurji", category: "Dairy", diet: "vegetarian", mealTypes: ["breakfast", "lunch", "dinner"], servingSize: 150, unit: "g", calories: 300, protein: 20.0, carbs: 8.0, fat: 21.0 },

{ id: "food_118", name: "Aloo Paratha", category: "Grain", diet: "vegetarian", mealTypes: ["breakfast", "lunch"], servingSize: 120, unit: "g", calories: 280, protein: 7.0, carbs: 42.0, fat: 9.0 },

{ id: "food_119", name: "Paneer Paratha", category: "Grain", diet: "vegetarian", mealTypes: ["breakfast", "lunch"], servingSize: 120, unit: "g", calories: 320, protein: 12.0, carbs: 38.0, fat: 13.0 },

{ id: "food_120", name: "Besan Chilla", category: "Breakfast", diet: "vegan", mealTypes: ["breakfast"], servingSize: 100, unit: "g", calories: 180, protein: 8.0, carbs: 24.0, fat: 5.0 },

{ id: "food_121", name: "Moong Dal Chilla", category: "Breakfast", diet: "vegan", mealTypes: ["breakfast"], servingSize: 100, unit: "g", calories: 160, protein: 9.0, carbs: 25.0, fat: 3.0 },

{ id: "food_122", name: "Upma", category: "Grain", diet: "vegan", mealTypes: ["breakfast"], servingSize: 200, unit: "g", calories: 220, protein: 6.0, carbs: 35.0, fat: 6.0 },

{ id: "food_123", name: "Vegetable Upma", category: "Grain", diet: "vegan", mealTypes: ["breakfast"], servingSize: 200, unit: "g", calories: 230, protein: 6.0, carbs: 36.0, fat: 7.0 },

{ id: "food_124", name: "Idli Sambar", category: "Breakfast", diet: "vegan", mealTypes: ["breakfast", "lunch"], servingSize: 250, unit: "g", calories: 240, protein: 9.0, carbs: 42.0, fat: 4.0 },

{ id: "food_125", name: "Masala Dosa", category: "Grain", diet: "vegan", mealTypes: ["breakfast"], servingSize: 150, unit: "g", calories: 300, protein: 6.0, carbs: 45.0, fat: 10.0 },

{ id: "food_126", name: "Peanut Chaat", category: "Snack", diet: "vegan", mealTypes: ["snack"], servingSize: 100, unit: "g", calories: 180, protein: 8.0, carbs: 16.0, fat: 10.0 },

{ id: "food_127", name: "Roasted Chickpeas", category: "Snack", diet: "vegan", mealTypes: ["snack"], servingSize: 40, unit: "g", calories: 130, protein: 6.0, carbs: 20.0, fat: 3.0 },

{ id: "food_128", name: "Hummus", category: "Snack", diet: "vegan", mealTypes: ["snack", "lunch"], servingSize: 50, unit: "g", calories: 166, protein: 4.0, carbs: 14.0, fat: 9.0 },

{ id: "food_129", name: "Popcorn (air-popped)", category: "Snack", diet: "vegan", mealTypes: ["snack"], servingSize: 30, unit: "g", calories: 116, protein: 3.5, carbs: 23.0, fat: 1.3 },

{ id: "food_130", name: "Dark Chocolate 70%", category: "Snack", diet: "vegan", mealTypes: ["snack"], servingSize: 20, unit: "g", calories: 107, protein: 1.4, carbs: 9.0, fat: 7.8 },

{ id: "food_131", name: "Protein Bar", category: "Snack", diet: "vegetarian", mealTypes: ["snack"], servingSize: 60, unit: "g", calories: 220, protein: 20.0, carbs: 22.0, fat: 7.0 },

{ id: "food_132", name: "Vegan Protein Bar", category: "Snack", diet: "vegan", mealTypes: ["snack"], servingSize: 60, unit: "g", calories: 210, protein: 15.0, carbs: 24.0, fat: 7.0 },

{ id: "food_133", name: "Soy Milk", category: "Dairy Alternative", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 250, unit: "ml", calories: 80, protein: 7.0, carbs: 4.0, fat: 4.0 },

{ id: "food_134", name: "Almond Milk", category: "Dairy Alternative", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 250, unit: "ml", calories: 40, protein: 1.5, carbs: 2.0, fat: 3.0 },

{ id: "food_135", name: "Oat Milk", category: "Dairy Alternative", diet: "vegan", mealTypes: ["breakfast"], servingSize: 250, unit: "ml", calories: 120, protein: 3.0, carbs: 16.0, fat: 5.0 },

{ id: "food_136", name: "Lentil Soup", category: "Soup", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 250, unit: "ml", calories: 180, protein: 12.0, carbs: 27.0, fat: 3.0 },

{ id: "food_137", name: "Vegetable Soup", category: "Soup", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 250, unit: "ml", calories: 100, protein: 4.0, carbs: 16.0, fat: 3.0 },

{ id: "food_138", name: "Tomato Soup", category: "Soup", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 250, unit: "ml", calories: 90, protein: 2.0, carbs: 16.0, fat: 2.0 },

{ id: "food_139", name: "Garden Salad", category: "Salad", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 200, unit: "g", calories: 80, protein: 3.0, carbs: 15.0, fat: 1.0 },

{ id: "food_140", name: "Fruit Salad", category: "Salad", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 250, unit: "g", calories: 150, protein: 2.0, carbs: 37.0, fat: 0.5 },

{ id: "food_141", name: "Quinoa Salad", category: "Salad", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 250, unit: "g", calories: 300, protein: 10.0, carbs: 42.0, fat: 10.0 },

{ id: "food_142", name: "Vegetable Sandwich", category: "Sandwich", diet: "vegan", mealTypes: ["breakfast", "lunch", "snack"], servingSize: 180, unit: "g", calories: 300, protein: 9.0, carbs: 45.0, fat: 8.0 },

{ id: "food_143", name: "Peanut Butter Toast", category: "Snack", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 90, unit: "g", calories: 280, protein: 10.0, carbs: 34.0, fat: 12.0 },

{ id: "food_144", name: "Avocado Toast", category: "Breakfast", diet: "vegan", mealTypes: ["breakfast"], servingSize: 120, unit: "g", calories: 250, protein: 6.0, carbs: 32.0, fat: 11.0 },

{ id: "food_145", name: "Granola", category: "Grain", diet: "vegan", mealTypes: ["breakfast", "snack"], servingSize: 50, unit: "g", calories: 220, protein: 5.0, carbs: 34.0, fat: 8.0 },

{ id: "food_146", name: "Muesli", category: "Grain", diet: "vegan", mealTypes: ["breakfast"], servingSize: 50, unit: "g", calories: 190, protein: 5.0, carbs: 32.0, fat: 5.0 },

{ id: "food_147", name: "Whole Wheat Pasta", category: "Grain", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 180, unit: "g", calories: 280, protein: 10.0, carbs: 55.0, fat: 2.0 },

{ id: "food_148", name: "Vegetable Pasta", category: "Grain", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 250, unit: "g", calories: 330, protein: 11.0, carbs: 55.0, fat: 8.0 },

{ id: "food_149", name: "Vegetable Biryani", category: "Grain", diet: "vegan", mealTypes: ["lunch", "dinner"], servingSize: 250, unit: "g", calories: 330, protein: 8.0, carbs: 52.0, fat: 9.0 },

{ id: "food_150", name: "Whole Wheat Paratha", category: "Grain", diet: "vegetarian", mealTypes: ["breakfast", "lunch"], servingSize: 80, unit: "g", calories: 260, protein: 6.0, carbs: 35.0, fat: 11.0 },
=======
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
>>>>>>> 32886f11d1fbed323ca11cc69a409de02ed8a54c
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
