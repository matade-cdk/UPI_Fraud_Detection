# Backend

Express + MongoDB backend for mobile app and admin dashboard integration.

## Setup

1. Install dependencies:
   - `npm install`
2. Create env file:
   - copy `.env.example` to `.env`
3. Run server:
   - `npm run dev` (development)
   - `npm start` (production)

## API Base

- `/api/v1`

## Included Endpoints

- `GET /api/v1/health`
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/auth/users`
- `GET /api/v1/transactions`
- `POST /api/v1/transactions`
- `POST /api/v1/ml/predict`
