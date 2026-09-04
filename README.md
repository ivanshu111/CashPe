# CashPe - Digital Wallet Application

A fullstack digital wallet application that allows users to manage money, track expenses, set budgets, and send/receive payments in real-time.

## Live Demo

- **Frontend:** [https://cash-pe.vercel.app](https://cash-pe.vercel.app)
- **Backend API:** [https://cashpe-backend.onrender.com](https://cashpe-backend.onrender.com)
- **API Docs:** [https://cashpe-backend.onrender.com/api-docs](https://cashpe-backend.onrender.com/api-docs)

---

## Features

### User Features
- Secure registration & login with JWT authentication
- Profile management (name, email, password, phone, PIN, profile picture)
- Digital wallet (view balance, add money, send money to other users)
- Transaction history with credit/debit tracking
- PIN-based security for sensitive operations
- Account deletion (only when balance is zero)
- Real-time notifications via WebSockets

### Expense Tracker
- CRUD operations for expense categories
- Monthly budget setting and tracking
- Expense logging with category, amount, description, and date
- Expense filtering by category and date range
- Monthly and yearly expense reports with category breakdown
- Budget overrun notifications

### Admin Features
- View all users and their details
- Search users by name or email
- Activate/deactivate user accounts
- View all system transactions
- View per-user transaction history with sorting

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Redux Toolkit, React Router DOM, Tailwind CSS, DaisyUI |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB (Atlas) |
| **Cache / Pub-Sub** | Redis |
| **Real-Time** | Socket.IO with Redis adapter |
| **Auth** | JWT, Bcrypt |
| **API Docs** | Swagger / OpenAPI 3.0 |
| **Build Tool** | Vite 7 |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## Project Structure

```
CashPe/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Swagger config
│   │   ├── controllers/     # Route handlers
│   │   ├── middlewares/      # Auth, admin auth, file upload
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── service/         # Socket.IO & Redis managers
│   │   ├── utils/           # JWT & password hashing
│   │   └── app.js           # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   └── CashPe/
│       ├── src/
│       │   ├── components/  # Reusable UI components
│       │   ├── pages/       # Page components
│       │   ├── services/    # API calls & socket service
│       │   ├── slice/       # Redux Toolkit slices
│       │   ├── store/       # Redux store config
│       │   ├── utils/       # Utility functions
│       │   └── routers/     # Route definitions
│       ├── Dockerfile
│       └── package.json
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Redis (local or Upstash)

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/your-username/CashPe.git
cd CashPe
```

**2. Backend setup**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cashPe
REDIS_URI=redis://127.0.0.1:6379
JWT_SECRET=your-strong-random-secret
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```

**3. Frontend setup**
```bash
cd frontend/CashPe
npm install
npm run dev
```

**4. Access the app**

Open [http://localhost:5173](http://localhost:5173) in your browser.

**5. Seed admin user (optional)**
```bash
cd backend
node seed.js
```

### Docker Setup

```bash
docker-compose up --build -d
```

This starts all 4 services (MongoDB, Redis, Backend, Frontend) and the app is accessible at [http://localhost](http://localhost).

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Login with email & password | Public |
| PATCH | `/profile` | Update user profile | Authenticated |
| GET | `/history` | Get transaction history | Authenticated |

### Wallet (`/api/wallet`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/details` | Get wallet details | Auth + PIN |
| POST | `/add-money` | Add money to wallet (max 50,000) | Authenticated |
| POST | `/send-money` | Send money to another user (max 1,00,000) | Auth + PIN |

### Users (`/api/users`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/find` | Search users by email/phone | Authenticated |
| DELETE | `/` | Delete account (balance must be 0) | Authenticated |

### Notifications (`/api/notifications`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get user notifications | Authenticated |
| GET | `/:userId` | Get notifications for a user | Authenticated |

### Admin (`/api/admin`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users | Admin |
| GET | `/transactions` | Get all transactions | Admin |
| PUT | `/users/:userId/status` | Activate/deactivate user | Admin |
| GET | `/users/:userId/details` | Get user details with transactions | Admin |

### Expense Tracker (`/api/expenses`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get expenses (with filters) | Authenticated |
| POST | `/` | Add a new expense | Authenticated |
| PUT | `/:id` | Update an expense | Authenticated |
| DELETE | `/:id` | Delete an expense | Authenticated |

### Budget (`/api/budget`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/:year/:month` | Get budget for a month | Authenticated |
| POST | `/` | Set monthly budget | Authenticated |
| PUT | `/:id` | Update budget | Authenticated |

### Categories (`/api/categories`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all categories | Authenticated |
| POST | `/` | Create a category | Authenticated |
| PUT | `/:id` | Update a category | Authenticated |
| DELETE | `/:id` | Delete a category | Authenticated |

### Reports (`/api/reports`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/monthly/:year/:month` | Monthly expense summary | Authenticated |
| GET | `/yearly/:year` | Yearly expense summary | Authenticated |

---

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import repo on [Vercel](https://vercel.com)
3. Set root directory to `frontend/CashPe`
4. Add environment variable: `VITE_API_URL` = your Render backend URL
5. Deploy

### Backend (Render)
1. Create a Web Service on [Render](https://render.com)
2. Set root directory to `backend`
3. Build command: `npm install`
4. Start command: `node src/app.js`
5. Add environment variables:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `REDIS_URI` = your Upstash Redis URL
   - `JWT_SECRET` = a strong random string
   - `FRONTEND_URL` = your Vercel frontend URL
6. Deploy and seed admin user

---

## Security

- **Rate Limiting:** 100 requests per 15 minutes per IP
- **Helmet:** Sets secure HTTP headers
- **CORS:** Configurable allowed origins
- **JWT:** Stateless token-based authentication
- **Bcrypt:** Password and PIN hashing
- **PIN Verification:** Required for sensitive wallet operations
- **Input Validation:** Server-side validation with express-validator

---

## License

This project is proprietary. All rights reserved. Unauthorized use, reproduction, or distribution of this code is prohibited without explicit permission from the author.

For inquiries, contact: **Ivanshu Pratap Singh**
