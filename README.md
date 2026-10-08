# AURALUXE MOTORS

A premium, responsive car showroom with a React/Vite frontend, an Express REST API, MongoDB persistence, and a protected showroom dashboard.

## Project structure

```text
frontend/
  public/cars/              Existing showroom photography
  src/
    components/             Shared showroom and admin components
    pages/                  Public site and admin screens
    lib/                     API client and helpers
    App.jsx
    index.css
backend/
  src/
    config/                  MongoDB connection
    middleware/              Authentication, validation, errors
    models/                  Admin, vehicle, message, showroom profile
    routes/                  Public API and protected admin API
    utils/                   Async and input helpers
    app.js
    server.js
```

## Public pages

- `/` — 3D featured-car showcase and selected vehicles
- `/vehicles` — searchable, filterable inventory with specifications and booking requests
- `/about` — AURALUXE MOTORS story and service highlights
- `/contact` — contact form and showroom details

## Requirements

- Node.js 20.19+ (or 22.12+) and npm
- MongoDB 7+ running locally or a MongoDB Atlas connection string

## First-time setup

1. From this folder, install all dependencies:

   ```sh
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

2. Create `backend/.env` (copy `backend/.env.example`) and set:

   ```dotenv
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/faham_luxe_motors
   JWT_SECRET=replace-with-a-random-secret-at-least-32-characters-long
   JWT_EXPIRES_IN=8h
   ADMIN_EMAIL=you@example.com
   ADMIN_PASSWORD=use-a-unique-password-of-at-least-12-characters
   CLIENT_ORIGIN=http://localhost:5152
   ```

   On the first successful database connection, the API creates the admin account from `ADMIN_EMAIL` and `ADMIN_PASSWORD` if it does not exist. The password is hashed with bcrypt. To change an existing admin password, use a secure database/admin maintenance workflow; restarting the API does not overwrite it.

3. Optionally configure SMTP in `backend/.env` to deliver replies from the dashboard:

   ```dotenv
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-smtp-user
   SMTP_PASS=your-smtp-password
   SMTP_FROM="AURALUXE MOTORS <showroom@example.com>"
   ```

   Reply delivery is intentionally disabled until SMTP is configured. The dashboard reports that configuration error instead of marking an unsent reply as delivered.

4. Start MongoDB, then run both development servers from the project root:

   ```sh
   npm run dev
   ```

   The frontend runs at `http://localhost:5152`, and the API runs at `http://localhost:5000`. The Vite development server proxies `/api` requests to the API.

5. Open `http://localhost:5152/admin/login` and sign in using the credentials configured above.

## Useful commands

```sh
npm run dev                 # Frontend and backend together
npm run build               # Production frontend build
npm run start:api            # Start the API without the frontend dev server
npm run dev --prefix backend # Start only the API with file watching
npm run dev --prefix frontend
```

## REST API

Public:

- `GET /api/portfolio` — showroom profile and available vehicles
- `GET /api/vehicles` — available vehicles; supports `q`, `make`, and `bodyStyle` filters
- `POST /api/contact` — save a validated enquiry
- `POST /api/bookings` — submit a preferred date and vehicle booking request; this is not a confirmed reservation or payment
- `POST /api/auth/login` — issue a signed admin JWT

Protected (`Authorization: Bearer <token>`):

- `GET /api/admin/messages`
- Booking requests appear with contact enquiries and include the requested vehicle and preferred date
- `POST /api/admin/messages/:id/reply` — send and record a reply (SMTP required)
- `PATCH /api/admin/messages/:id` — update enquiry status
- `DELETE /api/admin/messages/:id`
- `POST /api/admin/vehicles`, `PUT /api/admin/vehicles/:id`, `DELETE /api/admin/vehicles/:id`
- `PUT /api/admin/profile` — update showroom information and services

Health check: `GET /api/health`.

## Production notes

Set a unique JWT secret, configure `CLIENT_ORIGIN` to the exact deployed frontend origin, enable TLS, and use a managed MongoDB deployment with backups and network access restrictions. Never commit `.env` files. Build the frontend with `npm run build`; deploy `frontend/dist` separately or serve it through a configured web host. Configure SMTP before enabling message replies.
