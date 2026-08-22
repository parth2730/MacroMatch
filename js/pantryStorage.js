/* =========================================================
   pantryStorage.js
   -------------------------------------------------------
   Minimal "pantry" system so the "Use What I Have" option
   has something real to restrict against. Kept intentionally
   small: a flat list of food IDs the user says they have at
   home. No existing pantry system was found in the project,
   so this is a fresh, modular addition that can be swapped
   for a backend later.

   Storage key: "mm_pantry"
   ========================================================= */

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
