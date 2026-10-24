# IMovies — Full-stack movie ticket booking

A MERN starter project for browsing movies, choosing showtimes, selecting seats, and booking tickets.

## Stack
- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt
- UI: custom responsive CSS

## Requirements
- Node.js 18+
- npm
- MongoDB local instance or MongoDB Atlas connection string

## 1. Configure the backend
```bash
cd server
cp .env.example .env
```
Edit `server/.env` and set `MONGODB_URI` and a long random `JWT_SECRET`.

## 2. Install and run
In one terminal:
```bash
cd server
npm install
npm run seed
npm run dev
```

In a second terminal:
```bash
cd client
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

## Demo flow
1. Register an account or log in.
2. Browse the seeded movies.
3. Open a movie, choose a showtime, select seats, and book.
4. Open My Bookings to view reservations.

## Notes
- The seed script creates sample movies and showtimes.
- Booking requests are checked server-side. A unique database index on showtime + seat prevents duplicate seat reservations.
- This starter simulates checkout; it does not process real payments.
- For production, add rate limiting, email verification, refresh-token/session strategy, stronger admin provisioning, audit logging, monitoring, and a payment provider. Use HTTPS and keep secrets out of source control.
- To make the admin route available, set `ADMIN_EMAIL` in `server/.env` to the email you register with. Then restart the server. This starter uses an email match for demo admin access; production systems should provision roles securely.
