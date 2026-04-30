# SimpleChef API notes

Base URL: `/api/v1` (e.g. `http://localhost:8000/api/v1`).

Interactive OpenAPI: `http://localhost:8000/docs`.

## Auth

- `POST /users/` — JSON body `UserCreate` (email, password, optional profile fields). **Public** registration; returns created user (no token). Clients typically call login next.
- `POST /login/access-token` — OAuth2 form body `username` (email), `password`. Returns JWT (`access_token`, `token_type`).
- Wrong email/password on login returns **400** (`Incorrect email or password`), not 401.
- Send `Authorization: Bearer <token>` on protected routes.
- Invalid/expired JWT returns **401** (`Could not validate credentials`).
- Missing permission on a resource (e.g. editing someone else’s recipe) returns **403** without clearing the session on the client (web client only clears session on **401**).

## Recipes

- `GET /recipes/` — visible recipes: yours or `is_public`. Query: `q` (title contains), `difficulty`, `tag` (JSONB tags contains one string), `tags_all` (comma-separated; recipe must contain every tag — useful with profile dietary tags), `max_total_minutes` (prep + cook must be `<=` this), `skip`, `limit`.
- `GET /recipes/{id}` — 404 if not visible.
- `POST /recipes/` — sets `created_by_id` to you.
- `PUT` / `DELETE /recipes/{id}` — owner only (403 otherwise).
- `POST /recipes/parse?text=` — **demo** parser only; rejects URL-only paste; validates output.

Ingredients may include `step_order_index` (matches `Step.order_index`) to link mise en place to a step; stored as `ingredient.step_id`.

## Planner

- `GET /planner/day-summary?date=YYYY-MM-DD` — logged calorie totals for that day: `consumed_calories` sums `calories` on meals where the field is set; `meals_without_calories` counts rows with null `calories`. Compare to `calorie_goal` from `GET /users/me` on the client.
- `GET /planner/?start_date=&end_date=` — your meals; `recipe_title` populated when `recipe_id` is set.
- `POST /planner/` — create meal.
- `PATCH /planner/{meal_id}` — update (owner only).
- `DELETE /planner/{meal_id}` — 204 (owner only).

## Grocery

- `GET /grocery/` — your list (auto-created).
- `POST /grocery/items` — add item.
- `PUT /grocery/items/{id}` — update (must be on your list).
- `DELETE /grocery/items/{id}` — 204.
- `POST /grocery/from-plan?start_date=&end_date=` — merge planned recipe ingredients into the list (dedupe by normalized name + unit, sum quantities).
- `GET /grocery/export.txt` — plain-text list for sharing.

## Users

- `GET /users/me` — current user.
- `PATCH /users/me` — partial profile update (`UserSelfUpdate`: name, bio, goals, dietary list, `is_screen_always_on`, etc.; no email/password here).

## Environment (backend)

- `DATABASE_URL` or `POSTGRES_*` fields in `.env` (see `app/core/config.py`).
- `SECRET_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES`.

## Frontend integration

- **`figma_design/`:** set `VITE_API_URL` to the full API base including `/api/v1` (see project `README.md`).
- **`frontend/` (Expo):** set `EXPO_PUBLIC_API_URL` the same way (full base with `/api/v1`).
