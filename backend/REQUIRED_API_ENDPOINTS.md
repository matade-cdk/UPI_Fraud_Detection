# UPI Fraud Detection - Required API Endpoints

This document defines the backend endpoints needed to connect the current dashboard UI to real ML services and database data.

## Base Rules

- Base URL: `/api/v1`
- Auth: `Authorization: Bearer <jwt_token>` on all protected endpoints
- Content-Type: `application/json`
- Time format: ISO 8601 UTC (example: `2026-03-29T18:25:43Z`)
- Currency: INR unless otherwise specified

## 1) Health and Service Status

### GET /api/v1/health
Purpose: API health check for frontend boot and uptime monitor.

Response:
```json
{
  "status": "ok",
  "service": "upi-fraud-api",
  "version": "1.0.0",
  "time": "2026-03-29T18:25:43Z"
}
```

### GET /api/v1/system/status
Purpose: Dashboard top-level status (model + queue + DB).

Response:
```json
{
  "model": { "status": "active", "version": "v2.4.1", "accuracy": 0.993 },
  "database": { "status": "connected", "latencyMs": 22 },
  "stream": { "status": "active", "lastEventAt": "2026-03-29T18:20:00Z" }
}
```

## 2) Auth and Session

### POST /api/v1/auth/login
Purpose: Login and issue access + refresh tokens.

Request:
```json
{
  "email": "admin@upiguard.com",
  "password": "string"
}
```

Response:
```json
{
  "accessToken": "jwt",
  "refreshToken": "jwt",
  "expiresIn": 3600,
  "user": {
    "id": "u_123",
    "name": "Admin User",
    "role": "Fraud Analyst"
  }
}
```

### POST /api/v1/auth/refresh
Purpose: Rotate access token using refresh token.

### POST /api/v1/auth/logout
Purpose: Invalidate current session/token.

Request:
```json
{
  "refreshToken": "jwt"
}
```

### GET /api/v1/auth/me
Purpose: Current user profile for sidebar/user badge.

## 3) Overview Dashboard Data

### GET /api/v1/dashboard/overview
Purpose: Data for overview cards.

Query params:
- `window` (example: `24h`, `7d`, `30d`)

Response:
```json
{
  "totals": {
    "transactions": 12847,
    "fraudDetected": 38,
    "flaggedForReview": 112,
    "modelAccuracy": 0.993
  },
  "trends": {
    "transactions": "+4.2%",
    "fraudDetected": "+2 in last hour",
    "flaggedForReview": "-8%",
    "modelAccuracy": "Live production"
  },
  "updatedAt": "2026-03-29T18:25:43Z"
}
```

## 4) Transactions

### GET /api/v1/transactions
Purpose: Table data for recent and paginated transactions.

Query params:
- `page` (default 1)
- `limit` (default 20)
- `risk` (`LOW|MEDIUM|HIGH`)
- `from`, `to` (ISO datetime)
- `search` (txn id, upi id, user id)

Response:
```json
{
  "items": [
    {
      "id": "TXN-9182",
      "upiRecipient": "raj@okhdfc",
      "amount": 82000,
      "currency": "INR",
      "time": "2026-03-29T03:14:00Z",
      "risk": "HIGH",
      "score": 91,
      "status": "flagged"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 12847 }
}
```

### GET /api/v1/transactions/:id
Purpose: Transaction detail drawer/page.

### POST /api/v1/transactions/:id/review
Purpose: Analyst action (mark legit/fraud, add note).

Request:
```json
{
  "decision": "fraud",
  "note": "Device mismatch + velocity anomaly"
}
```

## 5) Alerts

### GET /api/v1/alerts
Purpose: Alerts feed with filters.

Query params:
- `status` (`open|acknowledged|resolved`)
- `severity` (`low|medium|high`)
- `page`, `limit`

Response:
```json
{
  "items": [
    {
      "id": "AL-1001",
      "severity": "high",
      "message": "High-value transfer to new UPI at unusual hour",
      "transactionId": "TXN-9182",
      "createdAt": "2026-03-29T03:14:15Z",
      "status": "open"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 381 }
}
```

### PATCH /api/v1/alerts/:id
Purpose: Update alert state.

Request:
```json
{
  "status": "acknowledged",
  "assignee": "u_123",
  "note": "Investigating with issuer"
}
```

## 6) Analytics

### GET /api/v1/analytics/fraud-trend
Purpose: Sparkline trend (last N days).

Query params:
- `days` (default 14)

Response:
```json
{
  "points": [
    { "date": "2026-03-16", "fraudCount": 12 },
    { "date": "2026-03-17", "fraudCount": 18 }
  ]
}
```

### GET /api/v1/analytics/weekly-volume
Purpose: Weekly total vs fraud bars.

