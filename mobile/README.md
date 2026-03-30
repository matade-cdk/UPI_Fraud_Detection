# UPI Guard Mobile (Expo)

Mobile app built with React Native + Expo, aligned with the existing web UI and flow.

## Included

- Landing screen with hero, trust badges, features, testimonials and CTA
- Dashboard with tabs:
  - Overview
  - Analytics
  - Transactions
  - Alerts
  - ML Model
  - Settings
- In-app AI assistant widget
- Shared dark neon design theme similar to web client

## Run

1. Install dependencies

```bash
cd mobile
npm install
```

2. Start Expo

```bash
npm run start
```

3. Open on Android/iOS with Expo Go, or run:

```bash
npm run android
npm run ios
```

## Notes

- Current data is mocked based on the dashboard content already used in the web client.
- Next step is wiring these screens to real backend endpoints defined in `backend/REQUIRED_API_ENDPOINTS.md`.
