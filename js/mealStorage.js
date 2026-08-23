

(function (global) {
    "use strict";

    var SAVED_MEALS_KEY = "mm_saved_meals";
    var TODAY_LOG_KEY = "mm_today_log";

    function todayString() {
        var d = new Date();
        return d.getFullYear() + "-" +
            String(d.getMonth() + 1).padStart(2, "0") + "-" +
            String(d.getDate()).padStart(2, "0");
    }

    function readArray(key) {
        try {
            var raw = window.localStorage.getItem(key);
            if (!raw) return [];
            var parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            console.warn("Could not read " + key + " from LocalStorage.", err);
            return [];
        }
    }

    function writeArray(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (err) {
            console.warn("Could not write " + key + " to LocalStorage.", err);
            return false;
        }
    }



    function getSavedMeals() {
        return readArray(SAVED_MEALS_KEY);
    }

    function isMealSaved(meal) {
        var saved = getSavedMeals();
        return saved.some(function (m) {
            return m.signature === meal.signature;
        });
    }

    function saveMeal(meal) {
        var saved = getSavedMeals();
        if (isMealSaved(meal)) {
            return { added: false, meals: saved };
        }
        var entry = Object.assign({}, meal, {
            savedId: "saved_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
            savedAt: new Date().toISOString()
        });
        saved.unshift(entry);
        writeArray(SAVED_MEALS_KEY, saved);
        return { added: true, meals: saved };
    }

    function removeSavedMeal(savedId) {
        var saved = getSavedMeals().filter(function (m) {
            return m.savedId !== savedId;
        });
        writeArray(SAVED_MEALS_KEY, saved);
        return saved;
    }

    

    function getTodayLog() {
        var log = readArray(TODAY_LOG_KEY);
        var today = todayString();
        return log.filter(function (entry) {
            return entry.date === today;
        });
    }

    function getFullLog() {
        return readArray(TODAY_LOG_KEY);
    }

    function addToTodayLog(meal) {
        var log = readArray(TODAY_LOG_KEY);
        var entry = Object.assign({}, meal, {
            logId: "log_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
            date: todayString(),
            loggedAt: new Date().toISOString()
        });
        log.push(entry);
        writeArray(TODAY_LOG_KEY, log);
        return { entry: entry, todayLog: log.filter(function (e) { return e.date === todayString(); }) };
    }

    function removeFromLog(logId) {
        var log = readArray(TODAY_LOG_KEY).filter(function (entry) {
            return entry.logId !== logId;
        });
        writeArray(TODAY_LOG_KEY, log);
        return log.filter(function (entry) { return entry.date === todayString(); });
    }

    function getTodayTotals() {
        var todayLog = getTodayLog();
        return todayLog.reduce(function (totals, entry) {
            totals.calories += entry.totals.calories || 0;
            totals.protein += entry.totals.protein || 0;
            totals.carbs += entry.totals.carbs || 0;
            totals.fat += entry.totals.fat || 0;
            return totals;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }

    global.MealStorageService = {
        SAVED_MEALS_KEY: SAVED_MEALS_KEY,
        TODAY_LOG_KEY: TODAY_LOG_KEY,
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
