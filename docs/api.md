# API

Base URL: `http://localhost:5000/api`

Authenticated routes expect `Authorization: Bearer <token>`.

Roles: `farmer`, `vendor`, `extension_officer`, `admin`.

Regions: `banjul`, `kanifing`, `west_coast`, `north_bank`, `lower_river`, `central_river_north`, `central_river_south`, `upper_river`.

## Health

`GET /health` returns API and MongoDB status.

## Auth

- `POST /auth/register` — register as `farmer`, `vendor`, or `extension_officer`. Body: `name`, `email`, `password`, `region`, optional `role`, `phone`, `village`, `crops`, `farmSizeHectares`, `language`.
- `POST /auth/login` — body: `email`, `password`. Returns JWT and user.
- `GET /auth/me` — current user (auth required).

## Users

- `GET /users/me` — current profile.
- `PATCH /users/me` — update `name`, `phone`, `region`, `village`, `crops`, `farmSizeHectares`, `language`.
- `GET /users` — list users (`admin`, `extension_officer`). Query: `role`, `region`.
- `PATCH /users/:id/role` — set a user's role (`admin` only).

## Weather

`GET /weather` — current conditions, 5-day outlook, and alerts. Query: `region`, or `lat` and `lon`. Defaults to the authenticated user's region. Uses OpenWeather when `OPENWEATHER_API_KEY` is set; otherwise Gambia climatology.

## Advice

- `GET /advice` — personalised advice from the user's region and crops. Query: `region`, `crop`.
- `POST /advice/generate` — generate advice for `region`, `crops`, optional `lat`/`lon`.
- `GET /advice/crops` — crop knowledge used by the engine.

## Crops and calendar

- `GET /crops` — list available crops.
- `GET /crops/:id/calendar` — calendar activity windows for a crop. Optional query: `region`.
- `GET /crops/calendar/current` — current activities. Query: `crop` or comma-separated `crops`, optional `region`.

## Dashboard

`GET /dashboard` — user summary, season, weather, alerts, top advice, and tracked crops.

## Marketplace

Marketplace records are stored in MongoDB and shared between users. Listing and buy-request creation use the authenticated user's profile for the public contact name and phone; those identity fields are not accepted from the request body.

### Produce listings

- `GET /listings` — open listings. Optional query: `crop`, `region`, `q`, `minPrice`, `maxPrice`, `minQty`.
- `GET /listings/:id` — one open listing.
- `GET /listings/mine` — the signed-in farmer's listings, including closed listings (`farmer`, `admin`).
- `POST /listings` — create a listing (`farmer`, `admin`). Body: `crop`, `quantity`, `askingPrice`, `region`, and optional `unit`, `village`, `availableFrom`, `notes`, `image`.
- `PATCH /listings/:id` — update your own listing (`farmer`, `admin`).
- `DELETE /listings/:id` — delete your own listing (`farmer`, `admin`).

### Buyer requests

- `GET /buy-requests` — open buyer requests. Optional query: `crop`, `region`.
- `GET /buy-requests/mine` — the signed-in buyer's requests (`vendor`, `admin`).
- `POST /buy-requests` — create a buy request (`vendor`, `admin`). Body: `crop`, `quantity`, `offerPrice`, `region`, and optional `unit`, `neededBy`, `notes`.

Both marketplace collections return `{ "success": true, "data": [...] }` for list endpoints. Individual records use the same envelope with one object in `data`.

### Matching

- `GET /matches` — authenticated users receive ranked matches for their listings or buy requests. Optional query: `crop`. Results include the matched `listing`, `request`, rank score, and match reasons. Matches require the same crop and unit, with nearby regions and compatible prices ranked first.

## Markets and prices

- `GET /markets` — list seeded Gambian markets. Optional query: `region`.
- `GET /markets/:id` — market details.
- `GET /markets/prices` — latest prices by crop and market. Optional query: `crop`, `marketId`, `region`.
- `GET /markets/compare?crop=groundnut` — latest prices and best-price market for one crop.
- `GET /markets/history?crop=groundnut&marketId=farafenni` — last seven recorded prices.
- `POST /markets/prices` — record a price (`admin`, `extension_officer`). Body: `crop`, `marketId`, `pricePerKg`, optional `note`. A submitted price is stored with its previous value to calculate the trend.

## Advisories and alerts

- `GET /advisories` — published advice. Optional query: `crop`, `category`, `q`.
- `GET /advisories/:id` — one published advisory.
- `POST /advisories` — publish advice (`admin`, `extension_officer`). Body: `title`, `category`, `summary`, `body`, optional `crop`, `language`.
- `GET /alerts` — current published alerts. Optional query: `region`.
- `POST /alerts` — publish an alert (`admin`, `extension_officer`). Body: `type`, `severity`, `region`, `title`, `message`.

Run `npm run seed` to seed the demo markets, seven-day sample price histories, and advisories alongside demo users and marketplace records.

When the API cannot be reached, the frontend falls back to browser-local sample marketplace data. This fallback is not announced with a banner. Writes made in this mode are stored only in that browser and are not uploaded automatically when the server returns.
