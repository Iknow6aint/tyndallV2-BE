# Tyndall API

NestJS + MongoDB backend for the Tyndall AIoT Platform.

This first slice implements:

- JWT dashboard authentication.
- Mongo-backed users.
- Branch listing, creation, lookup, and update.
- FE-compatible branch response contracts.

## Setup

```bash
cp .env.example .env
npm install
npm run start:dev
```

The API listens on `http://localhost:3001` by default, matching `tyndall-v2`.

## Environment

| Key | Purpose |
| --- | --- |
| `PORT` | HTTP port, default `3001` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | Token TTL, default `1d` |
| `FRONTEND_ORIGIN` | CORS origin for the Next app |
| `SEED_HQ_ADMIN_EMAIL` | Optional HQ account email created at startup |
| `SEED_HQ_ADMIN_PASSWORD` | Optional HQ account password created at startup |
| `SEED_HQ_ADMIN_NAME` | Optional HQ account display name |

## Implemented Endpoints

### Auth

```http
POST /auth/login
```

Body:

```json
{
  "email": "admin@tyndallcarbonstandards.com",
  "password": "change-me"
}
```

Response:

```json
{
  "token": "jwt",
  "user": {
    "id": "mongo-user-id",
    "name": "Tyndall HQ Admin",
    "email": "admin@tyndallcarbonstandards.com",
    "role": "hq_admin",
    "branchId": null
  }
}
```

```http
POST /auth/logout
Authorization: Bearer <token>
```

Returns `{ "ok": true }`. JWT invalidation can be made stateful later if needed.

### Branches

```http
GET /branches
Authorization: Bearer <hq-token>
```

```http
POST /branches
Authorization: Bearer <hq-token>
```

Body:

```json
{
  "name": "Kampala Central",
  "region": "East Africa",
  "admin": "Sarah Namutebi",
  "adminEmail": "sarah.namutebi@tyndall.io"
}
```

Response shape matches the FE contract:

```json
{
  "id": "kampala-central",
  "name": "Kampala Central",
  "region": "East Africa",
  "admin": "Sarah Namutebi",
  "adminEmail": "sarah.namutebi@tyndall.io",
  "created": "2026-06-16T10:00:00.000Z"
}
```

```http
GET /branches/:id
Authorization: Bearer <token>
```

HQ users can read any branch. Branch users can read only their own branch.

```http
PATCH /branches/:id
Authorization: Bearer <hq-token>
```

Accepts any subset of `name`, `region`, `admin`, `adminEmail`.

## Notes For The Next Backend Slice

- `POST /branches` creates the branch and a pending branch-admin user record.
- Password/invite acceptance is not implemented yet; pending users cannot log in.
- Device, reading, API-key, and IoT ingestion modules should reuse the branch slug as `branchId` to match the FE.
