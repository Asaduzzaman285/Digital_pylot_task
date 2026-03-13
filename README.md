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

## 🛡️ Next Steps for Scaling
- [ ] **MFA Integration**: Add TOTP or SMS verification for Admin roles.
- [ ] **Sessional Audit**: Live websocket streaming for real-time audit monitoring.
- [ ] **Multi-tenancy**: Expand the schema to support multiple organizations (Workspaces).
- [ ] **E2E Browser Tests**: Integrate Playwright or Cypress for full-flow visual testing.
