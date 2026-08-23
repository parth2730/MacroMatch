

(function (global) {
    "use strict";

    var STORAGE_KEY = "mm_pantry";

    function getIds() {
        try {
            var raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            var parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            return [];
        }
    }

    function saveIds(ids) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        } catch (err) {
            console.warn("Could not save pantry to LocalStorage.", err);
        }
    }

    function has(foodId) {
        return getIds().indexOf(foodId) !== -1;
    }

    function toggle(foodId) {
        var ids = getIds();
        var index = ids.indexOf(foodId);
        if (index === -1) {
            ids.push(foodId);
        } else {
            ids.splice(index, 1);
        }
        saveIds(ids);
        return ids;
    }

    global.PantryService = {
        STORAGE_KEY: STORAGE_KEY,
        getIds: getIds,
        has: has,
        toggle: toggle
    };

})(window);
