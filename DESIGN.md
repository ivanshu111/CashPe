# CashPe — System Design Document

## 1. Overview

CashPe is a full-stack digital wallet application enabling peer-to-peer money transfers, expense tracking, budgeting, and real-time notifications. It follows a **three-tier architecture** (Presentation → Application → Data) deployed as four containerized services orchestrated via Docker Compose.

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENTS                            │
│              (Browser / Mobile Web)                      │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
         ┌───────────────▼───────────────┐
         │     Frontend (React SPA)       │
         │   Vercel / Nginx Container     │
         └───────────────┬───────────────┘
                         │ REST API + WebSocket
         ┌───────────────▼───────────────┐
         │    Backend (Express.js API)    │
         │    Render / Docker Container   │
         └───┬───────────┬───────────┬───┘
             │           │           │
    ┌────────▼──┐  ┌─────▼────┐  ┌──▼────────┐
    │  MongoDB  │  │  Redis   │  │  Socket.IO │
    │  (Atlas)  │  │ (Upstash)│  │  + Redis   │
    └───────────┘  └──────────┘  │  Adapter   │
                                 └────────────┘
```

---

## 3. Technology Stack

| Layer            | Technology                                  | Purpose                                   |
|------------------|---------------------------------------------|-------------------------------------------|
| Frontend         | React 19, Vite 7, Tailwind CSS 3, DaisyUI  | SPA, styling, component library           |
| State Mgmt       | Redux Toolkit                               | Centralized client-side state             |
| Routing          | React Router DOM 7                          | Client-side navigation                    |
| HTTP Client      | Axios (with interceptors)                   | API communication, auto token injection   |
| Real-Time        | Socket.IO 4 (client)                       | Live notifications                        |
| Backend          | Node.js 20+, Express 4                     | REST API server                           |
| Auth             | JWT + Bcrypt                                | Stateless auth, credential hashing        |
| Validation       | express-validator                           | Server-side input validation              |
| File Upload      | Multer 2                                    | Profile picture uploads                   |
| API Docs         | Swagger / OpenAPI 3.0 (swagger-jsdoc)      | Interactive API documentation             |
| Database         | MongoDB 7 (Mongoose 9 ODM)                 | Document storage                          |
| Cache / Pub-Sub  | Redis 7 (ioredis)                          | Notification channel, Socket.IO adapter   |
| Real-Time Infra  | Socket.IO + @socket.io/redis-adapter       | Multi-instance WebSocket broadcast        |
| Security         | Helmet, CORS, express-rate-limit            | HTTP hardening, CORS, rate limiting       |
| Containerization | Docker, Docker Compose                      | Local multi-service orchestration         |
| Deployment       | Vercel (FE), Render (BE), MongoDB Atlas,   | Production hosting                        |
|                  | Upstash Redis                               |                                           |

---

## 4. Data Model

### 4.1 Entity Relationship Diagram

```
┌──────────┐       1:1       ┌──────────┐
│   User   │◄───────────────►│  Wallet  │
│          │                 │          │
│ name     │                 │ balance  │
│ email    │                 │ user(ref)│
│ password │                 └────┬─────┘
│ phone    │                      │
│ role     │                 1:N  │
│ status   │                      │
│ pin      │                 ┌────▼─────┐
│ profile  │                 │Transaction│
│ Picture  │                 │          │
└──────────┘                 │ type     │
     │                       │ amount   │
     │ 1:N                   │ fromUser │
     │                       │ toUser   │
     ├──►┌──────────┐        │ status   │
     │   │ Category │        └──────────┘
     │   │          │
     │   │ name     │
     │   │ userId   │
     │   └────┬─────┘
     │        │ 1:N
     │   ┌────▼─────┐    1:1    ┌─────────┐
     ├──►│ Expense  │◄─────────►│ Budget  │
     │   │          │  (by      │         │
     │   │ amount   │  month)   │ amount  │
     │   │ date     │           │ month   │
     │   │ month    │           │ year    │
     │   │ year     │           │ userId  │
     │   └──────────┘           └─────────┘
     │
     └──►┌───────────────┐
         │ Notification  │
         │               │
         │ message       │
         │ read          │
         │ userId        │
         └───────────────┘
