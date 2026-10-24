(function (global) {
    "use strict";

    var cache = null;

    async function getAll(forceReload) {
        if (cache && !forceReload) return cache;
        var data = await Api.get("/foods");
        cache = Array.isArray(data.foods) ? data.foods : [];
        return cache;
    }

    async function getById(id) {
        var data = await Api.get("/foods/" + encodeURIComponent(id));
        return data.food;
    }

    async function init() {
        return getAll();
    }

    async function resetToSeed() {
        return getAll(true);
    }

    async function count() {
        var foods = await getAll();
        return foods.length;
    }

    function clearCache() {
        cache = null;
    }

    global.FoodDatabaseService = {
        init: init,
        getAll: getAll,
        getById: getById,
        resetToSeed: resetToSeed,
        count: count,
        clearCache: clearCache
    };

})(window);
