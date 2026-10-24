# MacroMatch frontend

This folder contains the static frontend (HTML/CSS/vanilla JS) for MacroMatch.

The app is now full-stack: Express serves these files and exposes the `/api` routes used by
`js/api.js`. All application data (users, sessions, foods, goals, pantry, logs, saved meals)
is stored in MongoDB.

See the [project README](../README.md) for setup, API documentation, and architecture.

## Running

From the repository root:

```bash
cd backend
npm install
npm start
```

Then open http://localhost:5055.

> Opening the HTML files directly from disk will not work anymore, because the frontend
> needs the Express API and same-origin session cookie.
