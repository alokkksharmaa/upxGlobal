# UPX Global — System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                        │
│                                                                  │
│  React 18  │  Redux Toolkit  │  Tailwind CSS  │  React Router   │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS REST API
┌──────────────────────────────▼──────────────────────────────────┐
│                      BACKEND (Node.js + Express)                 │
│                                                                  │
│  Routes  →  Middleware  →  Controllers  →  Services  →  Models  │
│                                                                  │
│  Middleware Stack:                                               │
│  Helmet │ CORS │ Rate Limit │ Body Parser │ Sanitise │ XSS     │
└────────┬──────────────────────────────────────────┬─────────────┘
         │                                          │
┌────────▼──────────┐                  ┌────────────▼────────────┐
│  Firebase Admin   │                  │   Razorpay Gateway      │
│  ─────────────    │                  │   ────────────────       │
│  Firestore (DB)   │                  │   Create Orders         │
│  Firebase Auth    │                  │   Verify Signatures     │
│  Firebase Storage │                  │   Webhook Events        │
└───────────────────┘                  └─────────────────────────┘
                                                   │
                               ┌────────────────────▼────────────┐
                               │   Nodemailer / SendGrid          │
                               │   ─────────────────────          │
                               │   Enrollment Confirmation        │
                               │   Admin Notifications            │
                               │   Payment Failed Alerts          │
                               └──────────────────────────────────┘
```

---

## Database Schema (Firestore Collections)

### `students`
```
{
  id:             string   // STU-{ts}-{rand}
  name:           string
  email:          string   // indexed, unique
  phone:          string
  collegeName:    string
  degree:         string
  graduationYear: number
  city:           string
  resumeUrl:      string | null
  createdAt:      ISO string
  updatedAt:      ISO string
}
```

### `courses`
```
{
  id:               string   // CRS-{ts}-{rand}
  title:            string
  description:      string
  duration:         string
  price:            number
  instructor:       string
  skillsCovered:    string[]
  learningOutcomes: string[]
  status:           "active" | "inactive" | "draft"
  level:            "beginner" | "intermediate" | "advanced"
  category:         string
  thumbnailUrl:     string
  enrollmentCount:  number
  createdAt:        ISO string
  updatedAt:        ISO string
}
```

### `enrollments`
```
{
  id:              string   // = enrollmentId (UPX-{date}-{rand})
  enrollmentId:    string   // human-readable: UPX-20240620-ABC123
  studentId:       string   // → students.id
  courseId:        string   // → courses.id
  paymentStatus:   "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED"
  razorpayOrderId: string
  razorpayPaymentId: string | null
  enrolledAt:      ISO string
  updatedAt:       ISO string
  // denormalized for queries:
  studentName:     string
  studentEmail:    string
  courseTitle:     string
  amount:          number
}
```

### `payments`
```
{
  id:              string   // PAY-{ts}-{rand}
  enrollmentId:    string   // → enrollments.enrollmentId
  razorpayOrderId: string
  transactionId:   string | null   // razorpay payment id
  gatewayProvider: "razorpay"
  amount:          number
  currency:        "INR"
  status:          "CREATED" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED"
  paymentDate:     ISO string | null
  createdAt:       ISO string
  updatedAt:       ISO string
  metadata:        object
}
```

### `emailLogs`
```
{
  id:           string   // EML-{ts}-{rand}
  recipient:    string
  emailType:    "ENROLLMENT_CONFIRMATION" | "ADMIN_NOTIFICATION" | "PAYMENT_FAILED" | ...
  subject:      string
  status:       "PENDING" | "SENT" | "FAILED"
  errorMessage: string | null
  sentAt:       ISO string | null
  retryCount:   number
  createdAt:    ISO string
  metadata:     object
}
```

### `admins`
```
{
  id:           string   // ADM-{ts}-{rand}
  name:         string
  email:        string
  passwordHash: string   // bcrypt (rounds: 12)
  role:         "admin"
  isActive:     boolean
  lastLoginAt:  ISO string
  createdAt:    ISO string
}
```

### `auditLogs`
```
{
  id:          string   // AUD-{ts}-{rand}
  action:      string   // COURSE_CREATED, ADMIN_LOGIN, etc.
  performedBy: string   // admin id
  targetId:    string | null
  metadata:    object
  timestamp:   ISO string
  ip:          string | null
}
```

### `refreshTokens`
```
{
  adminId:   string
  tokenHash: string   // bcrypt hash of refresh token
  createdAt: ISO string
  expiresAt: ISO string
}
```

---

## ER Diagram (Logical)

```
students ──────< enrollments >────── courses
                     │
                  payments
                     
emailLogs (standalone audit trail for emails)
auditLogs (standalone audit trail for admin actions)
admins    (separate from students)
```

---

## Payment Workflow

```
Student Clicks Enroll
        │
        ▼
