"use strict";

const TOLERANCE_PERCENT = 8;
const WEIGHTS = {
    calories: 0.30,
    protein: 0.35,
    carbs: 0.20,
    fat: 0.15
};

const MEAL_NAME_SUFFIXES = ["Plate", "Bowl", "Combo", "Meal"];

function isDietCompatible(foodDiet, selectedDiet) {
    if (selectedDiet === "vegan") return foodDiet === "vegan";
    if (selectedDiet === "vegetarian") return foodDiet === "vegan" || foodDiet === "vegetarian";
    return true;
}

function strictestDietLabel(foods) {
    const allVegan = foods.every((f) => f.diet === "vegan");
    if (allVegan) return "Vegan";

    const allVegOrVegan = foods.every((f) => f.diet === "vegan" || f.diet === "vegetarian");
    if (allVegOrVegan) return "Vegetarian";

    return "Non-Vegetarian";
}

function buildCandidatePool(filteredFoods, maxItems) {
    let poolSize;
    if (maxItems <= 1) poolSize = 60;
    else if (maxItems === 2) poolSize = 40;
    else if (maxItems === 3) poolSize = 26;
    else poolSize = 20;

    if (filteredFoods.length <= poolSize) return filteredFoods.slice();

    const sorted = filteredFoods.slice().sort((a, b) => {
        const aScore = a.protein / Math.max(a.calories, 1);
        const bScore = b.protein / Math.max(b.calories, 1);
        return bScore - aScore;
    });

    return sorted.slice(0, poolSize);
}

