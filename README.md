# AgriConnect Gambia

A monorepo for the AgriConnect Gambia web application. Farmers, vendors, and extension officers share one dashboard for seasonal advice, weather, crop and soil guidance, and livestock and poultry business information tailored to The Gambia.

## Getting started

1. Install Node.js (LTS), npm, and MongoDB.
2. Copy `.env.example` to `backend/.env` and set `DATABASE_URL` and `JWT_SECRET`.
3. Optionally set `OPENWEATHER_API_KEY`. Without it, the API uses Gambia seasonal climatology.
4. Run `npm install` from this directory.
5. Run `npm run seed` to load demo users and crops.
6. Run `npm run dev` to start the frontend and backend.

## Deploy on Render

This repository includes a `render.yaml` Blueprint for a single Node web service. Render builds the React frontend into `frontend/dist`, then the Express server serves the built site and `/api` from the same URL. `App.jsx` is a source module bundled by Vite; it is not the server entry point.

1. Push this repository to a Git provider supported by Render.
2. In Render, create a new **Blueprint** and select this repository. Render reads `render.yaml` and configures the build, start, and health check commands.
3. Provide `DATABASE_URL` when prompted. It must be a reachable MongoDB connection string, for example from MongoDB Atlas; Render does not provide a MongoDB service through this Blueprint.
4. Keep the generated `JWT_SECRET` private. Render generates it from the Blueprint.
5. Deploy. The health endpoint is `/api/health`, and the deployed web service serves the frontend at its root URL.

The app uses `/api` on the same origin in production, so no frontend API URL or CORS setting is needed. The Blueprint uses Render's free web service plan; free services may spin down when idle. The database must be provisioned separately, and demo seed accounts use published sample passwords, so do not seed them into a public production database.

For a local production-style run, use `npm run build` followed by `npm start` with `NODE_ENV=production`, `DATABASE_URL`, and `JWT_SECRET` configured.

Demo accounts (password `Password123`):

- `farmer@agriconnect.gm`
- `extension@agriconnect.gm`
- `vendor@agriconnect.gm`
- `admin@agriconnect.gm`

See `docs/api.md` for the HTTP API.

The marketplace features a real photo of produce at Serrekunda Market, The Gambia, stored locally so it works offline. Photo: Forbes Johnston, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Chilli_by_the_dozen,_Serrekunda_market,_The_Gambia_(6646713697).jpg). Produce cards use locally stored crop photos when available and app illustrations as a fallback.

Open the three-dot settings menu in the top bar to choose a color theme, use the custom color picker, or adjust font size under Display. These preferences are saved in this browser. Privacy settings let account holders control phone visibility on public listings and clear app data saved in the current browser; clearing browser data does not delete server records. Copyright and Authors information is available as subsections of Privacy. The Advisory page includes common soil types and crops that generally suit them. The Livestock page supports livestock sale listings and buyer requests, highlights Lumo markets, Abuko and Kanilai Farm, and recommends contacting veterinary professionals for animal-health concerns.

If the API server cannot be reached, the frontend automatically switches to browser-local demo mode. Demo accounts (password `Password123`) and registration, dashboard/weather, markets, marketplace, advisories, alerts, and profile editing work without the backend. Offline changes stay in that browser's local storage and are not synchronized with the server. The app checks for the backend every 10 seconds and automatically resumes server-backed requests and refreshes the active screen/session when it returns. If you signed in with a local demo account, sign in again to authenticate with the server.
