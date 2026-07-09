# WeatherGuard Admin

A production-ready admin dashboard for weather alert management with OAuth authentication, user approval workflows, and automated weather monitoring via Telegram.

## Architecture

The system consists of two main components:

- **Backend API** (NestJS): RESTful API with OAuth2 authentication, MongoDB persistence, scheduled weather monitoring, and Telegram notifications
- **Admin Dashboard** (React): Real-time admin interface for user management, approval workflows, and weather alert monitoring

```
┌─────────────────────────────────────────────────────────────┐
│                      Admin Dashboard                         │
│                    (React + Tailwind)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Login → OAuth → JWT Token → Protected Pages         │  │
│  │ • User Management (Approve/Reject)                  │  │
│  │ • Statistics Dashboard                              │  │
│  │ • Weather Alerts Monitoring                         │  │
│  │ • Audit Log Viewer                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTP/REST
                               ↓
┌──────────────────────────────────────────────────────────────┐
│                  WeatherGuard API (NestJS)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ • Auth Module (Google/GitHub OAuth)                 │   │
│  │ • Users Module (CRUD + Approval Workflow)           │   │
│  │ • Telegram Module (Bot Integration)                 │   │
│  │ • Weather Module (6h Scheduler + Alerts)            │   │
│  │ • Audit Module (Activity Logging)                   │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────┬───────────────────────────────┘
                               │ MongoDB
                               ↓
                    ┌──────────────────┐
                    │  MongoDB (Local) │
                    │  • Users         │
                    │  • WeatherAlerts │
                    │  • AuditLogs     │
                    └──────────────────┘
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  avatar: String,
  provider: 'google' | 'github',
  providerId: String (unique),
  role: 'user' | 'admin',
  status: 'pending' | 'approved' | 'rejected',
  telegramChatId: String,
  telegramUsername: String,
  location: {
    city: String,
    lat: Number,
    lon: Number
  },
  requestedAt: Date,
  approvedAt: Date,
  approvedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### WeatherAlerts Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: 'rain' | 'storm' | 'heat' | 'cold' | 'wind',
  message: String,
  weatherData: {
    temp: Number,
    condition: String,
    humidity: Number,
    windSpeed: Number
  },
  sentAt: Date,
  status: 'sent' | 'failed',
  createdAt: Date,
  updatedAt: Date
}
```

### AuditLogs Collection
```javascript
{
  _id: ObjectId,
  action: 'USER_APPROVED' | 'USER_REJECTED' | 'ALERT_SENT',
  performedBy: ObjectId (ref: User),
  targetUser: ObjectId (ref: User),
  metadata: Object,
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Data Flow: Approval → Telegram → Weather Alerts

1. **User Signup**: New user OAuth → DB → Status: `pending` → Dashboard notification
2. **Admin Approval**: Admin clicks "Approve" → `PATCH /users/:id/approve` → User status: `approved` → AuditLog entry
3. **Telegram Notification**: `approveUser()` triggers → `TelegramService.sendApprovalMessage()` → Bot sends welcome to user
4. **User Links Telegram**: User runs `/start` command → Bot sends chat ID → User enters ID in web app → `PATCH /users/:id/telegram`
5. **Weather Monitoring**: Scheduler runs every 6 hours → Queries approved users with location + telegramChatId → Fetches OpenWeather data → Checks alert thresholds → Sends Telegram alert + saves WeatherAlert → AuditLog entry

## Environment Variables

### API (`api/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| PORT | No | API port (default: 3000) |
| MONGODB_URI | Yes | MongoDB connection string |
| JWT_SECRET | Yes | Secret for JWT signing (min 32 chars) |
| JWT_EXPIRES_IN | No | JWT expiration (default: 7d) |
| GOOGLE_CLIENT_ID | Yes | Google OAuth client ID |
| GOOGLE_CLIENT_SECRET | Yes | Google OAuth client secret |
| GITHUB_CLIENT_ID | Yes | GitHub OAuth client ID |
| GITHUB_CLIENT_SECRET | Yes | GitHub OAuth client secret |
| OAUTH_CALLBACK_URL_BASE | Yes | Base URL for OAuth callbacks |
| FRONTEND_URL | Yes | Admin dashboard URL |
| TELEGRAM_BOT_TOKEN | Yes | Telegram bot API token |
| OPENWEATHER_API_KEY | Yes | OpenWeatherMap API key |