function generateCombinations(pool, maxItems) {
    const results = [];
    const maxSize = Math.max(1, Math.min(maxItems, 6));

    function recurse(startIndex, current) {
        if (current.length >= 1) {
            results.push(current.slice());
        }
        if (current.length === maxSize) return;

        for (let i = startIndex; i < pool.length; i++) {
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
        const rounded = Math.round(rawQty * 2) / 2;
        return Math.max(0.5, rounded);
    }

    const roundedWeight = Math.round(rawQty / 25) * 25;
    return Math.max(25, roundedWeight);
}

function nutritionForQuantity(food, qty) {
    const ratio = qty / food.servingSize;
    return {
        calories: food.calories * ratio,
        protein: food.protein * ratio,
        carbs: food.carbs * ratio,
        fat: food.fat * ratio
    };
}

function similarity(actual, target) {
    if (target <= 0) return actual === 0 ? 1 : 0;
    const diffRatio = Math.abs(actual - target) / target;
    return Math.max(0, 1 - diffRatio);
}

function computeScore(totals, target) {
    const sCal = similarity(totals.calories, target.calories);
    const sPro = similarity(totals.protein, target.protein);
    const sCarb = similarity(totals.carbs, target.carbs);
    const sFat = similarity(totals.fat, target.fat);

    const weighted =
        sCal * WEIGHTS.calories +
        sPro * WEIGHTS.protein +
        sCarb * WEIGHTS.carbs +
        sFat * WEIGHTS.fat;

    return Math.round(weighted * 1000) / 10;
}

function isWithinTolerance(totals, target, tolerancePercent) {
    const band = tolerancePercent / 100;

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
    const baseTotals = combo.reduce((acc, food) => {
        acc.calories += food.calories;
        acc.protein += food.protein;
        acc.carbs += food.carbs;
        acc.fat += food.fat;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    if (baseTotals.calories <= 0) return null;

    const scaleFromCalories = target.calories / baseTotals.calories;
    const scaleFromProtein = baseTotals.protein > 0
        ? target.protein / baseTotals.protein
        : scaleFromCalories;

    const rawVariants = [
        scaleFromCalories,
        scaleFromCalories * 0.85,
        scaleFromCalories * 1.15,
        scaleFromProtein,
        (scaleFromCalories + scaleFromProtein) / 2
    ];

    let bestVariant = null;

    for (let v = 0; v < rawVariants.length; v++) {
        const scale = Math.min(4, Math.max(0.3, rawVariants[v]));

        const items = combo.map((food) => {
            const rawQty = food.servingSize * scale;
            const qty = roundQuantity(food, rawQty);
            const nutrition = nutritionForQuantity(food, qty);
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

        const totals = items.reduce((acc, item) => {
            acc.calories += item.calories;
            acc.protein += item.protein;
            acc.carbs += item.carbs;
            acc.fat += item.fat;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

        const score = computeScore(totals, target);

        if (!bestVariant || score > bestVariant.score) {
            bestVariant = { items, totals, score };
        }
    }

    return bestVariant;
}

function generateMealName(items) {
    const names = items.slice(0, 2).map((item) => {
        return item.name.replace(/\s*\([^)]*\)/g, "").trim();
    });
    const base = names.join(" & ");

    const hasSoupOrCurry = items.some((item) => /soup|curry|dal|chole/i.test(item.name));

    let suffix;
    if (hasSoupOrCurry) {
        suffix = "Bowl";
    } else {
        const hash = items.reduce((acc, it) => acc + it.name.length, 0);
        suffix = MEAL_NAME_SUFFIXES[hash % MEAL_NAME_SUFFIXES.length];
    }

    return base + " " + suffix;
}

/**
 * Generate ranked meal recommendations.
 *
 * @param {{calories:number,protein:number,carbs:number,fat:number}} target
 * @param {{mealType?:string,diet?:string,maxItems?:number,useWhatIHave?:boolean,tolerancePercent?:number}} options
 * @param {Array<object>} allFoods
 * @param {Array<string>} pantryIds
 */
function generate(target, options, allFoods, pantryIds) {
    options = options || {};
    const mealType = options.mealType;
    const diet = options.diet;
    const maxItems = Math.max(1, Math.min(parseInt(options.maxItems, 10) || 3, 6));
    const useWhatIHave = !!options.useWhatIHave;
    const tolerancePercent = typeof options.tolerancePercent === "number"
        ? options.tolerancePercent
        : TOLERANCE_PERCENT;

    const pantrySet = new Set(pantryIds || []);

    const filtered = (allFoods || []).filter((food) => {
        if (!isDietCompatible(food.diet, diet)) return false;
        if (mealType && Array.isArray(food.mealTypes) && food.mealTypes.indexOf(mealType) === -1) return false;
        if (useWhatIHave && !pantrySet.has(food.id)) return false;
        return true;
    });

    if (filtered.length === 0) {
        return { recommendations: [], reason: useWhatIHave ? "empty-pantry" : "no-foods" };
    }

    const pool = buildCandidatePool(filtered, maxItems);
    const combos = generateCombinations(pool, maxItems);

    const evaluated = [];
    const seenSignatures = {};

    for (let i = 0; i < combos.length; i++) {
        const combo = combos[i];
        const signature = combo.map((f) => f.id).sort().join("|");
        if (seenSignatures[signature]) continue;
        seenSignatures[signature] = true;

        const result = evaluateCombo(combo, target);
        if (!result) continue;

        const withinTolerance = isWithinTolerance(result.totals, target, tolerancePercent);

        evaluated.push({
            signature,
            name: generateMealName(result.items),
            mealType,
            dietLabel: strictestDietLabel(combo),
            itemCount: result.items.length,
            items: result.items,
            totals: result.totals,
            matchScore: result.score,
            withinTolerance
        });
    }

    evaluated.sort((a, b) => b.matchScore - a.matchScore);

    const DESIRED_RESULT_COUNT = 5;
    const withinBand = evaluated.filter((r) => r.withinTolerance);
    const outsideBand = evaluated.filter((r) => !r.withinTolerance);

    let finalResults = withinBand.slice(0, DESIRED_RESULT_COUNT);
    if (finalResults.length < DESIRED_RESULT_COUNT) {
        finalResults = finalResults.concat(
            outsideBand.slice(0, DESIRED_RESULT_COUNT - finalResults.length)
        );
    }

    let reason = "ok";
    if (evaluated.length === 0) {
        reason = "no-matches";
    } else if (withinBand.length === 0) {
        reason = "closest-only";
    }

    return { recommendations: finalResults, reason };
}

module.exports = {
    TOLERANCE_PERCENT,
    WEIGHTS,
    generate,
    isDietCompatible
};