Response:
```json
{
  "points": [
    { "day": "Mon", "total": 1840, "fraud": 12 },
    { "day": "Tue", "total": 2100, "fraud": 18 }
  ]
}
```

### GET /api/v1/analytics/risk-distribution
Purpose: Donut chart percentages.

Response:
```json
{
  "low": 68,
  "medium": 22,
  "high": 10
}
```

### GET /api/v1/analytics/fraud-hourly
Purpose: Hour-wise fraud heatmap.

Response:
```json
{
  "hours": [
    { "hour": 0, "volume": 12, "fraud": 1 },
    { "hour": 1, "volume": 20, "fraud": 4 }
  ]
}
```

### GET /api/v1/analytics/top-risky-merchants
Purpose: Top risky entities/patterns table.

Query params:
- `limit` (default 10)
- `window` (`24h|7d|30d`)

Response:
```json
{
  "items": [
    { "name": "Unknown Merchant", "fraudCount": 34, "risk": "HIGH" },
    { "name": "Crypto Exchange XY", "fraudCount": 28, "risk": "HIGH" }
  ]
}
```

## 7) ML Model Endpoints

### POST /api/v1/ml/predict
Purpose: Real-time fraud score prediction for a transaction.

Request:
```json
{
  "transactionId": "TXN-9999",
  "userId": "u_45",
  "amount": 52000,
  "upiRecipient": "abc@okaxis",
  "deviceFingerprint": "fp_hash",
  "ipAddress": "x.x.x.x",
  "geo": { "lat": 12.97, "lng": 77.59 },
  "timestamp": "2026-03-29T18:25:43Z"
}
```

Response:
```json
{
  "riskScore": 0.91,
  "riskLevel": "HIGH",
  "decision": "flag",
  "reasons": ["velocity_anomaly", "new_beneficiary", "device_mismatch"],
  "modelVersion": "v2.4.1",
  "inferenceMs": 37
}
```

### GET /api/v1/ml/metrics
Purpose: Model diagnostics for ML Model page.

Response:
```json
{
  "modelVersion": "v2.4.1",
  "status": "live",
  "accuracy": 0.993,
  "precision": 0.988,
  "recall": 0.979,
  "f1": 0.983,
  "driftScore": 0.08,
  "lastRetrainAt": "2026-03-28T09:10:00Z"
}
```

### POST /api/v1/ml/retrain
Purpose: Trigger retrain job (admin only).

### GET /api/v1/ml/retrain/:jobId
Purpose: Retrain job status.

## 8) Settings and Configuration

### GET /api/v1/settings
Purpose: Fetch dashboard settings.

Response:
```json
{
  "fraudThreshold": 65,
  "webhooksEnabled": true,
  "notificationChannels": ["email", "slack"],
  "autoBlockHighRisk": false
}
```

### PATCH /api/v1/settings
Purpose: Update settings from Settings page.

Request:
```json
{
  "fraudThreshold": 70,
  "webhooksEnabled": true,
  "autoBlockHighRisk": true
}
```

## 9) Chatbot Assistant

### POST /api/v1/chatbot/query
Purpose: Dashboard assistant answers using current fraud data + ML context.

Request:
```json
{
  "message": "Show high-risk transactions in last 2 hours",
  "context": {
    "page": "overview",
    "userId": "u_123"
  }
}
```

Response:
```json
{
  "reply": "There are 5 high-risk transactions in the last 2 hours.",
  "data": {
    "transactionIds": ["TXN-9182", "TXN-9178", "TXN-9166"]
  }
}
```

## 10) Optional Realtime Stream (Recommended)

### GET /api/v1/stream/events (SSE) or WS /ws/events
Purpose: Push live transactions, alerts, and model-status updates.

Event types:
- `transaction.created`
- `transaction.risk_scored`
- `alert.created`
- `alert.updated`
- `model.status_changed`

## 11) Common Error Contract

All endpoints should return:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "fraudThreshold must be between 0 and 100",
    "details": {}
  }
}
```

Suggested status codes:
- `200` success
- `201` created
- `400` validation error
- `401` unauthenticated
- `403` unauthorized
- `404` not found
- `409` conflict
- `422` business rule failure
- `500` server error

## 12) Minimum Endpoints to Start Integration Fast

If implementing in phases, start with these first:

1. `GET /api/v1/dashboard/overview`
2. `GET /api/v1/transactions`
3. `GET /api/v1/alerts`
4. `GET /api/v1/analytics/fraud-trend`
5. `GET /api/v1/analytics/weekly-volume`
6. `GET /api/v1/analytics/risk-distribution`
7. `GET /api/v1/ml/metrics`
8. `PATCH /api/v1/settings`
9. `POST /api/v1/auth/logout`
10. `POST /api/v1/chatbot/query`

