"use strict";

const DEFAULT_GOAL = { calories: 2200, protein: 150, carbs: 220, fat: 65 };

function todayString(date) {
    const d = date ? new Date(date) : new Date();
    return d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0");
}

function isValidDateString(value) {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toNonNegativeNumber(value, fallback) {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return fallback;
    return n;
}

function serializeMeal(meal) {
    return {
        logId: meal.logId,
        savedId: meal.savedId,
        signature: meal.signature,
        name: meal.name,
        mealType: meal.mealType,
        dietLabel: meal.dietLabel,
        itemCount: meal.itemCount,
        items: meal.items,
        totals: meal.totals,
        matchScore: meal.matchScore,
        withinTolerance: meal.withinTolerance,
        date: meal.date,
        loggedAt: meal.loggedAt,
        savedAt: meal.savedAt
    };
}

function computeTotals(entries) {
    return (entries || []).reduce((totals, entry) => {
        totals.calories += (entry.totals && entry.totals.calories) || 0;
        totals.protein += (entry.totals && entry.totals.protein) || 0;
        totals.carbs += (entry.totals && entry.totals.carbs) || 0;
        totals.fat += (entry.totals && entry.totals.fat) || 0;
        return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

module.exports = {
    DEFAULT_GOAL,
    todayString,
    isValidDateString,
    toNonNegativeNumber,
    serializeMeal,
    computeTotals
};
