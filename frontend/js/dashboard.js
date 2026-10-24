(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", async function () {

        var currentUser = await Auth.requireUser();
        if (!currentUser) return;
        Auth.mountNav(currentUser);

        document.getElementById("welcome-heading").textContent =
            "Welcome back, " + Auth.displayName(currentUser) + ".";

        function goToCalculator() {
            window.location.href = "calculator.html";
        }
        document.getElementById("open-calculator-btn").addEventListener("click", goToCalculator);
        document.getElementById("open-calculator-card").addEventListener("click", function (e) {
            if (e.target.closest("button")) return;
            goToCalculator();
        });

        async function renderTodaySummary() {
            var totals;
            var todayLog;

            try {
                totals = await MealStorageService.getTodayTotals();
                todayLog = await MealStorageService.getTodayLog();
            } catch (err) {
                showToast(err.message || "Could not load today's summary.");
                return;
            }

            document.getElementById("today-date").textContent = new Date().toLocaleDateString(undefined, {
                weekday: "long", month: "short", day: "numeric"
            });
            document.getElementById("today-calories").textContent = Math.round(totals.calories);
            document.getElementById("today-protein").textContent = round1(totals.protein);
            document.getElementById("today-carbs").textContent = round1(totals.carbs);
            document.getElementById("today-fat").textContent = round1(totals.fat);

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

        document.getElementById("today-log-list").addEventListener("click", async function (e) {
            var deleteBtn = e.target.closest(".log-item-delete-btn");
            if (!deleteBtn) return;
            deleteBtn.disabled = true;
            try {
                await MealStorageService.removeFromLog(deleteBtn.dataset.logId);
                await renderTodaySummary();
                showToast("Removed from today's log.");
            } catch (err) {
                deleteBtn.disabled = false;
                showToast(err.message || "Could not remove the meal.");
            }
        });

        async function renderSavedCount() {
            var el = document.getElementById("saved-meals-count");
            try {
                var saved = await MealStorageService.getSavedMeals();
                el.textContent = saved.length === 0
                    ? "No meals saved yet."
                    : saved.length + " meal" + (saved.length === 1 ? "" : "s") + " saved.";
            } catch (err) {
                el.textContent = "Could not load saved meals.";
            }
        }

        var savedOverlay = document.getElementById("saved-modal-overlay");
        document.getElementById("view-saved-btn").addEventListener("click", async function () {
            savedOverlay.classList.add("visible");
            await renderSavedMealsModal();
        });
        document.getElementById("saved-modal-close").addEventListener("click", function () {
            savedOverlay.classList.remove("visible");
        });
        savedOverlay.addEventListener("click", function (e) {
            if (e.target === savedOverlay) savedOverlay.classList.remove("visible");
        });

        async function renderSavedMealsModal() {
            var body = document.getElementById("saved-modal-body");
            var saved;

            try {
                saved = await MealStorageService.getSavedMeals();
            } catch (err) {
                body.innerHTML = '<p class="empty-state-text">Could not load saved meals.</p>';
                return;
            }

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

        document.getElementById("saved-modal-body").addEventListener("click", async function (e) {
            var deleteBtn = e.target.closest(".log-item-delete-btn");
            if (!deleteBtn) return;
            deleteBtn.disabled = true;
            try {
                await MealStorageService.removeSavedMeal(deleteBtn.dataset.savedId);
                await renderSavedMealsModal();
                await renderSavedCount();
                showToast("Removed from saved meals.");
            } catch (err) {
                deleteBtn.disabled = false;
                showToast(err.message || "Could not remove the saved meal.");
            }
        });

        var dbOverlay = document.getElementById("db-modal-overlay");
        document.getElementById("open-database-btn").addEventListener("click", async function () {
            dbOverlay.classList.add("visible");
            try {
                await renderDatabaseTable();
            } catch (err) {
                showToast(err.message || "Could not load the food database.");
            }
        });
        document.getElementById("db-modal-close").addEventListener("click", function () {
            dbOverlay.classList.remove("visible");
        });
        dbOverlay.addEventListener("click", function (e) {
            if (e.target === dbOverlay) dbOverlay.classList.remove("visible");
        });

        async function renderDatabaseTable() {
            var foods = await FoodDatabaseService.getAll();
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

        await Promise.all([renderTodaySummary(), renderSavedCount()]);
    });

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