### Admin (`admin/.env.local`)
| Variable | Required | Description |
|----------|----------|-------------|
| VITE_API_URL | No | API URL (default: http://localhost:3000) |
| VITE_GOOGLE_CLIENT_ID | No | For future OAuth integration |
| VITE_GITHUB_CLIENT_ID | No | For future OAuth integration |

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Docker Desktop (for MongoDB) — or a local MongoDB install
- A Telegram bot token from [@BotFather](https://t.me/BotFather) (free, takes 30 seconds)
- An OpenWeatherMap API key (free tier, from https://openweathermap.org/api)
- Google OAuth credentials (from Google Cloud Console)
- GitHub OAuth credentials (from GitHub Developer Settings)

> Every value above is **required** at boot because of the Joi validation in `app.module.ts`. If any one is missing, the API will refuse to start and print exactly which variable is missing — that is expected behavior, not a bug.

### Step 1 — Start MongoDB
```bash
cd weatherguard
docker-compose up -d
docker ps
```
You should see `weatherguard-mongodb-1` listed as `Up`. If Docker isn't installed, install MongoDB Community Server locally instead and make sure it's running on port 27017.

### Step 2 — Configure and install the API
```bash
cd api
cp .env.example .env
```
Open `.env` and fill in **real** values — not the placeholders:
- `MONGODB_URI=mongodb://localhost:27017/weatherguard`
- `JWT_SECRET` — any random string, 32+ characters
- `JWT_EXPIRES_IN=7d`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from Google Cloud Console
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — from GitHub OAuth Apps
- `OAUTH_CALLBACK_URL_BASE=http://localhost:3000`
- `FRONTEND_URL=http://localhost:5173`
- `TELEGRAM_BOT_TOKEN` — get this from @BotFather, format is `123456789:AAExampleToken`
- `OPENWEATHER_API_KEY` — from openweathermap.org

Then install and run:
```bash
npm install
npm run dev
```

You should see, in order:
```
[Bootstrap] Starting WeatherGuard API...
[NestFactory] Starting Nest application...
...
[MongoDB] Connecting to MongoDB at mongodb://localhost:27017/weatherguard
[MongoDB] MongoDB connected
[TelegramService] Telegram bot polling started
...
[Bootstrap] API running on http://localhost:3000
```

If it does not reach `API running on http://localhost:3000`, the API now **always prints a reason** instead of dying silently (see Troubleshooting below) — that was the root cause of the original setup failing with no output.

### Step 3 — Create your first admin user
The very first user can only be created via OAuth login (there's no seed script), so:
1. Leave the API running.
2. Skip ahead to Step 4 and log in once via Google or GitHub from the admin app. This creates your user record with `status: pending` and `role: user`.
3. Promote yourself to admin directly in Mongo:
```bash
docker exec -it weatherguard-mongodb-1 mongosh weatherguard
```
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin", status: "approved" } }
)
```
4. Refresh the admin dashboard / log in again to get a fresh JWT with admin role.

### Step 4 — Configure and run the admin dashboard
```bash
cd admin
cp .env.example .env.local
```
Edit `.env.local`:
- `VITE_API_URL=http://localhost:3000`
- `VITE_GOOGLE_CLIENT_ID` — same Google client ID as the API
- `VITE_GITHUB_CLIENT_ID` — same GitHub client ID as the API

```bash
npm install
npm run dev
```
Open http://localhost:5173 and sign in.

### Step 5 — Verify Telegram end-to-end
1. Open your bot in Telegram and send `/start` — it should reply with your Chat ID.
2. In the admin dashboard, link that Chat ID to your user.
3. Approve a pending user from the dashboard (or approve yourself) — you should receive an "approved" message in Telegram immediately, confirming `TelegramService` → `UsersService.approveUser()` is wired correctly.

### Troubleshooting (what actually broke before, and how this version surfaces it)
| Symptom | What's happening now | Fix |
|---|---|---|
| API exits with no error at all | This was the original bug: an invalid `TELEGRAM_BOT_TOKEN` made `node-telegram-bot-api` start polling and throw inside an event the app never listened for. `main.ts` now has global `unhandledRejection`/`uncaughtException` handlers and `TelegramService` catches its own errors, so this can no longer happen silently — any crash now prints a stack trace. | Read the printed error and fix the underlying cause. |
| API hangs forever after "Connecting to MongoDB..." | `MONGODB_URI` points to a database that isn't reachable. | Run `docker ps` to confirm Mongo is up; the API now fails after 8 seconds with `Unable to connect to the database` instead of hanging indefinitely. |
| `Config validation error: "X" is required` | One of the required env vars in `.env` is missing or misspelled. | Copy from `.env.example` again and fill in every field — none are optional. |
| Telegram bot doesn't reply to `/start` | `TELEGRAM_BOT_TOKEN` is still the placeholder, or the bot polling failed. | Check the API logs for `Telegram bot polling started` vs a warning that it's disabled; get a real token from @BotFather. |
| OAuth redirect fails | `OAUTH_CALLBACK_URL_BASE` doesn't match the callback URL registered in the Google/GitHub app settings. | They must match exactly, including `http://localhost:3000`. |

### Production Deployment

#### Railway (API)
1. Create Railway project
2. Add MongoDB plugin
3. Connect GitHub repository
4. Set environment variables
5. Deploy

#### Vercel (Admin Dashboard)
1. Connect GitHub repository to Vercel
2. Set `VITE_API_URL` to production API URL
3. Deploy

## API Endpoints

### Authentication
- `GET /auth/google` - OAuth flow initiation
- `GET /auth/google/callback` - OAuth callback handler
- `GET /auth/github` - GitHub OAuth flow
- `GET /auth/github/callback` - GitHub callback handler
- `GET /auth/me` - Current user (JWT protected)

### Users
- `GET /users` - List all users (admin only, filterable by status)
- `GET /users/stats` - User statistics (admin only)
- `PATCH /users/:id/approve` - Approve pending user (admin only)
- `PATCH /users/:id/reject` - Reject user (admin only)
- `PATCH /users/:id/telegram` - Link Telegram to account (JWT protected)

### Audit
- `GET /audit/logs` - View audit logs (admin only)

## Telegram Bot Commands

- `/start` - Register bot, receive chat ID instructions

## Architecture Decisions

### NestJS
- Enterprise-grade framework with dependency injection
- Built-in validation and exception handling
- Excellent TypeScript support with decorators
- Easy testing and modularity

### MongoDB + Mongoose
- Flexible schema for evolving requirements
- Vertical scaling suitable for MVP
- Rich query capabilities for analytics

### Passport.js Strategies
- Industry standard for OAuth
- Pluggable strategies (Google, GitHub easily extended)
- JWT for stateless authentication

### React + Tailwind
- Minimal dependencies for faster frontend
- Tailwind for rapid UI development without CSS-in-JS overhead
- React Query for efficient server state management

### Telegram Bot API
- Reliable push notifications
- No infrastructure for message queues
- Direct user engagement without email infrastructure

### Scheduled Jobs
- NestJS Schedule for simplicity (not job queue)
- Suitable for MVP with single instance
- No external dependencies (no Bull, no Celery)

## What I'd Improve with More Time

1. **Error Handling & Retry Logic**
   - Exponential backoff for failed Telegram sends
   - Circuit breaker pattern for external API calls
   - Comprehensive error monitoring (Sentry integration)

2. **Performance & Scalability**
   - Redis caching for user stats
   - Message queue (Bull) for weather alert processing
   - GraphQL API for flexible frontend queries
   - Database indexing on frequently queried fields

3. **Testing & Quality**
   - Unit tests for services (>80% coverage)
   - E2E tests for critical flows
   - Load testing for weather scheduler at scale
   - Integration tests for OAuth flows

4. **Security Enhancements**
   - Rate limiting on auth endpoints
   - CSRF protection
   - Helmet.js for security headers
   - API key rotation for external services
   - IP whitelisting for admin panel

5. **Feature Completeness**
   - Weather forecast alerts (not just current)
   - Custom alert thresholds per user
   - Multiple location support
   - Email digest of alerts
   - Admin panel analytics/charts
   - User settings/preferences UI
   - Multi-language support

## Development Guidelines

- All code is production-ready without comments
- TypeScript strict mode enforced throughout
- DTOs with class-validator for all inputs
- Services return fully typed responses
- Functional React components with hooks
- Custom hooks for all API logic
- No component libraries (Tailwind only)
- Clean commit history ready for PR review

## Running Commands

```bash
# Development
npm run dev           # Start dev server with hot reload

# Production
npm run build         # Compile TypeScript
npm start             # Run compiled code

# Type checking
npm run typecheck     # Check TypeScript compilation
```

## Support

For issues or questions, create a GitHub issue or contact the development team.

---

**Status**: Production-ready MVP  
**Last Updated**: 2024  
**Maintainers**: Engineering Team
