(function (global) {
    "use strict";

    var ids = [];
    var loaded = false;

    async function load(forceReload) {
        if (loaded && !forceReload) return ids.slice();
        var data = await Api.get("/pantry");
        ids = Array.isArray(data.foodIds) ? data.foodIds : [];
        loaded = true;
        return ids.slice();
    }

    function getIds() {
        return ids.slice();
    }

    function has(foodId) {
        return ids.indexOf(foodId) !== -1;
    }

    async function toggle(foodId) {
        var data = await Api.post("/pantry/" + encodeURIComponent(foodId) + "/toggle");
        ids = Array.isArray(data.foodIds) ? data.foodIds : [];
        loaded = true;
        return ids.slice();
    }

    async function setIds(nextIds) {
        var data = await Api.put("/pantry", { foodIds: nextIds || [] });
        ids = Array.isArray(data.foodIds) ? data.foodIds : [];
        loaded = true;
        return ids.slice();
    }

    async function remove(foodId) {
        var data = await Api.del("/pantry/" + encodeURIComponent(foodId));
        ids = Array.isArray(data.foodIds) ? data.foodIds : [];
        loaded = true;
        return ids.slice();
    }

    global.PantryService = {
        load: load,
        getIds: getIds,
        has: has,
        toggle: toggle,
        setIds: setIds,
        remove: remove
    };

})(window);
