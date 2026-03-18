# VendoX — Your Local Market, Reimagined

> "Everything nearby, in one place."

VendoX is a hybrid social-commerce marketplace platform for discovering stores, products, services, and offers by location. It supports store discovery via map, a social post feed, a product/service marketplace, and a unique "Khasni" request broadcast system where users can ask for items and nearby stores respond.

---

## Table of Contents

1. [Project Architecture](#1-project-architecture)
2. [Folder Structure](#2-folder-structure)
3. [Tech Stack](#3-tech-stack)
4. [Database Schema Overview](#4-database-schema-overview)
5. [API Route Plan](#5-api-route-plan)
6. [Authentication Flow](#6-authentication-flow)
7. [Setup Instructions](#7-setup-instructions)
8. [Environment Variables](#8-environment-variables)
9. [Seed Data](#9-seed-data)
10. [Deployment Instructions](#10-deployment-instructions)
11. [Future Improvements](#11-future-improvements)

---

## 1. Project Architecture

```
vendox/
├── frontend/          # Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui
├── backend/           # NestJS + TypeScript + Prisma + PostgreSQL
├── prisma/            # Shared Prisma schema (can be inside backend too)
└── docs/              # Architecture diagrams and API docs
```

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│   Next.js App Router (Vercel)                                   │
│   ├── Public Pages (Landing, Login, Register)                   │
│   ├── Protected Pages (Feed, Map, Khasni, Profile, etc.)        │
│   └── Admin Dashboard                                           │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTPS / REST API
┌─────────────────────▼───────────────────────────────────────────┐
│                       API LAYER                                  │
│   NestJS (Railway / Render)                                      │
│   ├── Auth Module (JWT, OAuth, Refresh Tokens)                   │
│   ├── Users Module                                               │
│   ├── Stores Module                                              │
│   ├── Posts / Feed Module                                        │
│   ├── Products / Services Modules                                │
│   ├── Khasni (Request/Response) Module                          │
│   ├── Notifications Module                                       │
│   ├── Map Module                                                 │
│   ├── Admin Module                                               │
│   └── Reports / Moderation Module                               │
└─────────────────────┬───────────────────────────────────────────┘
                      │ Prisma ORM
┌─────────────────────▼───────────────────────────────────────────┐
│                    DATA LAYER                                     │
│   PostgreSQL (Supabase / Railway)                                │
│   ├── Users & Sessions                                           │
│   ├── Stores & Categories                                        │
│   ├── Posts & Media                                              │
│   ├── Products & Services                                        │
│   ├── Khasni Requests & Responses                               │
│   ├── Social (Likes, Saves, Follows, Comments)                  │
│   ├── Notifications                                              │
│   └── Reviews & Reports                                         │
└─────────────────────────────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                  EXTERNAL SERVICES                               │
│   ├── Cloudinary (Image uploads / CDN)                          │
│   ├── Mapbox / Leaflet (Map rendering)                          │
│   ├── Google OAuth                                               │
│   └── SMTP (Nodemailer / SendGrid for emails)                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Folder Structure

### Frontend (Next.js)

```
frontend/
├── public/
│   ├── logo.svg
│   ├── icons/
│   └── images/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout with providers
│   │   ├── page.tsx                      # Landing / Welcome page
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── (main)/
│   │   │   ├── layout.tsx                # Main app layout with nav bar
│   │   │   ├── feed/page.tsx             # Home feed
│   │   │   ├── map/page.tsx              # Map discovery
│   │   │   ├── khasni/
│   │   │   │   ├── page.tsx              # Khasni requests list
│   │   │   │   └── create/page.tsx       # Create Khasni request
│   │   │   ├── trending/page.tsx         # Trending posts
│   │   │   ├── search/page.tsx           # Global search
│   │   │   ├── notifications/page.tsx    # Notifications
│   │   │   ├── profile/
│   │   │   │   ├── page.tsx              # My profile
│   │   │   │   └── edit/page.tsx         # Edit profile
│   │   │   ├── store/
│   │   │   │   └── [id]/page.tsx         # Store profile
│   │   │   ├── post/
│   │   │   │   ├── create/page.tsx       # Create post
│   │   │   │   └── [id]/page.tsx         # Post detail
│   │   │   ├── product/
│   │   │   │   └── create/page.tsx       # Create product
│   │   │   ├── service/
│   │   │   │   └── create/page.tsx       # Create service
│   │   │   └── settings/page.tsx         # App settings / menu
│   │   └── (admin)/
│   │       ├── layout.tsx
│   │       └── dashboard/page.tsx        # Admin dashboard
│   ├── components/
│   │   ├── ui/                           # shadcn/ui re-exports
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── AppLayout.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── SocialAuthButtons.tsx
│   │   │   └── AuthGuard.tsx
│   │   ├── feed/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostCardSkeleton.tsx
│   │   │   ├── PostCarousel.tsx
│   │   │   ├── PostActions.tsx
│   │   │   ├── CommentDrawer.tsx
│   │   │   └── FeedFilter.tsx
│   │   ├── store/
│   │   │   ├── StoreCard.tsx
│   │   │   ├── StoreHeader.tsx
│   │   │   ├── StoreProfileTabs.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── ServiceCard.tsx
│   │   ├── map/
│   │   │   ├── MapView.tsx
│   │   │   ├── StoreMarker.tsx
│   │   │   ├── StorePreviewSheet.tsx
│   │   │   └── MapFilters.tsx
│   │   ├── khasni/
│   │   │   ├── KhasniCard.tsx
│   │   │   ├── KhasniForm.tsx
│   │   │   └── KhasniResponseCard.tsx
│   │   └── shared/
│   │       ├── Avatar.tsx
│   │       ├── VerifiedBadge.tsx
│   │       ├── CategoryBadge.tsx
│   │       ├── EmptyState.tsx
│   │       ├── LoadingSkeleton.tsx
│   │       ├── ImageUpload.tsx
│   │       └── SearchBar.tsx
│   ├── lib/
│   │   ├── api.ts                        # Axios instance + interceptors
│   │   ├── auth.ts                       # Auth helpers
│   │   ├── utils.ts                      # cn(), formatters
│   │   └── validations.ts               # Shared Zod schemas
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFeed.ts
│   │   ├── useStore.ts
│   │   ├── useMap.ts
│   │   ├── useKhasni.ts
│   │   ├── useNotifications.ts
│   │   └── useInfiniteScroll.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── store.types.ts
│   │   ├── post.types.ts
│   │   ├── product.types.ts
│   │   ├── khasni.types.ts
│   │   └── api.types.ts
│   └── store/
│       ├── authStore.ts                  # Zustand auth store
│       └── uiStore.ts                    # UI state store
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Backend (NestJS)

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── jwt-refresh.strategy.ts
│   │   │   └── google.strategy.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       ├── register.dto.ts
│   │       └── refresh-token.dto.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   ├── stores/
│   │   ├── stores.module.ts
│   │   ├── stores.controller.ts
│   │   ├── stores.service.ts
│   │   └── dto/
│   ├── posts/
│   │   ├── posts.module.ts
│   │   ├── posts.controller.ts
│   │   ├── posts.service.ts
│   │   └── dto/
│   ├── products/
│   ├── services/
│   ├── comments/
│   ├── likes/
│   ├── saves/
│   ├── follows/
│   ├── notifications/
│   ├── map/
│   ├── khasni/
│   ├── reports/
│   ├── admin/
│   ├── upload/
│   └── common/
│       ├── guards/
│       │   ├── jwt-auth.guard.ts
│       │   ├── roles.guard.ts
│       │   └── optional-auth.guard.ts
│       ├── interceptors/
│       │   ├── transform.interceptor.ts
│       │   └── logging.interceptor.ts
│       ├── decorators/
│       │   ├── roles.decorator.ts
│       │   ├── current-user.decorator.ts
│       │   └── public.decorator.ts
│       ├── filters/
│       │   └── http-exception.filter.ts
│       └── pipes/
│           └── parse-pagination.pipe.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env.example
├── tsconfig.json
└── package.json
```

---

## 3. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 14 (App Router) |
| Frontend Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State Management | Zustand + TanStack Query |
| Forms | React Hook Form + Zod |
| Backend Framework | NestJS |
| Backend Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + Refresh Tokens + Google OAuth |
| File Storage | Cloudinary |
| Maps | Leaflet (react-leaflet) |
| Email | Nodemailer / SendGrid |
| Frontend Deployment | Vercel |
| Backend Deployment | Railway or Render |

---

## 4. Database Schema Overview

See `prisma/schema.prisma` for the full schema.

### Key Models

- **User** — registered users with roles (USER, STORE_OWNER, ADMIN)
- **Store** — business profiles with location, category, hours
- **StoreCategory** — categories like Food, Fashion, Electronics, etc.
- **Post** — store social posts with images and captions
- **PostImage** — multiple images per post
- **Product** — items listed by stores
- **Service** — services offered by stores
- **Comment** — comments on posts
- **Like** — polymorphic likes (post / product)
- **SavedPost** — user saved posts
- **Follow** — user → store follows
- **Notification** — in-app notifications
- **KhasniRequest** — user product/service requests
- **KhasniResponse** — store responses to Khasni requests
- **Report** — user reports on content
- **Location** — geolocation for stores
- **Review** — user reviews of stores
- **RefreshToken** — JWT refresh token storage

---

## 5. API Route Plan

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/google
GET    /api/auth/google/callback
GET    /api/auth/me
```

### Users
```
GET    /api/users/profile
PATCH  /api/users/profile
PATCH  /api/users/change-password
DELETE /api/users/account
GET    /api/users/:id
GET    /api/users/saved-posts
GET    /api/users/liked-posts
GET    /api/users/followed-stores
```

### Stores
```
POST   /api/stores
GET    /api/stores
GET    /api/stores/:id
PATCH  /api/stores/:id
DELETE /api/stores/:id
GET    /api/stores/:id/posts
GET    /api/stores/:id/products
GET    /api/stores/:id/services
GET    /api/stores/:id/followers
GET    /api/stores/my/store
```

### Posts
```
POST   /api/posts
GET    /api/posts/feed
GET    /api/posts/trending
GET    /api/posts/:id
PATCH  /api/posts/:id
DELETE /api/posts/:id
```

### Products
```
POST   /api/products
GET    /api/products
GET    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id
```

### Services
```
POST   /api/services
GET    /api/services
GET    /api/services/:id
PATCH  /api/services/:id
DELETE /api/services/:id
```

### Comments
```
POST   /api/posts/:id/comments
GET    /api/posts/:id/comments
DELETE /api/comments/:id
```

### Likes
```
POST   /api/likes
DELETE /api/likes/:targetId
GET    /api/likes/:targetId/count
```

### Saves
```
POST   /api/saves/:postId
DELETE /api/saves/:postId
GET    /api/saves
```

### Follows
```
POST   /api/follows/:storeId
DELETE /api/follows/:storeId
GET    /api/follows/my-follows
```

### Notifications
```
GET    /api/notifications
PATCH  /api/notifications/read-all
PATCH  /api/notifications/:id/read
DELETE /api/notifications/:id
GET    /api/notifications/unread-count
```

### Map
```
GET    /api/map/stores?lat=&lng=&radius=&category=
GET    /api/map/stores/nearby
```

### Khasni
```
POST   /api/khasni/requests
GET    /api/khasni/requests
GET    /api/khasni/requests/:id
PATCH  /api/khasni/requests/:id
DELETE /api/khasni/requests/:id
POST   /api/khasni/requests/:id/respond
GET    /api/khasni/requests/:id/responses
PATCH  /api/khasni/requests/:id/close
```

### Reports
```
POST   /api/reports
GET    /api/reports (admin)
PATCH  /api/reports/:id/resolve (admin)
```

### Admin
```
GET    /api/admin/stats
GET    /api/admin/users
PATCH  /api/admin/users/:id/ban
GET    /api/admin/stores
PATCH  /api/admin/stores/:id/verify
GET    /api/admin/reports
GET    /api/admin/categories
POST   /api/admin/categories
PATCH  /api/admin/categories/:id
DELETE /api/admin/categories/:id
```

### Upload
```
POST   /api/upload/image
POST   /api/upload/images
```

### Search
```
GET    /api/search?q=&type=stores|products|services|posts
```

---

## 6. Authentication Flow

### Registration
1. User submits email + password + name
2. Backend validates with Zod DTO
3. Password hashed with bcrypt (12 rounds)
4. User created in DB
5. Access token (15min) + Refresh token (7d) issued
6. Refresh token stored in DB (hashed)
7. Tokens returned to client

### Login
1. User submits email + password
2. Backend validates credentials
3. Tokens issued and refresh token updated in DB
4. Tokens returned to client
5. Frontend stores in httpOnly cookie or memory

### Token Refresh
1. Client sends expired access token or calls /refresh
2. Backend validates refresh token from DB
3. New access token issued
4. Optionally rotate refresh token

### Google OAuth
1. User clicks "Continue with Google"
2. Redirect to Google OAuth consent screen
3. Google redirects back with code
4. Backend exchanges code for user profile
5. Upsert user in DB
6. Issue VendoX JWT tokens
7. Redirect to frontend with tokens

### Password Reset
1. User submits email to /forgot-password
2. Backend generates 6-digit OTP or reset token
3. Email sent with reset link
4. User submits new password + token
5. Token validated and password updated

---

## 7. Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- pnpm (recommended)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/vendox.git
cd vendox

# Install backend dependencies
cd backend && pnpm install

# Install frontend dependencies
cd ../frontend && pnpm install
```

### 2. Database Setup

```bash
# Create database
createdb vendox_dev

# Backend: Copy env and configure
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run migrations
pnpm prisma migrate dev --name init

# Seed the database
pnpm prisma db seed
```

### 3. Start Development Servers

```bash
# Terminal 1 — Backend (port 3001)
cd backend
pnpm run start:dev

# Terminal 2 — Frontend (port 3000)
cd frontend
pnpm run dev
```

### 4. Access the App
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Prisma Studio: `cd backend && pnpm prisma studio`

---

## 8. Environment Variables

See `.env.example` files in both `frontend/` and `backend/`.

---

## 9. Seed Data

Run `cd backend && pnpm prisma db seed` to populate:

- 5 store categories
- 1 admin user
- 10 regular users
- 5 store owners with store profiles
- 20 posts with images
- 15 products
- 10 services
- 8 Khasni requests
- Sample follows, likes, saves, notifications

---

## 10. Deployment Instructions

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

cd frontend
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
# NEXT_PUBLIC_MAPBOX_TOKEN=...
# NEXTAUTH_SECRET=...
```

### Backend (Railway)

1. Create new Railway project
2. Add PostgreSQL service
3. Deploy backend from GitHub
4. Set environment variables from `.env.example`
5. Run `prisma migrate deploy` via Railway CLI or deploy hook

### Database (Railway PostgreSQL)

Railway auto-provisions PostgreSQL. Copy `DATABASE_URL` from Railway dashboard.

---

## 11. Future Improvements

### Short-term
- [ ] Real-time notifications via WebSockets (Socket.io)
- [ ] Push notifications (FCM)
- [ ] In-app messaging between users and stores
- [ ] Store analytics dashboard
- [ ] Multi-language support (Arabic, French, English)

### Medium-term
- [ ] Stripe/payment integration for promoted posts
- [ ] VendoX Premium store verification tiers
- [ ] Product booking/reservation system
- [ ] Story/reels-style ephemeral posts
- [ ] Advanced search with Elasticsearch
- [ ] AI-powered product recommendations

### Long-term
- [ ] React Native mobile app
- [ ] Delivery tracking integration
- [ ] Virtual store tours
- [ ] Loyalty/points system
- [ ] B2B wholesale features
- [ ] Multi-city expansion tools