```

### 4.2 Schema Details

#### User (`src/models/User.js`)
| Field            | Type     | Constraints                          |
|------------------|----------|--------------------------------------|
| name             | String   | required, 3–50 chars                 |
| email            | String   | required, unique, regex-validated    |
| password         | String   | required, min 6 chars, bcrypt-hashed |
| phone            | String   | required, unique, exactly 10 digits  |
| role             | String   | enum: `user`, `admin`; default `user`|
| status           | String   | enum: `active`, `inactive`           |
| pin              | String   | optional, bcrypt-hashed              |
| profilePicture   | String   | default placeholder URL              |
| timestamps       | auto     | createdAt, updatedAt                 |

#### Wallet (`src/models/Wallet.js`)
| Field  | Type   | Constraints              |
|--------|--------|--------------------------|
| user   | ObjectId | ref: User, required, unique |
| balance| Number | required, default 0      |

#### Transaction (`src/models/Transaction.js`)
| Field    | Type     | Constraints                          |
|----------|----------|--------------------------------------|
| wallet   | ObjectId | ref: Wallet, required                |
| type     | String   | enum: `credit`, `debit`             |
| amount   | Number   | required                             |
| fromUser | ObjectId | ref: User, indexed                   |
| toUser   | ObjectId | ref: User, indexed                   |
| status   | String   | enum: `pending`, `completed`, `failed` |

#### Expense (`src/models/Expense.js`)
| Field      | Type     | Constraints              |
|------------|----------|--------------------------|
| userId     | ObjectId | ref: User, required      |
| categoryId | ObjectId | ref: Category, required  |
| amount     | Number   | required, min 0.01       |
| description| String   | optional, trimmed        |
| date       | Date     | required                 |
| month      | Number   | auto-extracted (1–12)    |
| year       | Number   | auto-extracted           |

#### Budget (`src/models/Budget.js`)
| Field  | Type     | Constraints                              |
|--------|----------|------------------------------------------|
| userId | ObjectId | ref: User, required                      |
| amount | Number   | required, min 0                          |
| month  | Number   | required, 1–12                           |
| year   | Number   | required                                 |
|        |          | Unique compound index: (userId, month, year) |

#### Category (`src/models/Category.js`)
| Field  | Type     | Constraints                              |
|--------|----------|------------------------------------------|
| name   | String   | required, trimmed                        |
| userId | ObjectId | ref: User, optional (global categories)  |
|        |          | Compound unique index: (name, userId)    |

---

## 5. Backend Architecture

### 5.1 Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection (Mongoose)
│   │   └── swagger.js         # Swagger/OpenAPI spec generation
│   ├── controllers/           # Business logic (8 controllers)
│   │   ├── authController.js
│   │   ├── walletController.js
│   │   ├── userController.js
│   │   ├── adminController.js
│   │   ├── expenseController.js
│   │   ├── budgetController.js
│   │   ├── categoryController.js
│   │   ├── notificationController.js
│   │   └── reportController.js
│   ├── middlewares/
│   │   ├── auth.js            # JWT verification, attaches req.user
│   │   ├── adminAuth.js       # Role check (admin only)
│   │   ├── verifyPin.js       # PIN verification for sensitive ops
│   │   └── upload.js          # Multer config for profile pictures
│   ├── models/                # Mongoose schemas (6 models)
│   ├── routes/                # Express router definitions (9 route files)
│   ├── service/
│   │   ├── redisManager.js    # Redis pub/sub for notifications
│   │   └── socketManager.js   # Socket.IO server + Redis adapter
│   ├── utils/
│   │   ├── jwt.js             # Token generation & verification
│   │   └── hash.js            # Bcrypt password/PIN hashing
│   └── app.js                 # Entry point, middleware chain, server bootstrap
├── public/uploads/            # Uploaded profile pictures
├── seed.js                    # Admin user seeder
└── Dockerfile
```

### 5.2 Middleware Pipeline

