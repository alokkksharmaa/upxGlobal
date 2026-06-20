# UPX Global — EdTech Student Enrollment Platform

> Production-ready EdTech platform for student course enrollment, payment processing, and automated confirmations.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS 3, Redux Toolkit, React Router v6 |
| Backend | Node.js 20, Express.js 5 |
| Database | Firebase Firestore (NoSQL) |
| Auth | Firebase Auth + JWT (Admin) |
| Storage | Firebase Storage (Resume uploads) |
| Payment | Razorpay Payment Gateway |
| Email | Nodemailer + Gmail SMTP / SendGrid |
| Hosting | Firebase Hosting (Frontend) + Cloud Run / Railway (Backend) |

---

## Project Structure

```
upxGlobal/
├── client/                        # React Frontend
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/            # Reusable UI components
│       │   ├── layout/            # Navbar, Footer
│       │   ├── landing/           # Home page sections
│       │   ├── courses/           # Course card, list
│       │   ├── enrollment/        # Enrollment form
│       │   └── admin/             # Admin sidebar, stats
│       ├── pages/
│       │   ├── public/            # Public-facing pages
│       │   └── admin/             # Admin dashboard pages
│       ├── store/                 # Redux Toolkit store
│       │   └── slices/
│       ├── services/              # Axios API layer
│       ├── hooks/                 # Custom React hooks
│       └── utils/                 # Validators, helpers
│
├── server/                        # Node.js Backend
│   ├── config/                    # Firebase, constants
│   ├── controllers/               # Route handlers
│   ├── middleware/                # Auth, rate-limit, validator
│   ├── models/                    # Firestore data models
│   ├── routes/                    # Express routers
│   ├── services/                  # Business logic layer
│   ├── utils/                     # ID generators, helpers
│   └── webhooks/                  # Payment webhook handlers
│
└── docs/                          # Architecture diagrams & API docs
```

---

## Quick Start

### Prerequisites
- Node.js >= 20
- Firebase project with Firestore + Auth + Storage enabled
- Razorpay account (test keys)
- Gmail account or SendGrid API key

### 1. Clone & Install

```bash
# Backend
cd server
npm install
cp .env.example .env   # fill in your credentials

# Frontend
cd ../client
npm install
cp .env.example .env
```

### 2. Configure Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore, Authentication (Email/Password), and Storage
3. Generate a Service Account key → paste into `server/.env`
4. Copy the web config → paste into `client/.env`

### 3. Configure Razorpay

1. Sign up at https://razorpay.com
2. Get Key ID + Key Secret from Dashboard → API Keys
3. Add to `server/.env`

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm start
```

Backend runs on `http://localhost:5000`  
Frontend runs on `http://localhost:3000`

---

## API Overview

| Module | Base Route |
|--------|-----------|
| Auth | `/api/auth` |
| Courses | `/api/courses` |
| Enrollments | `/api/enrollments` |
| Payments | `/api/payments` |
| Admin | `/api/admin` |
| Webhooks | `/api/webhooks` |

Full API documentation: [`docs/API.md`](docs/API.md)

---

## Security Features

- JWT access tokens (15 min) + Refresh tokens (7 days)
- Role-Based Access Control (student / admin)
- Helmet.js HTTP headers
- CORS with whitelist
- Rate limiting (express-rate-limit)
- Input validation (Joi)
- CSRF tokens for state-mutating requests
- bcryptjs password hashing (rounds: 12)
- Razorpay webhook signature verification
- Firebase Security Rules for Firestore & Storage
- Audit log for all admin actions

---

## License

MIT — UPX Global EdTech Platform
