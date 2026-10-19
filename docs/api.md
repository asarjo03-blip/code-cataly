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

## Dashboard

`GET /dashboard` — user summary, season, weather, alerts, top advice, and tracked crops.