```
Request
  │
  ▼
┌──────────────┐
│ Rate Limiter │  100 req / 15 min per IP
└──────┬───────┘
       ▼
┌──────────────┐
│   Helmet     │  Security HTTP headers
└──────┬───────┘
       ▼
┌──────────────┐
│    CORS      │  Origin whitelist
└──────┬───────┘
       ▼
┌──────────────┐
│ express.json │  Body parsing
└──────┬───────┘
       ▼
┌──────────────┐
│   Routes     │  /api/*
└──────┬───────┘
       ▼
┌──────────────┐
│   auth.js    │  JWT verify (protected routes)
└──────┬───────┘
       ▼
┌──────────────┐
│  adminAuth   │  Role check (admin routes)
└──────┬───────┘
       ▼
┌──────────────┐
│  verifyPin   │  PIN check (wallet operations)
└──────┬───────┘
       ▼
  Controller
```

### 5.3 API Route Map

| Route Group     | Base Path        | Methods                        | Auth     |
|-----------------|------------------|--------------------------------|----------|
| Auth            | `/api/auth`      | POST register/login, PATCH profile, GET history | Mixed    |
| Wallet          | `/api/wallet`    | GET details, POST add-money, send-money | Auth+PIN |
| Users           | `/api/users`     | GET find, DELETE account       | Auth     |
| Admin           | `/api/admin`     | GET users/transactions, PUT status, GET details | Admin    |
| Notifications   | `/api/notifications` | GET (user notifications)  | Auth     |
| Expenses        | `/api/expenses`  | GET/POST/PUT/DELETE CRUD      | Auth     |
| Budgets         | `/api/budget`    | GET/POST/PUT (monthly)        | Auth     |
| Categories      | `/api/categories`| GET/POST/PUT/DELETE CRUD      | Auth     |
| Reports         | `/api/reports`   | GET monthly/yearly summaries   | Auth     |

### 5.4 Real-Time Notification Flow

```
Controller Action (e.g., send-money succeeds)
         │
         ▼
publishNotification()  ────►  Redis PUBLISHER
                                     │
                              Redis Channel: "notifications"
                                     │
                              Redis SUBSCRIBER (app.js)
                                     │
                                     ▼
                         emitNotificationToUser()
                                     │
                              Socket.IO Server
                                     │
                         io.to(userId).emit("new_notification")
                                     │
                                     ▼
                              Browser Client
                         socketService.js listener
                                     │
                                     ▼
                         Redux notificationSlice update
                                     │
                                     ▼
                              React Hot Toast
```

**Why Redis?**
- Decouples notification producers from consumers
- Enables horizontal scaling: multiple backend instances share one notification bus
- Socket.IO Redis adapter ensures WebSocket messages reach users connected to any instance

---

## 6. Frontend Architecture

### 6.1 Directory Structure

```
frontend/CashPe/src/
├── components/            # Reusable UI
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── HeroComponent.jsx
│   ├── Features.jsx
│   ├── Testimonials.jsx
│   ├── NotificationBell.jsx
│   ├── NotificationsList.jsx
│   ├── ProtectedRoute.jsx
│   ├── DeleteConfirmationModal.jsx
│   └── UserWalletSummary.jsx
├── pages/                 # Route-level views
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── ProfilePage.jsx
│   ├── EditProfilePage.jsx
│   ├── AddMoneyPage.jsx
│   ├── SendMoneyPage.jsx
│   ├── ExpenseTrackerHomePage.jsx
│   ├── ReportPage.jsx
│   ├── AdminPage.jsx
│   ├── UserTransactionsPage.jsx
│   └── AboutPage.jsx
├── services/
│   ├── api.js             # Axios instance + all API functions
│   └── socketService.js   # Socket.IO client wrapper
├── slice/                 # Redux Toolkit slices
│   ├── authSlice.js
│   ├── walletSlice.js
│   ├── expenseSlice.js
│   ├── budgetSlice.js
│   ├── categorySlice.js
│   └── notificationSlice.js
├── store/
│   └── index.js           # Redux store configuration
├── constants/
│   └── routes.js
├── routers/
│   └── routes.jsx         # React Router configuration
├── utils/
│   ├── dateUtils.js
│   └── imageUtils.js
├── App.jsx                # Root component (layout + socket init)
└── main.jsx               # Entry point
```

### 6.2 State Management (Redux Toolkit)

