# AgriConnect Gambia

A monorepo for the AgriConnect Gambia web application. Farmers, vendors, and extension officers share one dashboard for seasonal advice, weather, and crop guidance tailored to The Gambia.

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

The marketplace uses real, crop-matched photos served by the Pexels image CDN, so product photos require an internet connection.

If the API server cannot be reached, the frontend automatically switches supported marketplace, market-price, advisory, alert, and dashboard reads to sample data. A banner labels this offline demo mode. Changes made while offline stay in that browser's local storage and are not synchronized with the server.
