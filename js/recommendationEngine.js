(function (global) {
    "use strict";

   
    var TOLERANCE_PERCENT = 8;
    var WEIGHTS = {
        calories: 0.30,
        protein: 0.35,
        carbs: 0.20,
        fat: 0.15
    };

    var MEAL_NAME_SUFFIXES = ["Plate", "Bowl", "Combo", "Meal"];


    function isDietCompatible(foodDiet, selectedDiet) {
        if (selectedDiet === "vegan") return foodDiet === "vegan";
        if (selectedDiet === "vegetarian") return foodDiet === "vegan" || foodDiet === "vegetarian";

        return true;
    }

    function strictestDietLabel(foods) {
        var allVegan = foods.every(function (f) { return f.diet === "vegan"; });
        if (allVegan) return "Vegan";
        var allVegOrVegan = foods.every(function (f) { return f.diet === "vegan" || f.diet === "vegetarian"; });
        if (allVegOrVegan) return "Vegetarian";
        return "Non-Vegetarian";
    }


    function buildCandidatePool(filteredFoods, maxItems) {
        var poolSize;
        if (maxItems <= 1) poolSize = 60;
        else if (maxItems === 2) poolSize = 40;
        else if (maxItems === 3) poolSize = 26;
        else poolSize = 20;

        if (filteredFoods.length <= poolSize) return filteredFoods.slice();


        var sorted = filteredFoods.slice().sort(function (a, b) {
            var aScore = (a.protein / Math.max(a.calories, 1));
            var bScore = (b.protein / Math.max(b.calories, 1));
            return bScore - aScore;
        });
        return sorted.slice(0, poolSize);
    }


    function generateCombinations(pool, maxItems) {
        var results = [];
        var maxSize = Math.max(1, Math.min(maxItems, 6));

        function recurse(startIndex, current) {
            if (current.length >= 1) {
                results.push(current.slice());
            }
            if (current.length === maxSize) return;
            for (var i = startIndex; i < pool.length; i++) {
                current.push(pool[i]);
                recurse(i + 1, current);
                current.pop();
            }
        }

        recurse(0, []);
        return results;
    }


    function roundQuantity(food, rawQty) {
        if (food.unit === "piece") {
            var rounded = Math.round(rawQty * 2) / 2; 
            return Math.max(0.5, rounded);
        }
        
        var roundedWeight = Math.round(rawQty / 25) * 25;
        return Math.max(25, roundedWeight);
    }

    function nutritionForQuantity(food, qty) {
        var ratio = qty / food.servingSize;
        return {
            calories: food.calories * ratio,
            protein: food.protein * ratio,
            carbs: food.carbs * ratio,
            fat: food.fat * ratio
        };
    }


    function similarity(actual, target) {
        if (target <= 0) return actual === 0 ? 1 : 0;
        var diffRatio = Math.abs(actual - target) / target;
        return Math.max(0, 1 - diffRatio);
    }

    function computeScore(totals, target) {
        var sCal = similarity(totals.calories, target.calories);
        var sPro = similarity(totals.protein, target.protein);
        var sCarb = similarity(totals.carbs, target.carbs);
        var sFat = similarity(totals.fat, target.fat);

        var weighted =
            sCal * WEIGHTS.calories +
            sPro * WEIGHTS.protein +
            sCarb * WEIGHTS.carbs +
            sFat * WEIGHTS.fat;

        return Math.round(weighted * 1000) / 10; 
    }

    function isWithinTolerance(totals, target, tolerancePercent) {
        var band = tolerancePercent / 100;
        function within(actual, targetVal) {
            if (targetVal <= 0) return true;
            return Math.abs(actual - targetVal) / targetVal <= band;
        }
        return within(totals.calories, target.calories) &&
            within(totals.protein, target.protein) &&
            within(totals.carbs, target.carbs) &&
            within(totals.fat, target.fat);
    }

    function evaluateCombo(combo, target) {
        var baseTotals = combo.reduce(function (acc, food) {
            acc.calories += food.calories;
            acc.protein += food.protein;
            acc.carbs += food.carbs;
            acc.fat += food.fat;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

        if (baseTotals.calories <= 0) return null;

        var scaleFromCalories = target.calories / baseTotals.calories;
        var scaleFromProtein = baseTotals.protein > 0 ? target.protein / baseTotals.protein : scaleFromCalories;

        var rawVariants = [
            scaleFromCalories,
            scaleFromCalories * 0.85,
            scaleFromCalories * 1.15,
            scaleFromProtein,
            (scaleFromCalories + scaleFromProtein) / 2
        ];

        var bestVariant = null;

        for (var v = 0; v < rawVariants.length; v++) {
            var scale = Math.min(4, Math.max(0.3, rawVariants[v]));

            var items = combo.map(function (food) {
                var rawQty = food.servingSize * scale;
                var qty = roundQuantity(food, rawQty);
                var nutrition = nutritionForQuantity(food, qty);
                return {
                    id: food.id,
                    name: food.name,
                    unit: food.unit,
                    quantity: qty,
                    calories: nutrition.calories,
                    protein: nutrition.protein,
                    carbs: nutrition.carbs,
                    fat: nutrition.fat
                };
            });

            var totals = items.reduce(function (acc, item) {
                acc.calories += item.calories;
                acc.protein += item.protein;
                acc.carbs += item.carbs;
                acc.fat += item.fat;
                return acc;
            }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

            var score = computeScore(totals, target);

            if (!bestVariant || score > bestVariant.score) {
                bestVariant = { items: items, totals: totals, score: score };
            }
        }

        return bestVariant;
    }
    function generateMealName(items, mealType) {
        var names = items.slice(0, 2).map(function (item) {
            return item.name.replace(/\s*\([^)]*\)/g, "").trim();
        });
        var base = names.join(" & ");

        var hasSoupOrCurry = items.some(function (item) {
            return /soup|curry|dal|chole/i.test(item.name);
        });

        var suffix;
        if (hasSoupOrCurry) {
            suffix = "Bowl";
        } else {
            
            var hash = items.reduce(function (acc, it) { return acc + it.name.length; }, 0);
            suffix = MEAL_NAME_SUFFIXES[hash % MEAL_NAME_SUFFIXES.length];
        }

        return base + " " + suffix;
    }


    function generate(target, options) {
        options = options || {};
        var mealType = options.mealType;
        var diet = options.diet;
        var maxItems = Math.max(1, Math.min(parseInt(options.maxItems, 10) || 3, 6));
        var useWhatIHave = !!options.useWhatIHave;
        var tolerancePercent = typeof options.tolerancePercent === "number"
            ? options.tolerancePercent
            : TOLERANCE_PERCENT;

        var allFoods = global.FoodDatabaseService.getAll();

        var filtered = allFoods.filter(function (food) {
            if (!isDietCompatible(food.diet, diet)) return false;
            if (mealType && Array.isArray(food.mealTypes) && food.mealTypes.indexOf(mealType) === -1) return false;
            if (useWhatIHave && !global.PantryService.has(food.id)) return false;
            return true;
        });

        if (filtered.length === 0) {
            return { recommendations: [], reason: useWhatIHave ? "empty-pantry" : "no-foods" };
        }

        var pool = buildCandidatePool(filtered, maxItems);
        var combos = generateCombinations(pool, maxItems);

        var evaluated = [];
        var seenSignatures = {};

        for (var i = 0; i < combos.length; i++) {
            var combo = combos[i];
            var signature = combo.map(function (f) { return f.id; }).sort().join("|");
            if (seenSignatures[signature]) continue;
            seenSignatures[signature] = true;

            var result = evaluateCombo(combo, target);
            if (!result) continue;

            var withinTolerance = isWithinTolerance(result.totals, target, tolerancePercent);


            evaluated.push({
                signature: signature,
                name: generateMealName(result.items, mealType),
                mealType: mealType,
                dietLabel: strictestDietLabel(combo),
                itemCount: result.items.length,
                items: result.items,
                totals: result.totals,
                matchScore: result.score,
                withinTolerance: withinTolerance
            });
        }

        evaluated.sort(function (a, b) { return b.matchScore - a.matchScore; });

        var DESIRED_RESULT_COUNT = 5;
        var withinBand = evaluated.filter(function (r) { return r.withinTolerance; });
        var outsideBand = evaluated.filter(function (r) { return !r.withinTolerance; });

        var finalResults = withinBand.slice(0, DESIRED_RESULT_COUNT);
        if (finalResults.length < DESIRED_RESULT_COUNT) {
            finalResults = finalResults.concat(
                outsideBand.slice(0, DESIRED_RESULT_COUNT - finalResults.length)
            );
        }

        var reason = "ok";
        if (evaluated.length === 0) {
            reason = "no-matches";
        } else if (withinBand.length === 0) {
            reason = "closest-only"; 
        }

        return {
            recommendations: finalResults,
            reason: reason
        };
    }

    global.RecommendationEngine = {
        TOLERANCE_PERCENT: TOLERANCE_PERCENT,
        WEIGHTS: WEIGHTS,
        generate: generate,
        isDietCompatible: isDietCompatible
    };

})(window);
