# Tyndall API

NestJS + MongoDB backend for the Tyndall AIoT Platform.

This first slice implements:

- JWT dashboard authentication.
- Mongo-backed users.
- Branch listing, creation, lookup, and update.
- FE-compatible branch response contracts.
- Hardware-facing IoT register and preset endpoints from the device documentation.

## Setup

```bash
cp .env.example .env
npm install
npm run start:dev
```

The API listens on `http://localhost:3001` by default, matching `tyndall-v2`.

Swagger/OpenAPI docs are available at `http://localhost:3001/docs`.

## Environment

| Key | Purpose |
| --- | --- |
| `PORT` | HTTP port, default `3001` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | Token TTL, default `1d` |
| `FRONTEND_ORIGIN` | CORS origin for the Next app |
| `SWAGGER_PATH` | Swagger UI route, default `docs` |
| `SEED_HQ_ADMIN_EMAIL` | Optional HQ account email created at startup |
| `SEED_HQ_ADMIN_PASSWORD` | Optional HQ account password created at startup |
| `SEED_HQ_ADMIN_NAME` | Optional HQ account display name |
| `SEED_BRANCH_ID` | Optional seeded branch slug for branch-admin login |
| `SEED_BRANCH_NAME` | Optional seeded branch display name |
| `SEED_BRANCH_REGION` | Optional seeded branch region |
| `SEED_BRANCH_ADMIN_EMAIL` | Optional seeded branch-admin email |
| `SEED_BRANCH_ADMIN_PASSWORD` | Optional seeded branch-admin password |
| `SEED_BRANCH_ADMIN_NAME` | Optional seeded branch-admin display name |
| `IOT_DEFAULT_API_KEY` | Default device API key returned as `authorization` |
| `IOT_TEMP_PRESET` | Temperature preset returned by `/api/getPreset` |

## Local Auth Accounts

The example environment seeds two active dashboard users for wiring the frontend:

| Role | Email | Password | Landing route |
| --- | --- | --- | --- |
| HQ Super Admin | `admin@tyndallcarbonstandards.com` | `change-me` | `/overview` |
| Branch Admin | `sarah.namutebi@tyndall.io` | `change-me` | `/kampala/overview` |

## Implemented Endpoints

### IoT Device Protocol

These endpoints match the hardware documentation field names.

```http
POST /api/registerDevice
```

Body:

```json
{
  "imei": "861234567890123"
}
```

Response:

```json
{
  "status": true,
  "message": "Device registered successfully.",
  "data": {
    "authorization": "TYNKD-d91cc5cdb576610b337e5b41569ba411",
    "imei": "861234567890123",
    "deviceUID": "V1-1234567890-24080001"
  }
}
```

```http
GET /api/getPreset?type=temp&imei=861234567890123&deviceUID=V1-1234567890-24080001
x-api-key: TYNKD-d91cc5cdb576610b337e5b41569ba411
```

Response:

```json
{
  "status": true,
  "message": "Temp preset retrieved.",
  "data": {
    "preset": "30"
  }
}
```

The uploaded document’s `III. Upload data` section is blank, so the telemetry upload endpoint is intentionally not implemented yet.

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
