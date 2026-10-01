# RidePool – MERN Workshop Project

Users register, post rides, apply to other people's rides, and once joined both sides see each other's phone number.

## Run it

Needs Node 20+ and MongoDB running locally (or an Atlas URI).

```bash
# 1. backend  (http://localhost:8000)
cd ridepooling-backend
cp .env.example .env      # edit MONGO_URI if using Atlas
npm install
npm start

# 2. frontend (http://localhost:5173)
cd ridepooling-frontend
# .env already points to the backend (VITE_API_URL=http://localhost:8000/api)
npm install
npm run dev
```

## Structure

```
ridepooling-backend/
  index.js              server + Mongo connection + route mounting
  models/User.js        name, email, phone, hashed password
  models/Ride.js        source, destination, departureTime, price, vehicleType, allowedCount, participants[]
  middleware/auth.js    verifies the JWT, sets req.userId
  routes/auth.js        POST /register, POST /login, GET /me
  routes/rides.js       POST /  · GET /  · GET /mine  · POST /join

ridepooling-frontend/src/
  api.js                fetch wrapper that attaches the token
  AuthContext.jsx       login / register / logout + current user
  pages/                Login, Register, Rides (browse + apply), PostRide, MyRides (Upcoming + History)
  components/           Navbar, RideCard
```

## API

| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/register` | name, email, phone, password → token |
| POST | `/api/auth/login` | email, password → token |
| GET | `/api/auth/me` | restore session |
| POST | `/api/rides` | create a ride |
| GET | `/api/rides?source=&destination=` | upcoming rides (no phone numbers) |
| GET | `/api/rides/mine` | `{ upcoming, history }` – includes the other side's phone |
| POST | `/api/rides/join` | body `{ "id": "<rideId>" }` – apply to a ride (atomic, can't overbook) |

## Workshop ideas / next steps
- Cancel / leave a ride, delete your own ride
- Edit a ride
- Ride rating after completion
- Deploy: backend to Render, frontend to Vercel/Netlify (set `VITE_API_URL` in the frontend `.env` to the deployed backend URL)
