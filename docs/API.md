# UPX Global — API Reference

Base URL: `http://localhost:5000/api` (dev) | `https://api.upxglobal.com/api` (prod)

All protected routes require `Authorization: Bearer <accessToken>` header.

---

## Auth

### POST `/auth/login`
Admin login.

**Body:**
```json
{ "email": "admin@upxglobal.com", "password": "Admin@123456" }
```

**Response 200:**
```json
{
  "success": true,
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "admin": { "id": "ADM-...", "email": "...", "name": "Super Admin", "role": "admin" }
}
```

### POST `/auth/refresh`
Get a new access token using refresh token.

**Body:** `{ "refreshToken": "eyJ..." }`

### POST `/auth/logout`
Revoke refresh token. Requires auth.

### GET `/auth/me`
Get current admin profile. Requires auth.

### POST `/auth/seed`
Seed the first admin account. Fails if admin already exists.

---

## Courses (Public)

### GET `/courses`
List all active courses.

**Response 200:**
```json
{
  "success": true,
  "count": 5,
  "courses": [{ "id": "CRS-...", "title": "...", "price": 19999, ... }]
}
```

### GET `/courses/:id`
Get single course by ID.

---

## Enrollments

### POST `/enrollments`
Create enrollment + Razorpay order.  
`Content-Type: multipart/form-data`

**Fields:** `courseId`, `fullName`, `email`, `phone`, `collegeName`, `degree`, `graduationYear`, `city`, `resume` (optional file)

**Response 201:**
```json
{
  "success": true,
  "enrollmentId": "UPX-20240620-ABC123",
  "razorpayOrderId": "order_xyz",
  "razorpayKeyId": "rzp_test_...",
  "amount": 1999900,
  "currency": "INR"
}
```

### POST `/enrollments/verify-payment`
Verify Razorpay payment signature and confirm enrollment.

**Body:**
```json
{
  "razorpayOrderId": "order_xyz",
  "razorpayPaymentId": "pay_abc",
  "razorpaySignature": "sig_...",
  "enrollmentId": "UPX-20240620-ABC123"
}
```

### GET `/enrollments/:id`
Get enrollment status by ID.

### POST `/enrollments/:id/retry`
Create a new Razorpay order for a failed enrollment.

---

## Webhooks

### POST `/webhooks/razorpay`
Razorpay webhook handler.  
Requires `X-Razorpay-Signature` header.  
Body must be raw JSON (not parsed by body-parser).

**Handled events:** `payment.captured`, `payment.failed`, `refund.created`

---

## Admin API (all require `Authorization: Bearer <token>` + admin role)

### Dashboard

`GET /admin/dashboard` — Stats overview

### Students

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/students` | List students (page, limit, search) |
| GET | `/admin/students/:id` | Get student by ID |

### Enrollments

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/enrollments` | List (page, limit, status) |
| GET | `/admin/enrollments/:id` | Get single |

### Courses (Admin CRUD)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/courses` | List all (page, limit, status) |
| POST | `/admin/courses` | Create course |
| PUT | `/admin/courses/:id` | Update course |
| DELETE | `/admin/courses/:id` | Delete course |

**Create/Update Body:**
```json
{
  "title": "Full Stack Development",
  "description": "...",
  "duration": "6 months",
  "price": 19999,
  "instructor": "John Doe",
  "skillsCovered": ["React", "Node.js", "Firebase"],
  "learningOutcomes": ["Build full-stack apps", "Deploy to cloud"],
  "status": "active",
  "level": "beginner",
  "category": "Web Development"
}
```

### Payments

`GET /admin/payments` — List payments (page, limit, status)

### Email Logs

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/email-logs` | List (page, limit, status) |
| POST | `/admin/email-logs/:logId/retry` | Retry failed email |

### Audit Logs

`GET /admin/audit-logs` — List audit trail (page, limit)

---

## Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [
    { "field": "email", "message": "Email is required" }
  ]
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Unauthenticated |
| 403 | Unauthorized (forbidden) |
| 404 | Not found |
| 409 | Conflict (duplicate) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