```
┌─────────────────────────────────────────────┐
│                Redux Store                   │
├─────────────┬───────────────────────────────┤
│ authSlice   │ user, token, isAuthenticated  │
├─────────────┼───────────────────────────────┤
│ expenseSlice│ expenses[], loading, error    │
├─────────────┼───────────────────────────────┤
│ budgetSlice │ budget, loading, error        │
├─────────────┼───────────────────────────────┤
│ categorySlice│ categories[], loading, error │
├─────────────┼───────────────────────────────┤
│ notification│ items[], loading              │
│ Slice       │                               │
└─────────────┴───────────────────────────────┘
```

### 6.3 Route Structure

| Path                                    | Component               | Access         |
|-----------------------------------------|-------------------------|----------------|
| `/`                                     | HomePage                | Public         |
| `/register`                             | RegisterPage            | Public         |
| `/login`                                | LoginPage               | Public         |
| `/about`                                | AboutPage               | Public         |
| `/dashboard`                            | DashboardPage           | Protected      |
| `/add-money`                            | AddMoneyPage            | Protected      |
| `/send-money`                           | SendMoneyPage           | Protected      |
| `/profile`                              | ProfilePage             | Protected      |
| `/profile/edit`                         | EditProfilePage         | Protected      |
| `/admin`                                | AdminPage               | Protected      |
| `/admin/users/:userId/transactions`     | UserTransactionsPage    | Protected      |
| `/expense-tracker-home`                 | ExpenseTrackerHomePage  | Protected      |
| `/reports`                              | ReportPage              | Protected      |

### 6.4 Authentication Flow

```
Login Form
    │
    ▼
api.post("/auth/login")
    │
    ▼
Backend: validate credentials → generate JWT
    │
    ▼
Response: { user, token }
    │
    ▼
Redux: authSlice stores token + user
    │
    ▼
Axios interceptor attaches Authorization: Bearer <token>
to every subsequent request
    │
    ▼
401 Response → authSlice.logout() → redirect to /
```

---

## 7. Security Design

| Mechanism              | Implementation                                      |
|------------------------|-----------------------------------------------------|
| **Password Hashing**   | Bcrypt (salt rounds: default) for passwords & PINs  |
| **JWT Authentication** | Stateless tokens; verified via `auth` middleware     |
| **PIN Verification**   | Required for wallet details, send-money (sensitive)  |
| **Rate Limiting**      | 100 requests / 15 min per IP (express-rate-limit)   |
| **HTTP Headers**       | Helmet sets X-Content-Type-Options, HSTS, etc.      |
| **CORS**               | Configurable allowed origins via env var            |
| **Input Validation**   | express-validator on all routes                     |
| **Role-Based Access**  | `auth` middleware → `adminAuth` middleware chain      |
| **Account Deletion**   | Blocked unless wallet balance = 0                   |
| **Session Expiry**     | Frontend auto-logout on 401 responses               |

---

## 8. Deployment Architecture

### 8.1 Docker Compose (Local)

```
┌─────────────────────────────────────────────────┐
│                 docker-compose                   │
├────────────┬────────────┬──────────┬────────────┤
│  mongo:7   │ redis:7    │ backend  │ frontend   │
│  :27017    │ :6379      │ :3000    │ :80        │
│            │            │          │            │
│  volume:   │  volume:   │ volume:  │            │
│  mongo_data│  redis_data│ uploads  │            │
└────────────┴────────────┴──────────┴────────────┘
```

### 8.2 Production (Cloud)

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Vercel (Frontend)  ──────►  Render (Backend API)    │
│  - Static SPA                - Express server        │
│  - Edge CDN                  - Socket.IO server      │
│  - Auto-deploy from Git      - Auto-deploy from Git  │
│                              │                       │
│                    ┌─────────┴─────────┐             │
│                    │                   │             │
│              MongoDB Atlas       Upstash Redis       │
│              - Managed cluster   - Serverless        │
│              - Auto-backup       - Pub/Sub           │
│                                  - Socket adapter    │
└──────────────────────────────────────────────────────┘
```

### 8.3 Environment Variables

| Variable        | Service  | Purpose                          |
|-----------------|----------|----------------------------------|
| PORT            | Backend  | Server listen port               |
| MONGODB_URI     | Backend  | MongoDB connection string        |
| REDIS_URI       | Backend  | Redis connection string          |
| JWT_SECRET      | Backend  | JWT signing secret               |
| FRONTEND_URL    | Backend  | CORS allowed origin(s)           |
| VITE_API_URL    | Frontend | Backend API base URL for Vite    |

---

## 9. Error Handling Strategy

```
┌─────────────────────────────────────┐
│          Client Layer               │
│  Axios interceptor catches 401     │
│  → auto-logout + redirect          │
│  → React Hot Toast for UX feedback │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Backend Layer                │
│  express-validator → 400            │
│  auth middleware   → 401            │
│  adminAuth         → 403            │
│  Business logic    → 400/404/409    │
│  Unhandled         → 500 catch-all │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Database Layer              │
│  Mongoose validation → 400          │
│  Duplicate key       → 409          │
│  Connection failure  → 500          │
└─────────────────────────────────────┘
```

---

## 10. Expense Tracker Module — Detailed Design

### 10.1 Data Flow

```
User sets monthly budget  ──► Budget (userId, month, year, amount)
                                      │
