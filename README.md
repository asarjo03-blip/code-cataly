# AgriConnect Gambia

A monorepo for the AgriConnect Gambia web application. Farmers, vendors, and extension officers share one dashboard for seasonal advice, weather, crop and soil guidance, and livestock and poultry business information tailored to The Gambia.

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

The marketplace features a real photo of produce at Serrekunda Market, The Gambia, stored locally so it works offline. Photo: Forbes Johnston, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Chilli_by_the_dozen,_Serrekunda_market,_The_Gambia_(6646713697).jpg). Produce cards use locally stored crop photos when available and app illustrations as a fallback.

Open the three-dot settings menu in the top bar to choose a color theme, use the custom color picker, or adjust font size under Display. These preferences are saved in this browser. Privacy settings let account holders control phone visibility on public listings and clear app data saved in the current browser; clearing browser data does not delete server records. Copyright and Authors information is available as subsections of Privacy. The Advisory page includes common soil types and crops that generally suit them. The Livestock page supports livestock sale listings and buyer requests, highlights Lumo markets, Abuko and Kanilai Farm, and recommends contacting veterinary professionals for animal-health concerns.

If the API server cannot be reached, the frontend automatically switches to browser-local demo mode. Demo accounts (password `Password123`) and registration, dashboard/weather, markets, marketplace, advisories, alerts, and profile editing work without the backend. Offline changes stay in that browser's local storage and are not synchronized with the server. The app checks for the backend every 10 seconds and automatically resumes server-backed requests and refreshes the active screen/session when it returns. If you signed in with a local demo account, sign in again to authenticate with the server.
