# UPX Global — Development Roadmap & Future Scaling

## Phase 1 — MVP (Current Build) ✅

| Feature | Status |
|---------|--------|
| Public landing page (Hero, About, Why Us, Testimonials, FAQ, Contact) | ✅ |
| Course listing & detail pages | ✅ |
| Student enrollment form (with resume upload) | ✅ |
| Razorpay payment integration | ✅ |
| Payment signature verification | ✅ |
| Razorpay webhook handling | ✅ |
| Enrollment confirmation email | ✅ |
| Admin notification email | ✅ |
| Payment failed email | ✅ |
| Admin dashboard (login, JWT auth) | ✅ |
| Student management | ✅ |
| Enrollment management | ✅ |
| Course CRUD (admin) | ✅ |
| Payment monitoring | ✅ |
| Email log viewer + retry | ✅ |
| Audit logging | ✅ |
| Rate limiting | ✅ |
| Input validation (Joi) | ✅ |
| Security middleware (Helmet, CORS, sanitize) | ✅ |
| Firebase Firestore & Storage | ✅ |

---

## Phase 2 — Growth (Next 3–6 months)

| Feature | Priority |
|---------|----------|
| Student portal (login, view enrollments) | 🔴 High |
| Course syllabus / curriculum builder | 🔴 High |
| Batch management (cohort start/end dates) | 🟡 Medium |
| Referral & discount coupon system | 🟡 Medium |
| Student progress tracking | 🟡 Medium |
| Email queue with Bull + Redis | 🟡 Medium |
| Notification system (in-app + push) | 🟡 Medium |
| WhatsApp notifications (Twilio) | 🟡 Medium |
| Google OAuth login for students | 🟠 Nice-to-have |
| Blog / SEO pages | 🟠 Nice-to-have |
| Razorpay subscription (EMI/instalments) | 🔴 High |

---

## Phase 3 — Scale (6–12 months)

| Feature | Priority |
|---------|----------|
| LMS integration (Moodle / custom) | 🔴 High |
| Live class scheduling (Zoom/Jitsi) | 🔴 High |
| Certificate generation (PDF) | 🔴 High |
| Multi-language support (i18n) | 🟡 Medium |
| Mobile app (React Native) | 🟡 Medium |
| Redis caching for course listings | 🟡 Medium |
| Advanced analytics dashboard | 🟡 Medium |
| A/B testing for landing page | 🟠 Nice-to-have |
| Multi-currency support | 🟠 Nice-to-have |
| AI-powered course recommendations | 🟠 Nice-to-have |

---

## Technical Scaling Plan

### When monthly enrollments > 500
- Add Redis for session + rate limiting (replace in-memory)
- Enable Firestore composite indexes for all common queries
- Move email sending to Bull queue (retry, backoff, priority)
- Add CDN for static assets

### When monthly enrollments > 2,000
- Add read replicas for Firestore (Cloud Spanner if needed)
- Separate microservices: Email Service, Payment Service
- Container orchestration: Kubernetes (GKE) or Cloud Run scaling
- Add distributed tracing (Cloud Trace / Jaeger)

### When monthly enrollments > 10,000
- Event-driven architecture (Pub/Sub → Cloud Functions)
- CQRS pattern for analytics queries
- Elasticsearch for full-text student/course search
- Data warehouse for business intelligence (BigQuery)
- CDN edge caching for course content
