MacroMatch 🥗

Reverse your macros. Build your meal.

MacroMatch is a web app that flips the usual "calorie calculator" idea around. Instead of picking a food and checking its macros, you tell MacroMatch the calories, protein, carbs, and fat you want, and it searches a food database to find combinations of real foods (with quantities) that come closest to your target — ranked by how good a match they are.

Built as a front-end-only project: plain HTML, CSS and JavaScript, with the browser's localStorage used as a lightweight database (no backend server required).

✨ Features
Sign up / Login with client-side validation (email format, password strength) and a simple session system
Meal Calculator — enter a macro target and get up to 5 ranked meal suggestions built from a food database
Dashboard — daily summary of calories/macros logged so far, today's meal log, and saved meals
Food Database browser (foods.html) — search and filter all foods by category, diet type, high-protein, or low-calorie
Pantry ("Use What I Have") — mark foods you already have at home so recommendations only use those
Progress page — visual tracking of daily goals over time
Diet filters — vegan / vegetarian / non-vegetarian aware recommendations
🧠 How the recommendation engine works

This is the core logic, in js/recommendationEngine.js:

Filter the food database down to foods matching the selected diet and meal type (and pantry items, if that option is enabled).
Build a candidate pool — if there are too many matching foods, it keeps a smaller pool sorted by protein-per-calorie, so the next step doesn't explode in size.
Generate combinations — recursively builds every possible group of 1 up to maxItems foods from that pool.
Scale quantities — for each combination, it calculates scaling factors (calorie-based, protein-based, and a blend) to try to hit the target, then rounds portions to sensible amounts (nearest 25g, or nearest half-piece).
Score each combination using a weighted similarity formula:
   score = 0.30 × calorieMatch + 0.35 × proteinMatch + 0.20 × carbMatch + 0.15 × fatMatch
Tolerance check — flags whether a combination lands within ±8% of every target value.
Rank and return the top 5 results, preferring combinations within tolerance and falling back to the closest matches if needed.
🗂️ Project structure
MacroMatch/
├── index.html            # Landing page
├── signup.html           # Sign up form (inline script)
├── login.html             # Login form (inline script)
├── dashboard.html         # Post-login summary/hub
├── calculator.html        # The reverse macro calculator
├── foods.html             # Browsable food database
├── progress.html          # Daily goal progress tracking
├── foods.json             # Seed food data (nutrition per serving)
├── index.js                # Landing page button wiring
├── css/
│   ├── shared.css
│   ├── dashboard.css
│   ├── calculator.css
│   ├── foods.css
│   └── progress.css
└── js/
    ├── calculator.js           # Calculator page logic & UI
    ├── recommendationEngine.js # Core matching/scoring algorithm
    ├── dashboard.js             # Dashboard page logic
    ├── foods.js                 # Food database browser/filter logic
    ├── foodDatabase.js          # Seeds & serves food data to the app
    ├── mealStorage.js           # Saved meals + today's log (localStorage)
    ├── pantryStorage.js         # "What I have at home" pantry list
    └── progress.js               # Progress page logic
💾 Data & storage

There is no backend — everything persists in the browser via localStorage:

Key	Purpose
mm_users	All registered accounts (name, email, password)
mm_current_user	The currently logged-in session
mm_daily_goal	The user's daily calorie/macro target
mm_today_log	Meals logged for today
mm_saved_meals	Meals the user has bookmarked
mm_pantry	Food IDs the user has marked as "at home"
mm_food_database	Cached/seeded food database

⚠️ Note: Since this is a client-side demo, passwords are stored in plain text in localStorage and there's no real authentication/server security. This is fine for a college project but should not be used as-is in production — a real app would hash passwords and store users in a proper backend database.

🚀 Getting started

No build tools or install needed — it's plain HTML/CSS/JS.

Clone the repo:
bash
   git clone https://github.com/parth2730/MacroMatch.git
   cd MacroMatch
Open index.html in your browser, or serve it locally (recommended, since foods.html fetches foods.json):
bash
   npx serve .
   # or
   python -m http.server 8000
Sign up for an account, log in, and head to the Calculator to generate your first meal.
🛠️ Tech used
HTML5, CSS3, vanilla JavaScript (no frameworks or libraries)
Browser localStorage for persistence (users, sessions, goals, meal logs)
fetch() to load foods.json for the food database browser
👥 Contributors

Made as part of a college project by the MacroMatch team.
