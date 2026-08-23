/* =========================================================
   dashboard.js
   ========================================================= */

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        /* -------- Session (soft gate: redirect if not logged in) -------- */
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
        document.getElementById("welcome-heading").textContent = "Welcome back, " + displayName + ".";

        document.getElementById("logout-btn").addEventListener("click", function () {
            localStorage.removeItem("mm_current_user");
            window.location.href = "index.html";
        });

        /* -------- Navigate to calculator -------- */
        function goToCalculator() {
            window.location.href = "calculator.html";
        }
        document.getElementById("open-calculator-btn").addEventListener("click", goToCalculator);
        document.getElementById("open-calculator-card").addEventListener("click", function (e) {
            if (e.target.closest("button")) return;
            goToCalculator();
        });

        /* -------- Today's log summary -------- */
        renderTodaySummary();

        function renderTodaySummary() {
            var totals = MealStorageService.getTodayTotals();
            document.getElementById("today-date").textContent = new Date().toLocaleDateString(undefined, {
                weekday: "long", month: "short", day: "numeric"
            });
            document.getElementById("today-calories").textContent = Math.round(totals.calories);
            document.getElementById("today-protein").textContent = round1(totals.protein);
            document.getElementById("today-carbs").textContent = round1(totals.carbs);
            document.getElementById("today-fat").textContent = round1(totals.fat);

            var todayLog = MealStorageService.getTodayLog();
            var note = document.getElementById("empty-log-note");
            var section = document.getElementById("today-log-section");
            var list = document.getElementById("today-log-list");

            if (todayLog.length === 0) {
                note.classList.remove("hidden");
                section.hidden = true;
                return;
            }

            note.classList.add("hidden");
            section.hidden = false;
            list.innerHTML = "";

            todayLog.slice().reverse().forEach(function (entry) {
                var row = document.createElement("div");
                row.className = "today-log-item";
                row.innerHTML =
                    '<div>' +
                        '<div class="log-item-name">' + escapeHtml(entry.name) + '</div>' +
                        '<div class="log-item-meta">' + escapeHtml(capitalize(entry.mealType || "")) + ' &middot; ' + entry.itemCount + ' items</div>' +
                    '</div>' +
                    '<div class="log-item-right">' +
                        '<div class="log-item-macros">' +
                            Math.round(entry.totals.calories) + ' Cal &middot; ' +
                            round1(entry.totals.protein) + 'g P &middot; ' +
                            round1(entry.totals.carbs) + 'g C &middot; ' +
                            round1(entry.totals.fat) + 'g F' +
                        '</div>' +
                        '<button type="button" class="log-item-delete-btn" data-log-id="' + entry.logId + '" aria-label="Remove ' + escapeHtml(entry.name) + ' from today\'s log">&#10005;</button>' +
                    '</div>';
                list.appendChild(row);
            });
        }

        document.getElementById("today-log-list").addEventListener("click", function (e) {
            var deleteBtn = e.target.closest(".log-item-delete-btn");
            if (!deleteBtn) return;
            MealStorageService.removeFromLog(deleteBtn.dataset.logId);
            renderTodaySummary();
            showToast("Removed from today's log.");
        });

        /* -------- Saved meals count + modal -------- */
        function renderSavedCount() {
            var saved = MealStorageService.getSavedMeals();
            var el = document.getElementById("saved-meals-count");
            el.textContent = saved.length === 0
                ? "No meals saved yet."
                : saved.length + " meal" + (saved.length === 1 ? "" : "s") + " saved.";
        }
        renderSavedCount();

        var savedOverlay = document.getElementById("saved-modal-overlay");
        document.getElementById("view-saved-btn").addEventListener("click", function () {
            renderSavedMealsModal();
            savedOverlay.classList.add("visible");
        });
        document.getElementById("saved-modal-close").addEventListener("click", function () {
            savedOverlay.classList.remove("visible");
        });
        savedOverlay.addEventListener("click", function (e) {
            if (e.target === savedOverlay) savedOverlay.classList.remove("visible");
        });

        function renderSavedMealsModal() {
            var body = document.getElementById("saved-modal-body");
            var saved = MealStorageService.getSavedMeals();

            if (saved.length === 0) {
                body.innerHTML = '<p class="empty-state-text">You haven\'t saved any meals yet. Generate a meal in the calculator and hit "Save Meal".</p>';
                return;
            }

            body.innerHTML = "";
            saved.forEach(function (meal) {
                var row = document.createElement("div");
                row.className = "saved-meal-row";
                row.innerHTML =
                    '<div>' +
                        '<div class="saved-meal-name">' + escapeHtml(meal.name) + '</div>' +
                        '<div class="saved-meal-meta">' +
                            escapeHtml(capitalize(meal.mealType || "")) + ' &middot; ' + meal.itemCount + ' items &middot; ' +
                            Math.round(meal.totals.calories) + ' Cal &middot; ' + round1(meal.totals.protein) + 'g protein' +
                        '</div>' +
                    '</div>' +
                    '<button type="button" class="log-item-delete-btn" data-saved-id="' + meal.savedId + '" aria-label="Unsave ' + escapeHtml(meal.name) + '">&#10005;</button>';
                body.appendChild(row);
            });
        }

        document.getElementById("saved-modal-body").addEventListener("click", function (e) {
            var deleteBtn = e.target.closest(".log-item-delete-btn");
            if (!deleteBtn) return;
            MealStorageService.removeSavedMeal(deleteBtn.dataset.savedId);
            renderSavedMealsModal();
            renderSavedCount();
            showToast("Removed from saved meals.");
        });

        /* -------- Food database modal -------- */
        var dbOverlay = document.getElementById("db-modal-overlay");
        document.getElementById("open-database-btn").addEventListener("click", function () {
            renderDatabaseTable();
            dbOverlay.classList.add("visible");
        });
        document.getElementById("db-modal-close").addEventListener("click", function () {
            dbOverlay.classList.remove("visible");
        });
        dbOverlay.addEventListener("click", function (e) {
            if (e.target === dbOverlay) dbOverlay.classList.remove("visible");
        });

        function renderDatabaseTable() {
            var foods = FoodDatabaseService.getAll();
            document.getElementById("db-modal-subtitle").textContent =
                foods.length + " foods available to the recommendation engine.";

            var tbody = document.getElementById("db-table-body");
            tbody.innerHTML = "";

            foods.forEach(function (food) {
                var tr = document.createElement("tr");
                tr.innerHTML =
                    "<td>" + escapeHtml(food.name) + "</td>" +
                    "<td>" + escapeHtml(food.category) + "</td>" +
                    "<td><span class='db-diet-tag " + food.diet + "'>" + escapeHtml(capitalize(food.diet)) + "</span></td>" +
                    "<td>" + food.mealTypes.map(capitalize).join(", ") + "</td>" +
                    "<td>" + food.servingSize + " " + food.unit + "</td>" +
                    "<td>" + food.calories + "</td>" +
                    "<td>" + food.protein + "g</td>" +
                    "<td>" + food.carbs + "g</td>" +
                    "<td>" + food.fat + "g</td>";
                tbody.appendChild(tr);
            });
        }

        /* -------- Cross-tab sync --------
           Logging/removing a meal or a saved-meal in another tab fires
           "storage" here. Re-render just the piece that key affects. */
        window.addEventListener("storage", function (e) {
            if (e.key === MealStorageService.TODAY_LOG_KEY) {
                renderTodaySummary();
            }
            if (e.key === MealStorageService.SAVED_MEALS_KEY) {
                renderSavedCount();
                if (savedOverlay.classList.contains("visible")) {
                    renderSavedMealsModal();
                }
            }
        });
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

    /* -------- Shared small helpers -------- */
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