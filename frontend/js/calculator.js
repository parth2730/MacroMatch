(function () {
    "use strict";

    var DEFAULT_GOAL = { calories: 2200, protein: 150, carbs: 220, fat: 65 };
    var TOLERANCE_PERCENT = 8;

    var state = {
        mealType: "lunch",
        diet: "vegetarian",
        maxItems: 3,
        useWhatIHave: false
    };

    document.addEventListener("DOMContentLoaded", async function () {

        var currentUser = await Auth.requireUser();
        if (!currentUser) return;
        Auth.mountNav(currentUser);

        var els = {
            calories: document.getElementById("input-calories"),
            protein: document.getElementById("input-protein"),
            carbs: document.getElementById("input-carbs"),
            fat: document.getElementById("input-fat"),
            error: document.getElementById("input-error"),
            mealTypeRow: document.getElementById("meal-type-row"),
            dietRow: document.getElementById("diet-row"),
            maxItemsSlider: document.getElementById("max-items-slider"),
            maxItemsValue: document.getElementById("max-items-value"),
            toleranceValue: document.getElementById("tolerance-value"),
            usePantry: document.getElementById("use-pantry-checkbox"),
            generateBtn: document.getElementById("generate-btn"),
            remainingCalories: document.getElementById("remaining-calories"),
            remainingProtein: document.getElementById("remaining-protein"),
            remainingCarbs: document.getElementById("remaining-carbs"),
            remainingFat: document.getElementById("remaining-fat"),
            editGoalBtn: document.getElementById("edit-goal-btn"),
            goalEditor: document.getElementById("goal-editor"),
            goalCalories: document.getElementById("goal-calories"),
            goalProtein: document.getElementById("goal-protein"),
            goalCarbs: document.getElementById("goal-carbs"),
            goalFat: document.getElementById("goal-fat"),
            saveGoalBtn: document.getElementById("save-goal-btn"),
            stateEmpty: document.getElementById("state-empty"),
            resultsList: document.getElementById("results-list")
        };

        async function getGoal() {
            try {
                var data = await Api.get("/goal");
                return Object.assign({}, DEFAULT_GOAL, data.goal);
            } catch (err) {
                console.warn("Could not load daily goal.", err);
                return Object.assign({}, DEFAULT_GOAL);
            }
        }

        async function saveGoal(goal) {
            await Api.put("/goal", goal);
        }

        async function getRemainingTarget() {
            var goal = await getGoal();
            var loggedToday = await MealStorageService.getTodayTotals();
            return {
                calories: Math.max(0, Math.round(goal.calories - loggedToday.calories)),
                protein: Math.max(0, Math.round((goal.protein - loggedToday.protein) * 10) / 10),
                carbs: Math.max(0, Math.round((goal.carbs - loggedToday.carbs) * 10) / 10),
                fat: Math.max(0, Math.round((goal.fat - loggedToday.fat) * 10) / 10)
            };
        }

        async function renderRemainingTarget() {
            var remaining = await getRemainingTarget();
            els.remainingCalories.textContent = remaining.calories + " kcal";
            els.remainingProtein.textContent = remaining.protein + " g";
            els.remainingCarbs.textContent = remaining.carbs + " g";
            els.remainingFat.textContent = remaining.fat + " g";
            return remaining;
        }

        async function prefillInputsFromRemaining() {
            var remaining = await getRemainingTarget();
            els.calories.value = Math.max(0, Math.round(remaining.calories / 4));
            els.protein.value = Math.max(0, Math.round(remaining.protein / 4));
            els.carbs.value = Math.max(0, Math.round(remaining.carbs / 4));
            els.fat.value = Math.max(0, Math.round(remaining.fat / 4));
        }

        try {
            await PantryService.load();
        } catch (err) {
            console.warn("Could not load pantry.", err);
        }

        await renderRemainingTarget();
        await prefillInputsFromRemaining();

        els.toleranceValue.textContent = TOLERANCE_PERCENT;

        els.editGoalBtn.addEventListener("click", async function () {
            var goal = await getGoal();
            els.goalCalories.value = goal.calories;
            els.goalProtein.value = goal.protein;
            els.goalCarbs.value = goal.carbs;
            els.goalFat.value = goal.fat;
            els.goalEditor.hidden = !els.goalEditor.hidden;
        });

        els.saveGoalBtn.addEventListener("click", async function () {
            var goal = {
                calories: parseFloat(els.goalCalories.value) || DEFAULT_GOAL.calories,
                protein: parseFloat(els.goalProtein.value) || DEFAULT_GOAL.protein,
                carbs: parseFloat(els.goalCarbs.value) || DEFAULT_GOAL.carbs,
                fat: parseFloat(els.goalFat.value) || DEFAULT_GOAL.fat
            };
            try {
                await saveGoal(goal);
                await renderRemainingTarget();
                els.goalEditor.hidden = true;
                showToast("Daily goal updated.");
            } catch (err) {
                showToast(err.message || "Could not update the daily goal.");
            }
        });

        function wirePillRow(rowEl, stateKey) {
            rowEl.querySelectorAll(".pill").forEach(function (pill) {
                pill.addEventListener("click", function () {
                    rowEl.querySelectorAll(".pill").forEach(function (p) { p.classList.remove("active"); });
                    pill.classList.add("active");
                    state[stateKey] = pill.getAttribute("data-value");
                });
            });
        }
        wirePillRow(els.mealTypeRow, "mealType");
        wirePillRow(els.dietRow, "diet");

        els.maxItemsSlider.addEventListener("input", function () {
            state.maxItems = parseInt(els.maxItemsSlider.value, 10);
            els.maxItemsValue.textContent = state.maxItems;
        });

        els.usePantry.addEventListener("change", function () {
            state.useWhatIHave = els.usePantry.checked;
            if (state.useWhatIHave && PantryService.getIds().length === 0) {
                showToast("Your pantry is empty — manage it below to use this option.");
            }
        });

        document.getElementById("manage-pantry-btn").addEventListener("click", function (e) {
            e.preventDefault();
            openDatabaseModal(true);
        });

        function validateInputs() {
            var values = {
                calories: parseFloat(els.calories.value),
                protein: parseFloat(els.protein.value),
                carbs: parseFloat(els.carbs.value),
                fat: parseFloat(els.fat.value)
            };

            var fields = ["calories", "protein", "carbs", "fat"];
            for (var i = 0; i < fields.length; i++) {
                var key = fields[i];
                var v = values[key];
                if (isNaN(v) || els[key].value.trim() === "") {
                    return { valid: false, message: "Please enter a value for " + key + "." };
                }
                if (v < 0) {
                    return { valid: false, message: "Nutrition targets can't be negative." };
                }
                if (v > 5000) {
                    return { valid: false, message: "That " + key + " target looks unrealistically high. Try a smaller number." };
                }
            }

            if (values.calories === 0 && (values.protein > 0 || values.carbs > 0 || values.fat > 0)) {
                return { valid: false, message: "Calories can't be 0 if you have macro targets." };
            }

            return { valid: true, values: values };
        }

        els.generateBtn.addEventListener("click", async function () {
            els.error.textContent = "";
            var validation = validateInputs();
            if (!validation.valid) {
                els.error.textContent = validation.message;
                return;
            }

            els.generateBtn.disabled = true;
            var result = null;
            var failed = false;

            try {
                result = await Api.post("/recommendations", Object.assign({}, validation.values, {
                    mealType: state.mealType,
                    diet: state.diet,
                    maxItems: state.maxItems,
                    useWhatIHave: state.useWhatIHave
                }));
            } catch (err) {
                console.error("Recommendation request failed:", err);
                failed = true;
                els.error.textContent = err.message || "Something went wrong generating meals. Please try again.";
            } finally {
                els.generateBtn.disabled = false;
            }

            if (failed) {
                showState("empty");
                return;
            }

            if (!result || !result.recommendations || result.recommendations.length === 0) {
                showState("empty");
                if (result && result.reason === "empty-pantry") {
                    els.error.textContent = "Your pantry list is empty. Add items via \"Manage pantry list\" or turn off \"Use What I Have\".";
                } else if (result && result.reason === "no-foods") {
                    els.error.textContent = "No foods in the database match this diet and meal type yet.";
                } else {
                    els.error.textContent = "No meals matched — try a different diet, meal type, or allow more items.";
                }
                return;
            }

            try {
                await renderResults(result.recommendations);
                showState("results");
            } catch (renderErr) {
                console.error("Rendering results failed:", renderErr);
                showState("empty");
                els.error.textContent = "Something went wrong displaying meals. Please try again.";
            }
        });

        function showState(name) {
            els.stateEmpty.hidden = name !== "empty";
            els.resultsList.hidden = name !== "results";
        }

        var RANK_META = [
            { badge: "🥇", label: "BEST MATCH", cardClass: "best-match" },
            { badge: "🥈", label: "OPTION 2", cardClass: "" },
            { badge: "🥉", label: "OPTION 3", cardClass: "" },
            { badge: "🏅", label: "OPTION 4", cardClass: "" },
            { badge: "🏅", label: "OPTION 5", cardClass: "" }
        ];

        async function renderResults(recommendations) {
            var savedMeals = [];
            try {
                savedMeals = await MealStorageService.getSavedMeals();
            } catch (err) {
                console.warn("Could not load saved meals.", err);
            }

            els.resultsList.innerHTML = "";

            recommendations.forEach(function (meal, index) {
                var rankMeta = RANK_META[index] || { badge: "🏅", label: "OPTION " + (index + 1), cardClass: "" };

                var card = document.createElement("div");
                card.className = "result-card " + rankMeta.cardClass;

                var itemsHtml = meal.items.map(function (item) {
                    return '<div class="item-row"><span>' + escapeHtml(item.name) + '</span>' +
                        '<span class="item-qty">' + formatQty(item) + '</span></div>';
                }).join("");

                var badgeText = meal.withinTolerance ? "Within tolerance" : "Closest match";
                var badgeClass = meal.withinTolerance ? "tolerance-badge" : "tolerance-badge outside";

                card.innerHTML =
                    '<div class="result-card-header">' +
                        '<span class="rank-label">' + rankMeta.badge + ' ' + rankMeta.label + '</span>' +
                        '<span class="' + badgeClass + '">' + badgeText + '</span>' +
                    '</div>' +
                    '<div class="result-card-body">' +
                        '<div class="result-card-title-row">' +
                            '<div>' +
                                '<h3>' + escapeHtml(meal.name) + '</h3>' +
                                '<div class="meta">' + capitalize(meal.mealType) + ' &middot; ' + meal.itemCount + ' Items &middot; ' + escapeHtml(meal.dietLabel) + '</div>' +
                            '</div>' +
                            '<div class="match-score">' +
                                '<strong>' + meal.matchScore + '%</strong>' +
                                '<span>Match score</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="item-list">' + itemsHtml + '</div>' +
                        '<div class="macro-totals">' +
                            '<div class="macro-total-box cal"><strong>' + Math.round(meal.totals.calories) + '</strong><span>Cal</span></div>' +
                            '<div class="macro-total-box protein"><strong>' + round1(meal.totals.protein) + 'g</strong><span>Protein</span></div>' +
                            '<div class="macro-total-box carbs"><strong>' + round1(meal.totals.carbs) + 'g</strong><span>Carbs</span></div>' +
                            '<div class="macro-total-box fat"><strong>' + round1(meal.totals.fat) + 'g</strong><span>Fat</span></div>' +
                        '</div>' +
                        '<div class="result-card-actions">' +
                            '<button class="btn btn-secondary save-meal-btn">♡ Save Meal</button>' +
                            '<button class="btn btn-primary add-log-btn">+ Add to Today\'s Log</button>' +
                        '</div>' +
                    '</div>';

                var saveBtn = card.querySelector(".save-meal-btn");
                var logBtn = card.querySelector(".add-log-btn");

                if (MealStorageService.isMealSaved(meal, savedMeals)) {
                    saveBtn.classList.add("saved");
                    saveBtn.textContent = "♥ Saved";
                }

                saveBtn.addEventListener("click", async function () {
                    saveBtn.disabled = true;
                    try {
                        var res = await MealStorageService.saveMeal(meal);
                        if (res.added) {
                            saveBtn.classList.add("saved");
                            saveBtn.textContent = "♥ Saved";
                            showToast("Meal saved.");
                        } else {
                            saveBtn.classList.add("saved");
                            saveBtn.textContent = "♥ Saved";
                            showToast("Already saved.");
                        }
                    } catch (err) {
                        showToast(err.message || "Could not save the meal.");
                    } finally {
                        saveBtn.disabled = false;
                    }
                });

                logBtn.addEventListener("click", async function () {
                    logBtn.disabled = true;
                    try {
                        await MealStorageService.addToTodayLog(meal);
                        logBtn.classList.add("added");
                        logBtn.textContent = "✓ Added to Log";
                        await renderRemainingTarget();
                        showToast("Added to today's log.");
                    } catch (err) {
                        logBtn.disabled = false;
                        showToast(err.message || "Could not add the meal to your log.");
                    }
                });

                els.resultsList.appendChild(card);
            });
        }

        var dbOverlay = document.getElementById("db-modal-overlay");

        async function openDatabaseModal(focusPantry) {
            if (focusPantry) {
                document.getElementById("db-modal-subtitle").textContent =
                    "Tick \"Pantry\" next to any food you have at home, then enable \"Use What I Have\".";
            }
            dbOverlay.classList.add("visible");
            try {
                await renderDatabaseTable();
            } catch (err) {
                console.warn("Could not load food database.", err);
            }
        }

        document.getElementById("browse-db-btn-empty").addEventListener("click", function () { openDatabaseModal(false); });
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
                var inPantry = PantryService.has(food.id);
                tr.innerHTML =
                    "<td>" + escapeHtml(food.name) + "</td>" +
                    "<td>" + escapeHtml(food.category) + "</td>" +
                    "<td><span class='db-diet-tag " + food.diet + "'>" + escapeHtml(capitalize(food.diet)) + "</span></td>" +
                    "<td>" + food.mealTypes.map(capitalize).join(", ") + "</td>" +
                    "<td>" + food.servingSize + " " + food.unit + "</td>" +
                    "<td>" + food.calories + "</td>" +
                    "<td>" + food.protein + "g</td>" +
                    "<td>" + food.carbs + "g</td>" +
                    "<td>" + food.fat + "g</td>" +
                    "<td><input type='checkbox' class='pantry-toggle' data-id='" + food.id + "' " + (inPantry ? "checked" : "") + "></td>";
                tbody.appendChild(tr);
            });

            tbody.querySelectorAll(".pantry-toggle").forEach(function (checkbox) {
                checkbox.addEventListener("change", async function () {
                    try {
                        await PantryService.toggle(checkbox.getAttribute("data-id"));
                        showToast(checkbox.checked ? "Added to pantry." : "Removed from pantry.");
                    } catch (err) {
                        checkbox.checked = !checkbox.checked;
                        showToast(err.message || "Could not update pantry.");
                    }
                });
            });
        }

        showState("empty");
    });

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
    function formatQty(item) {
        if (item.unit === "piece") {
            return item.quantity + (item.quantity === 1 ? " piece" : " pieces");
        }
        return item.quantity + " " + item.unit;
    }
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
})();