POST /api/enrollments
  ├─ Validate form data
  ├─ Upload resume → Firebase Storage
  ├─ Upsert Student record
  ├─ Create Razorpay Order (server-side)
  ├─ Create Enrollment (status: PENDING)
  ├─ Create Payment (status: CREATED)
  └─ Return { orderId, keyId, amount }
        │
        ▼
Razorpay Checkout (client-side)
  ├─ User completes payment
  └─ Razorpay returns { orderId, paymentId, signature }
        │
        ▼
POST /api/enrollments/verify-payment
  ├─ Verify HMAC-SHA256 signature ← PREVENTS FAKE CONFIRMATIONS
  ├─ Update Enrollment → PAID
  ├─ Update Payment → CAPTURED
  ├─ Increment course.enrollmentCount
  ├─ Send confirmation email (async)
  ├─ Send admin notification (async)
  └─ Return success
        │
        ▼
POST /api/webhooks/razorpay (parallel)
  ├─ payment.captured → same PAID flow (handles missed callbacks)
  ├─ payment.failed   → mark FAILED + send failure email
  └─ Always return 200 to prevent retries
```

---

## Email Workflow

```
Payment Verified
      │
      ├──── sendEnrollmentConfirmation(student, course, enrollment, payment)
      │         └─ HTML email → student.email
      │         └─ Log to emailLogs collection
      │
      └──── sendAdminNotification(student, course, enrollment, payment)
                └─ HTML email → ADMIN_EMAIL env variable
                └─ Log to emailLogs collection

Payment Failed
      │
      └──── sendPaymentFailedEmail(student, course, enrollment)
                └─ HTML email with retry link → student.email

Retry Failed Emails
      └─ Admin Panel → POST /admin/email-logs/:logId/retry
```

---

## Security Architecture

| Layer | Mechanism |
|-------|-----------|
| Transport | HTTPS (TLS 1.2+) |
| Auth | JWT (RS256, 15m exp) + Refresh tokens |
| Password | bcrypt (rounds: 12) |
| CORS | Whitelist by `CLIENT_URL` env |
| Rate Limiting | express-rate-limit (per-route) |
| Input Validation | Joi schemas |
| XSS Prevention | xss-clean middleware |
| NoSQL Injection | express-mongo-sanitize |
| HTTP Headers | Helmet.js |
| Payment Integrity | Razorpay HMAC-SHA256 signature verification |
| Webhook Auth | `X-Razorpay-Signature` header verification |
| File Upload | MIME type + size validation, stored in Firebase Storage |
| Audit Trail | All admin actions logged with IP + timestamp |
| Secrets | Environment variables only, never in code |

---

## Scalability Design

| Concern | Solution |
|---------|----------|
| Horizontal scaling | Stateless Express (no sessions) |
| Database | Firebase Firestore (auto-scales) |
| File storage | Firebase Storage (CDN-backed) |
| Email queue | EmailLog collection + retry mechanism (upgrade to Bull/Redis) |
| Payment webhooks | Idempotent handlers (check status before updating) |
| Caching | Courses list (add Redis/Firestore cache) |
| Background jobs | Currently inline; upgrade to Cloud Tasks / BullMQ |
| Frontend | Code-split lazy loading, CDN via Firebase Hosting |
| API rate limiting | Per-IP express-rate-limit (upgrade to Redis-backed) |

---

## Folder Structure

```
upxGlobal/
├── client/                        # React Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── common/            # LoadingSpinner, Modal
│       │   ├── layout/            # Navbar, Footer
│       │   ├── landing/           # Hero, About, WhyChooseUs, etc.
│       │   ├── courses/           # CourseCard
│       │   └── enrollment/        # EnrollmentForm
│       ├── pages/
│       │   ├── public/            # HomePage, CoursesPage, etc.
│       │   └── admin/             # Dashboard, Students, etc.
│       ├── store/
│       │   └── slices/            # authSlice, coursesSlice, adminSlice
│       ├── services/              # api.js (axios instance)
│       ├── hooks/
│       └── utils/
│
├── server/
│   ├── config/                    # firebase.js, logger.js, constants.js
│   ├── controllers/               # authController, courseController, etc.
│   ├── middleware/                # auth.js, errorHandler.js, rateLimiter.js, validator.js
│   ├── models/                    # Student, Course, Enrollment, Payment, EmailLog
│   ├── routes/                    # auth, courses, enrollments, payments, admin, webhooks
│   ├── services/                  # emailService, paymentService, auditService
│   ├── utils/                     # generateId.js
│   ├── webhooks/                  # razorpay.js
│   ├── logs/                      # winston log files
│   └── app.js
│
└── docs/
    ├── API.md
    └── ARCHITECTURE.md
```
