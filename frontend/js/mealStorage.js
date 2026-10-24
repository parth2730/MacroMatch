(function (global) {
    "use strict";

    function todayString() {
        var d = new Date();
        return d.getFullYear() + "-" +
            String(d.getMonth() + 1).padStart(2, "0") + "-" +
            String(d.getDate()).padStart(2, "0");
    }

    async function getSavedMeals() {
        var data = await Api.get("/meals/saved");
        return Array.isArray(data.meals) ? data.meals : [];
    }

    function isMealSaved(meal, savedMeals) {
        return (savedMeals || []).some(function (m) {
            return m.signature === meal.signature;
        });
    }

    async function saveMeal(meal) {
        var data = await Api.post("/meals/saved", meal);
        return {
            added: !!data.added,
            meal: data.meal,
            meals: Array.isArray(data.meals) ? data.meals : []
        };
    }

    async function removeSavedMeal(savedId) {
        var data = await Api.del("/meals/saved/" + encodeURIComponent(savedId));
        return Array.isArray(data.meals) ? data.meals : [];
    }

    async function getTodayLog() {
        var data = await Api.get("/meals/log?date=" + todayString());
        return Array.isArray(data.log) ? data.log : [];
    }

    async function getFullLog() {
        var data = await Api.get("/meals/log");
        return Array.isArray(data.log) ? data.log : [];
    }

    async function addToTodayLog(meal) {
        var data = await Api.post("/meals/log", meal);
        return {
            entry: data.entry,
            todayLog: Array.isArray(data.log) ? data.log : []
        };
    }

    async function removeFromLog(logId) {
        var data = await Api.del("/meals/log/" + encodeURIComponent(logId) + "?date=" + todayString());
        return Array.isArray(data.log) ? data.log : [];
    }

    async function getTodayTotals() {
        var data = await Api.get("/meals/log/totals");
        return data.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    global.MealStorageService = {
        getSavedMeals: getSavedMeals,
        isMealSaved: isMealSaved,
        saveMeal: saveMeal,
        removeSavedMeal: removeSavedMeal,
        getTodayLog: getTodayLog,
        getFullLog: getFullLog,
        addToTodayLog: addToTodayLog,
        removeFromLog: removeFromLog,
        getTodayTotals: getTodayTotals,
        todayString: todayString
    };

})(window);
