# UPX Global — Deployment Guide

## Environments

| Env | Frontend | Backend |
|-----|----------|---------|
| Development | `localhost:3000` | `localhost:5000` |
| Production | Firebase Hosting | Cloud Run / Railway |

---

## Firebase Hosting (Frontend)

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. Initialize
```bash
cd client
npm run build
firebase init hosting
# Public dir: build
# SPA: yes
# No overwrite index.html
```

### 3. Deploy
```bash
firebase deploy --only hosting
```

---

## Cloud Run (Backend — Recommended for Production)

### Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .
EXPOSE 5000
CMD ["node", "app.js"]
```

### Deploy
```bash
# Build & push
gcloud builds submit --tag gcr.io/YOUR_PROJECT/upxglobal-api

# Deploy
gcloud run deploy upxglobal-api \
  --image gcr.io/YOUR_PROJECT/upxglobal-api \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,PORT=5000
```

### Set Secrets
```bash
gcloud run services update upxglobal-api \
  --update-secrets JWT_SECRET=jwt-secret:latest,\
RAZORPAY_KEY_SECRET=razorpay-secret:latest
```

---

## Railway (Simpler Alternative)

1. Connect GitHub repo at https://railway.app
2. Set root directory to `server/`
3. Add all `.env` variables in Railway dashboard
4. Railway auto-deploys on push

---

## Environment Variables (Production)

```bash
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-domain.com
JWT_SECRET=<32+ char random string>
JWT_REFRESH_SECRET=<32+ char random string>
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_STORAGE_BUCKET=...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=<sendgrid-api-key>
ADMIN_EMAIL=admin@upxglobal.com
```

---

## Firestore Security Rules

Deploy these to restrict direct client access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // No direct client access to any collection
    // All access goes through the Admin SDK (server-side only)
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /resumes/{studentId}/{filename} {
      allow read: if true;  // public resumes
      allow write: if false; // server-side upload only
    }
  }
}
```

---

## Production Readiness Checklist

### Security
- [ ] All secrets in environment variables (never in code)
- [ ] `NODE_ENV=production` set
- [ ] HTTPS enforced
- [ ] CORS whitelist set to production domain only
- [ ] Firestore/Storage rules deployed
- [ ] Rate limiting active
- [ ] Helmet.js headers active
- [ ] JWT secrets are 32+ random characters
- [ ] bcrypt rounds ≥ 12
- [ ] Razorpay webhook secret configured

### Infrastructure
- [ ] Firebase project on Blaze (pay-as-you-go) plan
- [ ] Firestore indexes created for query fields
- [ ] Cloud Run min instances ≥ 1 (prevent cold start)
- [ ] Health check endpoint responding
- [ ] Error monitoring (Sentry / Cloud Logging)
- [ ] Log level set to `info` (not `debug`)

### Payment
- [ ] Switch Razorpay to live keys (`rzp_live_...`)
- [ ] Webhook URL registered in Razorpay Dashboard
- [ ] Webhook secret matches `RAZORPAY_WEBHOOK_SECRET`
- [ ] Test end-to-end with Razorpay test cards

### Email
- [ ] SMTP credentials tested in production
- [ ] Admin email `ADMIN_EMAIL` set correctly
- [ ] Email templates reviewed with real data
- [ ] SPF/DKIM records configured for sender domain

### Performance
- [ ] Frontend build optimized (`npm run build`)
- [ ] Firebase Hosting cache headers configured
- [ ] Gzip compression enabled (active via `compression` middleware)
- [ ] Images optimized and served from CDN

### Monitoring
- [ ] Server logs aggregated (Winston → Cloud Logging)
- [ ] Uptime monitoring (UptimeRobot or GCP)
- [ ] Error alerting configured
- [ ] Firestore usage dashboard reviewed

### Business
- [ ] Seed admin account created (`POST /api/auth/seed`)
- [ ] At least one course created via admin panel
- [ ] Test full enrollment flow with real card
- [ ] Refund policy page live
- [ ] Privacy policy page live
- [ ] Contact form tested