User logs an expense     ──► Expense (userId, categoryId, amount, date)
                                      │
                           ┌──────────▼──────────┐
                           │   Report Generation  │
                           │  - Sum expenses      │
                           │    by month/year      │
                           │  - Compare vs budget  │
                           │  - Category breakdown │
                           └──────────┬──────────┘
                                      │
                           ┌──────────▼──────────┐
                           │  Budget Overrun?     │
                           │  → Notification via  │
                           │    Redis + Socket.IO │
                           └─────────────────────┘
```

### 10.2 Report Endpoints

| Endpoint                          | Query                     | Response               |
|-----------------------------------|---------------------------|------------------------|
| `GET /api/reports/monthly/:y/:m` | Expense list, total, category breakdown | JSON report    |
| `GET /api/reports/yearly/:year`  | Monthly aggregated totals | JSON report            |

---

## 11. Scalability Considerations

| Aspect             | Current Approach                        | Future Enhancement               |
|--------------------|------------------------------------------|----------------------------------|
| **Horizontal**     | Redis adapter enables multi-instance WS  | Load balancer (nginx/HAProxy)    |
| **Database**       | MongoDB Atlas (auto-scaling)             | Read replicas, sharding          |
| **Caching**        | Redis for pub/sub                        | Cache frequently read data       |
| **Frontend**       | Vercel edge network (CDN)                | Service workers, offline support |
| **API Rate Limit** | Per-IP global limiter                    | Per-user + per-endpoint limits   |
| **File Storage**   | Local `public/uploads`                   | S3/Cloudinary for profile pics   |

---

## 12. Key Design Decisions

| Decision                          | Rationale                                                |
|-----------------------------------|----------------------------------------------------------|
| **Redux Toolkit** over Context   | Predictable state, devtools, scalable slice pattern      |
| **Mongoose ODM**                  | Schema validation, hooks (pre-save), query builder       |
| **Redis pub/sub** for notifications | Decouples producers/consumers, enables multi-instance  |
| **Socket.IO** over raw WS        | Auto-reconnection, room-based targeting, Redis adapter   |
| **JWT** over session cookies      | Stateless, mobile-friendly, scales horizontally          |
| **PIN** as second factor          | Lightweight 2FA for financial operations without SMS cost|
| **Swagger** auto-generated docs   | Always accurate, interactive testing at `/api-docs`      |
| **Docker Compose** locally         | Consistent dev environment, 4-command setup              |
| **Vercel + Render**               | Zero-config deployments, auto-scaling, free tiers        |

---

## 13. Future Enhancements (Recommended)

| Feature                      | Description                                                    |
|------------------------------|----------------------------------------------------------------|
| **Savings Goals (Vaults)**  | Separate pots with target amounts and dates                    |
| **QR Code Payments**        | Generate/scan QR codes for instant P2P transfers               |
| **Recurring Payments**      | Scheduled automatic transfers and subscription management      |
| **Enhanced Dashboards**     | Visual charts, spending trends, month-over-month comparisons   |
| **Bill Payment Integration**| Pay real-world bills directly from the wallet                  |
| **Mock Investment Module**  | Simulated stock/crypto portfolio with live price feeds          |
| **Multi-Language (i18n)**  | Internationalization for broader user base                     |
| **Dark Mode**               | Theme toggle using Tailwind CSS dark mode classes              |

---

*Document generated for CashPe v1.0 — Author: Ivanshu Pratap Singh*
