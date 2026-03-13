# Obliq RBAC System - Technical Documentation

An enterprise-grade, full-stack Role-Based Access Control (RBAC) system featuring dynamic permissions, audit logging, and a premium "Figma-accurate" UI.

## 🚀 System Architecture

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Zustand, Lucide-React, Axios.
- **Backend**: NestJS, Prisma ORM, PostgreSQL, Passport.js (JWT).
- **Security**: 
  - JWT Access/Refresh token rotation.
  - Granular Permission Atoms (e.g., `view:users`, `manage:permissions`).
  - **Grant Ceiling Enforcement**: Ensures managers cannot grant permissions they do not hold.
  - Append-only Audit Logging.

---

## 🛠️ Prerequisites

Ensuring you have these installed before starting:
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) (For PostgreSQL) OR a local PostgreSQL instance.
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## 🏗️ Rapid Setup (Manual)

### 1. Database Setup
```bash
# If using Docker
docker run --name obliq-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### 2. Backend Installation (`rbac-backend`)
```bash
cd rbac-backend
npm install

# Configure Environment
cp .env.example .env 
# Update DATABASE_URL in .env if needed (default: postgres://postgres:postgres@localhost:5432/rbac_db)

# Run Migrations & Seed Data
npx prisma migrate dev --name init
npx prisma db seed

# Start Server
npm run start:dev
```

### 3. Frontend Installation (`rbac-frontend`)
```bash
cd rbac-frontend
npm install

# Start Development Server
npm run dev
```

---

## 🔐 Test Credentials (Seeded)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@rbac.com` | `Admin@123456` |
| **Manager** | `manager@rbac.com` | `Manager@123456` |
| **Agent** | `agent@rbac.com` | `Agent@123456` |

---

## ✅ Verification
Run the automated system-wide health check to verify all functional requirements:
```bash
cd rbac-backend
node scripts/verify-system.js
```

---

## ✨ Key Features Demonstrated
1. **Dynamic UI**: Sidebar items and page actions appear/disappear based on real-time permission resolution.
2. **Glassmorphism Design**: Custom wavy gradient backgrounds and semi-transparent UI elements matching the Figma aesthetic.
3. **Permission Overrides**: Per-user permission granting that supplements role-level defaults.
4. **Auditability**: Every login and permission change is recorded with actor metadata and IP addresses.

---

## 🌐 Cloud Deployment Guide

### 1. Database: Neon (PostgreSQL)
1. Sign up at [Neon.tech](https://neon.tech/).
2. Create a new project named `obliq-rbac`.
3. Copy the **Connection String** (Pooled is recommended for serverless: `postgres://user:pass@ep-ghost-123.pooler.aws.neon.tech/neondb?sslmode=require`).
4. In your backend `.env`, update `DATABASE_URL` with this string.

### 2. Backend Deployment (Render or Railway)
While Vercel *can* host NestJS via serverless functions, it is often more stable to use **Render** or **Railway** for a long-running NestJS API.

**Option A: Render (Recommended for NestJS)**
1. Connect your GitHub repo to [Render](https://render.com/).
2. Select **Web Service**.
3. Use Build Command: `npm install && npm run build`.
4. Use Start Command: `npm run start:prod`.
5. Add secret environment variables (`DATABASE_URL`, `JWT_SECRET`, etc.).

### 3. Frontend Deployment (Vercel)
1. Connect your GitHub repo to [Vercel](https://vercel.com/).
2. Set the **Root Directory** to `rbac-frontend`.
3. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Your deployed Backend URL (e.g., `https://rbac-api.onrender.com/api/v1`).
4. Deploy!

### ⚙️ Environment Variables Checklist
| Variable | Scope | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Backend | Connection string from Neon. |
| `JWT_ACCESS_SECRET` | Backend | Long random string. |
| `JWT_REFRESH_SECRET` | Backend | Another random string. |
| `FRONTEND_URL` | Backend | Your deployed Vercel URL (e.g., `https://obliq-rbac.vercel.app`). |
| `NEXT_PUBLIC_API_URL` | Frontend | Your deployed Backend URL + `/api/v1`. |

---

## 🛡️ Next Steps for Scaling
- [ ] **MFA Integration**: Add TOTP or SMS verification for Admin roles.
- [ ] **Sessional Audit**: Live websocket streaming for real-time audit monitoring.
- [ ] **Multi-tenancy**: Expand the schema to support multiple organizations (Workspaces).
- [ ] **E2E Browser Tests**: Integrate Playwright or Cypress for full-flow visual testing.
