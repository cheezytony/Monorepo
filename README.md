# Monorepo

A full-stack monorepo application built with **NestJS** (backend), **Nuxt 3** (frontend), and a **shared TypeScript package**, managed with **pnpm workspaces**.

---

## Project Structure

```
monorepo/
├── apps/
│   ├── backend/          # NestJS API server
│   └── frontend/         # Nuxt 3 web application
└── packages/
    └── shared/           # Shared TypeScript types & constants
```

---

## ✅ What Has Been Done

### Monorepo Infrastructure

- [x] pnpm workspaces configured (`pnpm-workspace.yaml`)
- [x] Root-level scripts for dev, build, lint, and format
- [x] ESLint (with TypeScript + Vue support) across all packages
- [x] Prettier formatting with `.prettierrc`
- [x] Husky pre-commit hooks with lint-staged
- [x] `.env.example` documenting all required environment variables

### Shared Package (`packages/shared`)

- [x] Shared TypeScript type definitions: `UserProfile`, `AuthResponse`, `LoginPayload`, `RegisterPayload`, `ApiResponse`, `PaginatedResponse`, `PaginationMeta`
- [x] Platform & content types: `PlatformType`, `AuthType`, `PlatformConnection`, `CreatePlatformConnectionPayload`, `ContentStatus`, `ContentItem`, `CreateContentPayload`, `UpdateContentPayload`, `PublishContentPayload`
- [x] Shared constants: `DEFAULT_PAGE_SIZE`, `MAX_PAGE_SIZE`, `HTTP_STATUS`
- [x] Exported as `@monorepo/shared` workspace package

### Backend (`apps/backend` — NestJS)

- [x] NestJS project scaffolded with TypeScript
- [x] PostgreSQL integration via TypeORM (`TypeOrmModule.forRootAsync`)
- [x] `User` entity with UUID primary key, email (unique), name, hashed password, timestamps
- [x] `UsersService`: `findByEmail`, `findById`, `create`
- [x] `AuthModule` with JWT authentication (passport-jwt)
- [x] `POST /auth/register` — register with name, email, password (bcrypt hashed)
- [x] `POST /auth/login` — login with email/password, returns JWT token
- [x] `GET /auth/me` — protected endpoint returning the authenticated user
- [x] `GET /health` — health check endpoint
- [x] `LoginDto` and `RegisterDto` with class-validator decorators
- [x] Unit tests for `AppController` and `AuthService`
- [x] `PlatformConnectionsModule` — users can add/remove connections to YouTube, Instagram, TikTok, and X using either an API key or OAuth token; credentials stored securely (never returned), only a masked version is exposed
- [x] `ContentModule` — full CRUD for content items + `POST /content/:id/publish` endpoint that publishes to chosen platform connections

### Frontend (`apps/frontend` — Nuxt 3)

- [x] Nuxt 3 project with TypeScript strict mode
- [x] Runtime config for `apiBase` URL (env-configurable)
- [x] Default layout with authenticated nav (Dashboard, New Post, Platforms links)
- [x] Home page (`/`) with `HeroSection` and `FeaturesSection` components
- [x] Login page (`/auth/login`) with form validation and error handling
- [x] Register page (`/auth/register`) with form validation and error handling
- [x] `useAuth` composable: `register`, `login`, `logout`, `token` (cookie), `user` (state), `isAuthenticated`
- [x] `/dashboard` page — lists all content with status badges and publish/delete actions
- [x] `/platforms` page — list connected platforms, add new connection (API key or OAuth), remove connections
- [x] `/content/create` page — create a new draft content item
- [x] `/content/[id]/publish` page — preview content, select from configured platform connections, publish
- [x] `usePlatforms` composable — fetch, add, remove platform connections
- [x] `useContent` composable — fetch, fetchOne, create, update, delete, publish content

---

## 🔲 What Is Left To Do

### Backend

- [ ] **Email service** — Mailgun credentials are in `.env.example` but the integration is not implemented (e.g. welcome email on registration, password reset emails)
- [ ] **Cloudinary integration** — credentials in `.env.example` but file upload service not implemented
- [ ] **Password reset flow** — forgot-password and reset-password endpoints
- [ ] **Email verification** — verify email address on registration
- [ ] **Refresh tokens** — JWT refresh token endpoint and rotation logic
- [ ] **Rate limiting** — protect auth endpoints against brute-force attacks
- [ ] **Global exception filter** — consistent error response shaping
- [ ] **Real platform API calls** — `ContentService.publish` currently marks content as published without calling platform APIs; integrate each platform's SDK/API
- [ ] **More unit/e2e tests** — `AuthController`, `UsersService`, `PlatformConnectionsController`, `ContentController`, and end-to-end API tests

### Frontend

- [ ] **User profile page** — view and edit the logged-in user's profile
- [ ] **About page** — the "Get Started" button on the home page links to `/about`, which does not exist yet
- [ ] **Auth middleware / route guards** — redirect unauthenticated users away from protected pages
- [ ] **Content edit page** — `/content/[id]/edit` to update existing drafts
- [ ] **Frontend tests** — unit/component tests for composables and pages

### Infrastructure

- [ ] **Docker / docker-compose** — containerise the backend and a PostgreSQL instance for local development
- [ ] **CI/CD pipeline** — GitHub Actions workflow for lint, test, and build on pull requests
- [ ] **Production deployment configuration** — environment-specific settings and secrets management

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- PostgreSQL

### Setup

```bash
# Install dependencies
pnpm install

# Copy and fill in environment variables
cp .env.example apps/backend/.env

# Start development servers
pnpm dev:backend   # NestJS API on http://localhost:3000
pnpm dev:frontend  # Nuxt app on http://localhost:3001
```

### Linting & Formatting

```bash
pnpm lint          # Lint all packages
pnpm lint:fix      # Auto-fix lint issues
pnpm format        # Format all files with Prettier
pnpm format:check  # Check formatting without writing
```

### Testing (Backend)

```bash
pnpm --filter backend test
pnpm --filter backend test:cov
```
