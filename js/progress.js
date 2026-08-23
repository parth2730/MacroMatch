<<<<<<< HEAD

=======
/* =========================================================
   progress.js
   -------------------------------------------------------
   Reads:
     - "mm_daily_goal"       (same key/shape calculator.js writes)
     - MealStorageService.getFullLog() (mm_today_log, all dates)

   Renders:
     - 4 stat cards (avg calories, avg protein, goal completion,
       best day) computed over the current Sun-Sat week
     - Today's progress bars (calories/protein/carbs/fat vs goal)
     - Two weekly line charts (calories, protein), Sun-Sat
     - Today's macro calorie-split bar + legend
   ========================================================= */
>>>>>>> 1f051cc050d646745639f1017e51b5becca3700f

(function () {
    "use strict";

    var DAILY_GOAL_KEY = "mm_daily_goal";
<<<<<<< HEAD

=======
    // Keep this identical to calculator.js's DEFAULT_GOAL so both
    // pages agree on what "no goal saved yet" means.
>>>>>>> 1f051cc050d646745639f1017e51b5becca3700f
    var DEFAULT_GOAL = { calories: 2200, protein: 150, carbs: 220, fat: 65 };

    var DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    document.addEventListener("DOMContentLoaded", function () {

<<<<<<< HEAD
        
=======
        /* -------- Session (soft gate, same pattern as dashboard.js) -------- */
>>>>>>> 1f051cc050d646745639f1017e51b5becca3700f
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

<<<<<<< HEAD
    
=======
        /* -------- Load data + render -------- */
>>>>>>> 1f051cc050d646745639f1017e51b5becca3700f
        renderAll();

        function renderAll() {
            var goal = getGoal();
            var fullLog = MealStorageService.getFullLog();
            var todayStr = MealStorageService.todayString();

            var weekDateStrs = getWeekDateStrings(todayStr);      // [Sun..Sat] "YYYY-MM-DD"
            var todayIndex = weekDateStrs.indexOf(todayStr);
            var weekTotals = weekDateStrs.map(function (ds) {
                return totalsForDate(fullLog, ds);
            });

            renderStatCards(goal, weekDateStrs, weekTotals);
            renderTodayProgress(goal, weekTotals[todayIndex]);
            renderWeeklyCharts(weekTotals);
            renderMacroDistribution(weekTotals[todayIndex]);
        }

<<<<<<< HEAD
        
=======
        /* -------- Cross-tab sync --------
           If a meal is logged (or the goal is edited) in another tab,
           the browser fires "storage" here automatically. Just re-run
           the same render pipeline against the fresh localStorage data. */
>>>>>>> 1f051cc050d646745639f1017e51b5becca3700f
        window.addEventListener("storage", function (e) {
            if (e.key === MealStorageService.TODAY_LOG_KEY || e.key === DAILY_GOAL_KEY) {
                renderAll();
            }
        });
    });

<<<<<<< HEAD

=======
    /* ---------------- Goal ---------------- */
>>>>>>> 1f051cc050d646745639f1017e51b5becca3700f

    function getGoal() {
        try {
            var raw = localStorage.getItem(DAILY_GOAL_KEY);
            if (!raw) return Object.assign({}, DEFAULT_GOAL);
            var parsed = JSON.parse(raw);
            return Object.assign({}, DEFAULT_GOAL, parsed);
        } catch (err) {
            return Object.assign({}, DEFAULT_GOAL);
        }
    }

<<<<<<< HEAD
    
=======
    /* ---------------- Date helpers ---------------- */
>>>>>>> 1f051cc050d646745639f1017e51b5becca3700f

    function parseDateStr(s) {
        var parts = s.split("-");
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }

    function dateToStr(d) {
        return d.getFullYear() + "-" +
            String(d.getMonth() + 1).padStart(2, "0") + "-" +
            String(d.getDate()).padStart(2, "0");
    }

<<<<<<< HEAD
    
=======
    // Returns the 7 date strings (Sun -> Sat) for the week containing todayStr.
>>>>>>> 1f051cc050d646745639f1017e51b5becca3700f
    function getWeekDateStrings(todayStr) {
        var today = parseDateStr(todayStr);
        var sunday = new Date(today);
        sunday.setDate(today.getDate() - today.getDay());

        var out = [];
        for (var i = 0; i < 7; i++) {
            var d = new Date(sunday);
            d.setDate(sunday.getDate() + i);
            out.push(dateToStr(d));
        }
        return out;
    }

    function totalsForDate(fullLog, dateStr) {
        return fullLog
            .filter(function (entry) { return entry.date === dateStr; })
            .reduce(function (totals, entry) {
                totals.calories += entry.totals.calories || 0;
                totals.protein += entry.totals.protein || 0;
                totals.carbs += entry.totals.carbs || 0;
                totals.fat += entry.totals.fat || 0;
                return totals;
            }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }

    function hasAnyLog(totals) {
        return totals.calories > 0 || totals.protein > 0 || totals.carbs > 0 || totals.fat > 0;
    }

<<<<<<< HEAD
 
=======
    /* ---------------- Stat cards ---------------- */
>>>>>>> 1f051cc050d646745639f1017e51b5becca3700f

    function renderStatCards(goal, weekDateStrs, weekTotals) {
        var loggedDays = weekTotals.filter(hasAnyLog);

        var avgCaloriesEl = document.getElementById("stat-avg-calories");
        var avgProteinEl = document.getElementById("stat-avg-protein");
        var goalCompletionEl = document.getElementById("stat-goal-completion");
        var bestDayEl = document.getElementById("stat-best-day");

        if (loggedDays.length === 0) {
            avgCaloriesEl.textContent = "0 kcal";
            avgCaloriesEl.classList.add("is-empty");
            avgProteinEl.textContent = "0 g";
            avgProteinEl.classList.add("is-empty");
            goalCompletionEl.textContent = "0%";
            goalCompletionEl.classList.add("is-empty");
            bestDayEl.textContent = "\u2014";
            bestDayEl.classList.add("is-empty");
            return;
        }

        var avgCalories = loggedDays.reduce(function (sum, t) { return sum + t.calories; }, 0) / loggedDays.length;
        var avgProtein = loggedDays.reduce(function (sum, t) { return sum + t.protein; }, 0) / loggedDays.length;

        avgCaloriesEl.textContent = Math.round(avgCalories) + " kcal";
        avgProteinEl.textContent = round1(avgProtein) + " g";

<<<<<<< HEAD
=======
        // Goal completion: average (capped at 100%) of each logged day's
        // calorie total against the daily calorie goal.
>>>>>>> 1f051cc050d646745639f1017e51b5becca3700f
        var completionSum = loggedDays.reduce(function (sum, t) {
            var pct = goal.calories > 0 ? (t.calories / goal.calories) * 100 : 0;
            return sum + Math.min(100, pct);
        }, 0);
        var goalCompletion = Math.round(completionSum / loggedDays.length);
        goalCompletionEl.textContent = goalCompletion + "%";

<<<<<<< HEAD

=======
        // Best day: highest calorie total among days that have a log.
>>>>>>> 1f051cc050d646745639f1017e51b5becca3700f
        var bestIndex = -1;
        var bestCalories = -1;
        weekTotals.forEach(function (t, i) {
            if (hasAnyLog(t) && t.calories > bestCalories) {
                bestCalories = t.calories;
                bestIndex = i;
            }
        });
        bestDayEl.textContent = bestIndex >= 0 ? DAY_LABELS[bestIndex] : "\u2014";
    }

<<<<<<< HEAD
=======
    /* ---------------- Today's progress bars ---------------- */
>>>>>>> 1f051cc050d646745639f1017e51b5becca3700f

    function renderTodayProgress(goal, todayTotals) {
        setBar("cal", todayTotals.calories, goal.calories, "kcal", true);
        setBar("protein", todayTotals.protein, goal.protein, "g", false);
        setBar("carbs", todayTotals.carbs, goal.carbs, "g", false);
        setBar("fat", todayTotals.fat, goal.fat, "g", false);
    }

    function setBar(key, current, target, unit, isCalories) {
        var labelKey = isCalories ? "cal" : key;
        var label = document.getElementById("today-" + labelKey + "-label");
        var fill = document.getElementById("today-" + labelKey + "-fill");

        var currentDisplay = isCalories ? Math.round(current) : round1(current);
        var targetDisplay = isCalories ? Math.round(target) : round1(target);

        label.textContent = currentDisplay + " / " + targetDisplay + " " + unit;

        var pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
        fill.style.width = pct + "%";
    }

<<<<<<< HEAD

=======
    /* ---------------- Weekly line charts ---------------- */
>>>>>>> 1f051cc050d646745639f1017e51b5becca3700f

    function renderWeeklyCharts(weekTotals) {
        var calorieValues = weekTotals.map(function (t) { return t.calories; });
        var proteinValues = weekTotals.map(function (t) { return t.protein; });

        document.getElementById("weekly-calories-chart").innerHTML =
            buildLineChart(calorieValues, "var(--green)", 0);

        document.getElementById("weekly-protein-chart").innerHTML =
            buildLineChart(proteinValues, "#69bfff", 0);
    }

    function buildLineChart(values, strokeColor, minMax) {
        var width = 560;
        var height = 220;
        var padding = { top: 16, right: 16, bottom: 28, left: 34 };
        var innerW = width - padding.left - padding.right;
        var innerH = height - padding.top - padding.bottom;

        var rawMax = Math.max.apply(null, values.concat([minMax]));
        var niceMax = niceCeil(rawMax <= 0 ? 10 : rawMax);
        var stepCount = 4;
        var stepVal = niceMax / stepCount;

        var points = values.map(function (v, i) {
            var x = padding.left + (values.length > 1 ? (innerW / (values.length - 1)) * i : innerW / 2);
            var y = padding.top + innerH - (v / niceMax) * innerH;
            return { x: x, y: y, v: v };
        });

        var pathD = points.map(function (p, i) {
            return (i === 0 ? "M" : "L") + p.x.toFixed(1) + "," + p.y.toFixed(1);
        }).join(" ");

        var gridLines = "";
        for (var g = 0; g <= stepCount; g++) {
            var y = padding.top + innerH - (g * stepVal / niceMax) * innerH;
            gridLines +=
                '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" class="chart-grid-line" />' +
                '<text x="' + (padding.left - 8) + '" y="' + (y + 3) + '" class="chart-axis-label" text-anchor="end">' + Math.round(g * stepVal) + '</text>';
        }

        var xLabels = points.map(function (p, i) {
            return '<text x="' + p.x + '" y="' + (height - 8) + '" class="chart-axis-label" text-anchor="middle">' + DAY_LABELS[i] + '</text>';
        }).join("");

        var dots = points.map(function (p) {
            return '<circle cx="' + p.x + '" cy="' + p.y + '" r="4" class="chart-dot" style="fill:' + strokeColor + '" />';
        }).join("");

        return (
            '<svg viewBox="0 0 ' + width + ' ' + height + '" class="chart-svg" preserveAspectRatio="xMidYMid meet">' +
                gridLines +
                '<path d="' + pathD + '" class="chart-line" style="stroke:' + strokeColor + '" />' +
                dots +
                xLabels +
            '</svg>'
        );
    }

<<<<<<< HEAD
   
=======
    // Rounds a value up to a "nice" axis maximum (10, 20, 50, 100, 200 ...).
>>>>>>> 1f051cc050d646745639f1017e51b5becca3700f
    function niceCeil(v) {
        if (v <= 10) return 10;
        var magnitude = Math.pow(10, Math.floor(Math.log10(v)));
        var normalized = v / magnitude;
        var niceNormalized;
        if (normalized <= 1) niceNormalized = 1;
        else if (normalized <= 2) niceNormalized = 2;
        else if (normalized <= 5) niceNormalized = 5;
        else niceNormalized = 10;
        return niceNormalized * magnitude;
    }

<<<<<<< HEAD
    
=======
    /* ---------------- Macro distribution (today) ---------------- */
>>>>>>> 1f051cc050d646745639f1017e51b5becca3700f

    function renderMacroDistribution(todayTotals) {
        var emptyEl = document.getElementById("macro-dist-empty");
        var bodyEl = document.getElementById("macro-dist-body");
        var barEl = document.getElementById("macro-dist-bar");
        var legendEl = document.getElementById("macro-dist-legend");

        var proteinCal = todayTotals.protein * 4;
        var carbsCal = todayTotals.carbs * 4;
        var fatCal = todayTotals.fat * 9;
        var totalCal = proteinCal + carbsCal + fatCal;

        if (totalCal <= 0) {
            emptyEl.classList.remove("hidden");
            bodyEl.classList.add("hidden");
            return;
        }

        emptyEl.classList.add("hidden");
        bodyEl.classList.remove("hidden");

        var proteinPct = Math.round((proteinCal / totalCal) * 100);
        var carbsPct = Math.round((carbsCal / totalCal) * 100);
        var fatPct = Math.max(0, 100 - proteinPct - carbsPct); // absorb rounding drift

        barEl.innerHTML =
            '<div class="macro-dist-segment protein" style="width:' + proteinPct + '%"></div>' +
            '<div class="macro-dist-segment carbs" style="width:' + carbsPct + '%"></div>' +
            '<div class="macro-dist-segment fat" style="width:' + fatPct + '%"></div>';

        legendEl.innerHTML =
            legendItem("protein", "Protein", proteinPct) +
            legendItem("carbs", "Carbs", carbsPct) +
            legendItem("fat", "Fat", fatPct);
    }

    function legendItem(cssClass, label, pct) {
        return (
            '<div class="macro-dist-legend-item">' +
                '<span class="macro-dot ' + cssClass + '"></span>' +
                '<span><strong>' + pct + '%</strong> ' + label + '</span>' +
            '</div>'
        );
    }

<<<<<<< HEAD
   
=======
    /* ---------------- Shared small helpers (same as dashboard.js) ---------------- */
>>>>>>> 1f051cc050d646745639f1017e51b5becca3700f

    function round1(n) {
        return Math.round(n * 10) / 10;
    }

    function escapeHtml(str) {
        var div = document.createElement("div");
        div.textContent = str == null ? "" : String(str);
        return div.innerHTML;
    }
})();