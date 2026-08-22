/* =========================================================
   foods.js — Food Explorer page logic
   -------------------------------------------------------
   - Loads /foods.json at runtime via the Fetch API inside an
     async function, with a simple module-level cache (this
     project has no React Query / build step, so a cached
     promise is the vanilla equivalent) and explicit
     loading / error states.
   - Filters (search, category, diet, high protein, low cal)
     combine with AND, results sorted alphabetically.
   - Pantry toggling reuses the existing PantryService
     (js/pantryStorage.js, "mm_pantry" key) so state stays in
     sync with the Meal Calculator's "Use What I Have" list,
     including reactively across open tabs via the storage event.
   ========================================================= */

(function () {
    "use strict";

    var HIGH_PROTEIN_RATIO = 0.12; // protein g per g of serving
    var LOW_CALORIE_MAX = 130;     // kcal

    var state = {
        allFoods: [],
        search: "",
        category: "all",
        diet: "all",
        highProtein: false,
        lowCalorie: false
    };

    var foodsCache = null; // caches the in-flight/resolved fetch promise

    function loadFoods() {
        if (foodsCache) return foodsCache;
        foodsCache = (async function () {
            var response = await fetch("foods.json");
            if (!response.ok) {
                throw new Error("Request failed with status " + response.status);
            }
            var data = await response.json();
            if (!Array.isArray(data)) {
                throw new Error("Unexpected food data format.");
            }
            return data;
        })();
        return foodsCache;
    }

    document.addEventListener("DOMContentLoaded", function () {

        /* -------- Session (soft gate, same pattern as dashboard.js) -------- */
        var currentUser = null;
        try {
            var raw = localStorage.getItem("mm_current_user");
            currentUser = raw ? JSON.parse(raw) : null;
        } catch (err) {
            currentUser = null;
        }

        if (!currentUser) {
            window.location.href = "login.html";
            return;
        }

        var displayName = currentUser.name || (currentUser.email ? currentUser.email.split("@")[0] : "there");
        document.getElementById("nav-user").innerHTML = "Hi, <strong>" + escapeHtml(displayName) + "</strong>";

        document.getElementById("logout-btn").addEventListener("click", function () {
            localStorage.removeItem("mm_current_user");
            window.location.href = "index.html";
        });

        var grid = document.getElementById("foods-grid");
        var resultCount = document.getElementById("result-count");
        var searchInput = document.getElementById("food-search");
        var categorySelect = document.getElementById("food-category");
        var dietRow = document.getElementById("diet-pill-row");
        var highProteinPill = document.getElementById("toggle-high-protein");
        var lowCaloriePill = document.getElementById("toggle-low-calorie");

        /* -------- Initial fetch -------- */
        renderStatus("Loading foods\u2026", false);

        loadFoods().then(function (foods) {
            state.allFoods = foods;
            populateCategoryOptions(foods);
            renderGrid();
        }).catch(function (err) {
            console.warn("Could not load foods.json", err);
            renderStatus("Couldn't load the food database. Please try refreshing the page.", true);
        });

        /* -------- Filter wiring -------- */
        searchInput.addEventListener("input", function () {
            state.search = searchInput.value.trim().toLowerCase();
            renderGrid();
        });

        categorySelect.addEventListener("change", function () {
            state.category = categorySelect.value;
            renderGrid();
        });

        dietRow.addEventListener("click", function (e) {
            var pill = e.target.closest(".pill");
            if (!pill) return;
            dietRow.querySelectorAll(".pill").forEach(function (p) { p.classList.remove("active"); });
            pill.classList.add("active");
            state.diet = pill.dataset.value;
            renderGrid();
        });

        highProteinPill.addEventListener("click", function () {
            state.highProtein = !state.highProtein;
            highProteinPill.classList.toggle("active", state.highProtein);
            highProteinPill.setAttribute("aria-pressed", String(state.highProtein));
            renderGrid();
        });

        lowCaloriePill.addEventListener("click", function () {
            state.lowCalorie = !state.lowCalorie;
            lowCaloriePill.classList.toggle("active", state.lowCalorie);
            lowCaloriePill.setAttribute("aria-pressed", String(state.lowCalorie));
            renderGrid();
        });

        /* -------- Details modal -------- */
        var detailOverlay = document.getElementById("food-detail-overlay");
        var detailClose = document.getElementById("food-detail-close");

        detailClose.addEventListener("click", closeDetailModal);
        detailOverlay.addEventListener("click", function (e) {
            if (e.target === detailOverlay) closeDetailModal();
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && detailOverlay.classList.contains("visible")) {
                closeDetailModal();
            }
        });

        function openDetailModal(food) {
            document.getElementById("food-detail-title").textContent = food.name;
            document.getElementById("food-detail-meta").textContent =
                capitalize(food.category) + " \u00b7 per " + food.servingSize + food.unit + " \u00b7 " + capitalize(food.diet);

            document.getElementById("food-detail-list").innerHTML =
                detailRow("Calories", Math.round(food.calories) + " kcal") +
                detailRow("Protein", round1(food.protein) + " g") +
                detailRow("Carbohydrates", round1(food.carbs) + " g") +
                detailRow("Fat", round1(food.fat) + " g") +
                detailRow("Best for", food.mealTypes.map(capitalize).join(", "));

            detailOverlay.classList.add("visible");
            detailClose.focus();
        }

        function closeDetailModal() {
            detailOverlay.classList.remove("visible");
        }

        function detailRow(label, value) {
            return '<div class="food-detail-row"><span>' + escapeHtml(label) + '</span><span>' + escapeHtml(value) + '</span></div>';
        }

        /* -------- Pantry toggle (delegated) + cross-tab sync -------- */
        grid.addEventListener("click", function (e) {
            var addBtn = e.target.closest(".pantry-add-btn");
            var detailsBtn = e.target.closest(".food-details-btn");

            if (addBtn) {
                var foodId = addBtn.dataset.foodId;
                var food = state.allFoods.find(function (f) { return f.id === foodId; });
                if (!food) return;
                PantryService.toggle(foodId);
                var nowInPantry = PantryService.has(foodId);
                updatePantryButton(addBtn, nowInPantry);
                showToast(nowInPantry ? (food.name + " added to pantry.") : (food.name + " removed from pantry."));
                return;
            }

            if (detailsBtn) {
                var detailFood = state.allFoods.find(function (f) { return f.id === detailsBtn.dataset.foodId; });
                if (detailFood) openDetailModal(detailFood);
            }
        });

        // Keep pantry state in sync if it changes in another tab (e.g. the calculator page).
        window.addEventListener("storage", function (e) {
            if (e.key === PantryService.STORAGE_KEY) {
                grid.querySelectorAll(".pantry-add-btn").forEach(function (btn) {
                    updatePantryButton(btn, PantryService.has(btn.dataset.foodId));
                });
            }
        });

        /* -------- Rendering -------- */

        function populateCategoryOptions(foods) {
            var categories = Array.from(new Set(foods.map(function (f) { return f.category; }))).sort();
            categorySelect.innerHTML = '<option value="all">All categories</option>' +
                categories.map(function (c) {
                    return '<option value="' + escapeHtml(c) + '">' + escapeHtml(capitalize(c)) + '</option>';
                }).join("");
        }

        function getFilteredFoods() {
            return state.allFoods.filter(function (food) {
                if (state.search && food.name.toLowerCase().indexOf(state.search) === -1) return false;
                if (state.category !== "all" && food.category !== state.category) return false;
                if (state.diet !== "all" && food.diet !== state.diet) return false;
                if (state.highProtein && (food.protein / food.servingSize) < HIGH_PROTEIN_RATIO) return false;
                if (state.lowCalorie && food.calories > LOW_CALORIE_MAX) return false;
                return true;
            }).sort(function (a, b) { return a.name.localeCompare(b.name); });
        }

        function renderStatus(message, isError) {
            resultCount.textContent = "";
            grid.innerHTML = '<div class="foods-status-state' + (isError ? " error-state" : "") + '">' + escapeHtml(message) + "</div>";
        }

        function renderGrid() {
            var filtered = getFilteredFoods();
            resultCount.textContent = filtered.length + " food" + (filtered.length === 1 ? "" : "s");

            if (filtered.length === 0) {
                grid.innerHTML =
                    '<div class="foods-empty-state">' +
                        '<div class="state-icon">\ud83d\udd0d</div>' +
                        '<h3>No foods match those filters</h3>' +
                        '<p>Try clearing a filter, such as the category or diet selection, to see more results.</p>' +
                    '</div>';
                return;
            }

            grid.innerHTML = filtered.map(renderCard).join("");
        }

        function renderCard(food) {
            var inPantry = PantryService.has(food.id);
            return (
                '<article class="food-card">' +
                    '<div class="food-card-top">' +
                        '<h3>' + escapeHtml(food.name) + '</h3>' +
                        '<span class="db-diet-tag ' + food.diet + '">' + escapeHtml(capitalize(food.diet)) + '</span>' +
                    '</div>' +
                    '<p class="food-card-meta">' + escapeHtml(capitalize(food.category)) + ' \u00b7 per ' + food.servingSize + escapeHtml(food.unit) + '</p>' +
                    '<div class="food-macro-strip">' +
                        '<div class="food-macro-cell cal"><strong>' + Math.round(food.calories) + '</strong><span>KCAL</span></div>' +
                        '<div class="food-macro-cell protein"><strong>' + round1(food.protein) + 'g</strong><span>PROTEIN</span></div>' +
                        '<div class="food-macro-cell carbs"><strong>' + round1(food.carbs) + 'g</strong><span>CARBS</span></div>' +
                        '<div class="food-macro-cell fat"><strong>' + round1(food.fat) + 'g</strong><span>FAT</span></div>' +
                    '</div>' +
                    '<div class="food-card-actions">' +
                        '<button type="button" class="btn btn-secondary pantry-add-btn' + (inPantry ? ' in-pantry' : '') + '" data-food-id="' + food.id + '" aria-pressed="' + inPantry + '" aria-label="' + (inPantry ? 'Remove ' + escapeHtml(food.name) + ' from pantry' : 'Add ' + escapeHtml(food.name) + ' to available pantry') + '">' +
                            (inPantry ? '\u2713 In pantry' : 'Add to Available') +
                        '</button>' +
                        '<button type="button" class="btn btn-secondary food-details-btn" data-food-id="' + food.id + '" aria-label="View details for ' + escapeHtml(food.name) + '">Details</button>' +
                    '</div>' +
                '</article>'
            );
        }

        function updatePantryButton(btn, inPantry) {
            btn.classList.toggle("in-pantry", inPantry);
            btn.textContent = inPantry ? "\u2713 In pantry" : "Add to Available";
            btn.setAttribute("aria-pressed", String(inPantry));
        }
    });

    /* -------- Toast (reuses the shared #mm-toast element/classes) -------- */
    function showToast(message) {
        var toast = document.getElementById("mm-toast");
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("visible");
        clearTimeout(showToast._t);
        showToast._t = setTimeout(function () {
            toast.classList.remove("visible");
        }, 2200);
    }

    /* -------- Shared small helpers (same as dashboard.js) -------- */
    function round1(n) {
        return Math.round(n * 10) / 10;
    }
    function capitalize(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function escapeHtml(str) {
        var div = document.createElement("div");
        div.textContent = str == null ? "" : String(str);
        return div.innerHTML;
    }
})();
