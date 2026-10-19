# AgriConnect Gambia

A monorepo for the AgriConnect Gambia web application. Farmers, vendors, and extension officers share one dashboard for seasonal advice, weather, and crop guidance tailored to The Gambia.

## Getting started

1. Install Node.js (LTS), npm, and MongoDB.
2. Copy `.env.example` to `backend/.env` and set `DATABASE_URL` and `JWT_SECRET`.
3. Optionally set `OPENWEATHER_API_KEY`. Without it, the API uses Gambia seasonal climatology.
4. Run `npm install` from this directory.
5. Run `npm run seed` to load demo users and crops.
6. Run `npm run dev` to start the frontend and backend.

Demo accounts (password `Password123`):

- `farmer@agriconnect.gm`
- `extension@agriconnect.gm`
- `vendor@agriconnect.gm`
- `admin@agriconnect.gm`

See `docs/api.md` for the HTTP API.

The marketplace uses real, crop-matched photos served by the Pexels image CDN, so product photos require an internet connection.

If the API server cannot be reached, the frontend automatically switches supported marketplace, market-price, advisory, alert, and dashboard reads to sample data. A banner labels this offline demo mode. Changes made while offline stay in that browser's local storage and are not synchronized with the server.
