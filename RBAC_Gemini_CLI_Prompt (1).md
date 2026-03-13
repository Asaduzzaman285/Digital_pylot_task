# RBAC Dynamic Permissions System — Complete Gemini CLI Execution Prompt
> Full-Stack Build Guide · Next.js 14 + NestJS + PostgreSQL · v2.0
> Paste this entire document into Gemini CLI and execute phase by phase.

---

## MASTER CONTEXT (Read This First — Never Skip)

You are building a **Role-Based Access Control (RBAC) web platform** with **fully dynamic permissions**. This is NOT a traditional hard-coded role system. Access is granted atom-by-atom at runtime. Every route, every sidebar item, and every action is gated by a single permission atom. No page is permanently locked to a role — an Admin or Manager can grant/revoke any permission to any user at any time, subject to a "grant ceiling" (you cannot grant more than you yourself hold).

### Roles
| Role | Scope |
|------|-------|
| **Admin** | Full control. Manages all users, assigns managers, configures the entire permission tree, sees all audit logs. |
| **Manager** | Creates and manages their own team (agents + customers). Controls exactly which features each agent can use. Can suspend/ban users within their scope. |
| **Agent** | Works within modules their manager has unlocked. Could manage leads, tasks, reports — whatever they've been granted. |
| **Customer** | Self-service portal only. Views their own tickets/orders. Cannot see internal operations unless explicitly granted. |

### Tech Stack (Fixed)
- **Frontend:** Next.js 14 App Router + TypeScript + Tailwind CSS
- **Backend:** NestJS + TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT Access Token (15 min, in memory) + Refresh Token (7 days, httpOnly cookie). NO localStorage for tokens.
- **Deployment:** Vercel (frontend) + Railway or Render (backend)

### Core Entities
```
users, roles, permissions, role_permissions, user_permissions, audit_logs
```

### Key Rules (Enforce Throughout All Phases)
1. **Grant Ceiling:** A user can only grant permissions they themselves hold.
2. **Permission atoms gate routes**, not role labels.
3. **Sidebar is built at runtime** from the user's resolved permission set.
4. **Every admin/manager action** is written to the audit log (append-only).
5. **No localStorage** for auth tokens. Access token in memory, refresh token in httpOnly cookie.
6. **All UI must be fully responsive** across mobile, tablet, and desktop.
7. Use **meaningful Git commit messages** at every checkpoint.

---

## DESIGN SYSTEM (Apply Globally — Extracted from Figma)

> These values are derived from the provided Figma design file and prototype. Every UI component must follow this system. Do not deviate.

### Brand
- **App name:** Obliq
- **Logo:** Orange rounded-square icon + "Obliq" wordmark in dark text, displayed top-left on all pages
- **Brand icon:** Use an orange (`#E84B1C`) rounded square (8px radius) with a white abstract mark inside

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#E84B1C` | CTA buttons, active nav items, links, focus rings, badges |
| `primary-hover` | `#C93D14` | Button hover state |
| `background-page` | `#FAF9F6` | Main page background (off-white/cream) |
| `background-card` | `#FFFFFF` | Cards, modals, panels |
| `background-sidebar` | `#FFFFFF` | Sidebar background |
| `text-primary` | `#1A1A1A` | Headings, body text |
| `text-secondary` | `#6B7280` | Subtitles, placeholders, helper text |
| `text-muted` | `#9CA3AF` | Disabled states, timestamps |
| `border` | `#E5E7EB` | Input borders, dividers, table borders |
| `border-focus` | `#E84B1C` | Input focus ring |
| `gradient-start` | `#F5A623` | Right panel gradient — amber/golden |
| `gradient-mid` | `#E84B1C` | Right panel gradient — orange-red |
| `gradient-end` | `#8B2500` | Right panel gradient — deep burnt red |
| `success` | `#10B981` | Status badges, toast |
| `warning` | `#F59E0B` | Warning badges |
| `error` | `#EF4444` | Error states, banned badge |
| `info` | `#3B82F6` | Info badges, audit log action color |

### Typography
| Element | Font Weight | Size | Color |
|---------|-------------|------|-------|
| Page title / Card heading | 700 (Bold) | 22–24px | `#1A1A1A` |
| Section heading | 600 (SemiBold) | 18px | `#1A1A1A` |
| Body text | 400 (Regular) | 14px | `#1A1A1A` |
| Subtitle / hint | 400 (Regular) | 13px | `#6B7280` |
| Form label | 500 (Medium) | 14px | `#1A1A1A` |
| Button text | 500 (Medium) | 15px | `#FFFFFF` |
| Nav item | 500 (Medium) | 14px | `#6B7280` (inactive), `#E84B1C` (active) |
| Link | 500 (Medium) | 14px | `#E84B1C` |

Use **Inter** or **system-ui** as the font family.

### Spacing & Shape
- **Border radius — Cards/Modals:** `12px`
- **Border radius — Inputs/Buttons:** `8px`
- **Border radius — Badges/Pills:** `999px` (fully rounded)
- **Card shadow:** `0 2px 12px rgba(0,0,0,0.08)`
- **Modal shadow:** `0 8px 32px rgba(0,0,0,0.16)`
- **Input height:** `44px`
- **Button height (primary):** `48px`
- **Sidebar width (desktop):** `240px`
- **Topbar height:** `64px`

### Component Patterns

**Inputs**
```
- Full-width within their container
- Light border: #E5E7EB, 1px solid
- Background: #FFFFFF
- Border radius: 8px, height: 44px, padding: 0 12px
- On focus: border color changes to #E84B1C, subtle box-shadow: 0 0 0 3px rgba(232,75,28,0.12)
- Placeholder text: #9CA3AF
- Label sits above the input (not floating), font-weight: 500
```

**Primary Button**
```
- Background: #E84B1C
- Text: #FFFFFF, font-weight: 500
- Border radius: 8px, height: 48px
- Full-width in forms
- Hover: #C93D14
- Disabled: opacity 0.5, cursor not-allowed
- Loading state: show a white spinner inside, disable the button
```

**Sidebar Navigation**
```
- Background: #FFFFFF, right border: 1px solid #E5E7EB
- Logo + app name at top (16px padding)
- Nav items: 40px height, 12px horizontal padding, 8px border radius
- Inactive: text #6B7280, icon #9CA3AF
- Active/hover: background #FFF4F0 (light orange tint), text #E84B1C, icon #E84B1C
- Left border on active item: 3px solid #E84B1C
- Section group labels (e.g. "Users", "Other"): uppercase, 11px, #9CA3AF, font-weight: 600
- Sub-items indented 16px with smaller text (13px)
- Role badge at bottom of sidebar: pill with role name, color-coded
```

**Dashboard App Preview (Right Panel Decoration)**
```
- On the Login page only: right half of the screen shows a warm orange-to-deep-red gradient background
- Layered SVG wave shapes in amber (#F5A623), orange (#E84B1C), and dark red (#8B2500)
- Floating semi-transparent card overlay showing the app dashboard (screenshot/mockup style)
- This is purely decorative — use a CSS gradient + SVG waves, not an actual screenshot
```

**Status Badges**
```
ACTIVE:    background #D1FAE5, text #065F46  (green)
SUSPENDED: background #FEF3C7, text #92400E  (amber)
BANNED:    background #FEE2E2, text #991B1B  (red)
ADMIN:     background #EDE9FE, text #5B21B6  (purple)
MANAGER:   background #DBEAFE, text #1E40AF  (blue)
AGENT:     background #E0F2FE, text #0369A1  (light blue)
CUSTOMER:  background #F0FDF4, text #15803D  (green)
```

**Tables**
```
- Header row: background #F9FAFB, font-weight: 600, text #374151, border-bottom: 2px solid #E5E7EB
- Body rows: background #FFFFFF, border-bottom: 1px solid #F3F4F6
- Row hover: background #FFF9F7 (very light orange tint)
- Cell padding: 12px 16px
- Actions column: right-aligned, icon buttons with tooltip
```

**Cards (Stat Cards on Dashboard)**
```
- Background: #FFFFFF, border-radius: 12px, padding: 20px 24px
- Shadow: 0 2px 12px rgba(0,0,0,0.08)
- Icon in a colored circle (primary color background, white icon)
- Large number: font-size 28px, font-weight: 700
- Label below: font-size 13px, color #6B7280
```

---

## PHASE 1 — Project Scaffolding & Repository Setup

### Goal
Both repos scaffolded, dependencies installed, environment files in place, and initial commit pushed.

### Step 1.1 — Create GitHub Repositories
```
Task: Create two GitHub repositories:
1. rbac-frontend  (Next.js 14 App Router + TypeScript)
2. rbac-backend   (NestJS + TypeScript)

Both repos must be public (for submission). Initialize each with a README.md.
```

### Step 1.2 — Scaffold Frontend
```
Task: Inside the rbac-frontend directory, scaffold a Next.js 14 project:

Commands to run:
  npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

Then install additional dependencies:
  npm install axios zustand @tanstack/react-query zod react-hook-form @hookform/resolvers
  npm install lucide-react clsx tailwind-merge
  npm install -D @types/node

Create the following folder structure inside /src:
  /app                    → Next.js App Router pages
  /app/(auth)             → Login/logout routes (no sidebar layout)
  /app/(dashboard)        → All protected routes (with sidebar layout)
  /components/ui          → Reusable UI primitives (Button, Input, Modal, Badge, Table, etc.)
  /components/layout      → Sidebar, Topbar, PermissionGate
  /lib                    → Utility functions, API client, constants
  /hooks                  → Custom React hooks (useAuth, usePermissions, etc.)
  /store                  → Zustand stores (authStore, permissionStore)
  /types                  → TypeScript interfaces and enums
  /middleware.ts           → Next.js middleware (MUST be at root of /src)

Create .env.local with:
  NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Step 1.3 — Scaffold Backend
```
Task: Inside the rbac-backend directory, scaffold a NestJS project:

Commands:
  npm i -g @nestjs/cli
  nest new . --package-manager npm --skip-git

Then install dependencies:
  npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt passport-local
  npm install @prisma/client prisma bcryptjs class-validator class-transformer
  npm install @nestjs/throttler helmet cookie-parser
  npm install -D @types/bcryptjs @types/cookie-parser @types/passport-jwt @types/passport-local

Initialize Prisma:
  npx prisma init

Create the following NestJS module structure:
  /src/auth           → AuthModule (login, logout, refresh, guards)
  /src/users          → UsersModule (CRUD for all roles)
  /src/permissions    → PermissionsModule (permission atoms CRUD)
  /src/roles          → RolesModule (role definitions)
  /src/audit          → AuditModule (audit log entries)
  /src/common         → Guards, decorators, interceptors, filters
  /src/prisma         → PrismaService (singleton)

Create .env with:
  DATABASE_URL="postgresql://user:password@localhost:5432/rbac_db"
  JWT_ACCESS_SECRET=your_access_secret_here
  JWT_REFRESH_SECRET=your_refresh_secret_here
  JWT_ACCESS_EXPIRES_IN=15m
  JWT_REFRESH_EXPIRES_IN=7d
  PORT=3001
  FRONTEND_URL=http://localhost:3000
```

### Step 1.4 — Git Checkpoint
```
Task: In both repos, stage all files and commit with message:
  "chore: initial project scaffold with folder structure and dependencies"
Push to GitHub main branch.
```

### ✅ Phase 1 Complete Criteria
- [ ] Both repos exist on GitHub
- [ ] `npm run dev` works on frontend (shows default Next.js page)
- [ ] `npm run start:dev` works on backend (NestJS boots without errors)
- [ ] Folder structures match the spec above

---

## PHASE 2 — Database Schema & Prisma Setup

### Goal
PostgreSQL database designed, Prisma schema written, migrations run, and seed data created.

### Step 2.1 — Design the Prisma Schema
```
Task: Write the complete Prisma schema in /prisma/schema.prisma with the following models:

model User {
  id              String    @id @default(cuid())
  email           String    @unique
  password        String
  firstName       String
  lastName        String
  roleId          String
  role            Role      @relation(fields: [roleId], references: [id])
  managerId       String?   // null = top-level (Admin), or their assigned Manager
  manager         User?     @relation("UserManager", fields: [managerId], references: [id])
  subordinates    User[]    @relation("UserManager")
  status          UserStatus @default(ACTIVE)
  userPermissions UserPermission[]
  auditLogs       AuditLog[]
  refreshTokens   RefreshToken[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Role {
  id              String    @id @default(cuid())
  name            RoleName  @unique
  users           User[]
  rolePermissions RolePermission[]
}

model Permission {
  id              String    @id @default(cuid())
  atom            String    @unique   // e.g. "view:dashboard", "manage:users", "view:reports"
  label           String             // Human-readable: "View Dashboard"
  description     String?
  module          String             // e.g. "Dashboard", "Users", "Reports"
  rolePermissions RolePermission[]
  userPermissions UserPermission[]
}

model RolePermission {
  id            String     @id @default(cuid())
  roleId        String
  role          Role       @relation(fields: [roleId], references: [id])
  permissionId  String
  permission    Permission @relation(fields: [permissionId], references: [id])
  @@unique([roleId, permissionId])
}

model UserPermission {
  id            String     @id @default(cuid())
  userId        String
  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  permissionId  String
  permission    Permission @relation(fields: [permissionId], references: [id])
  grantedById   String     // Who granted this permission
  grantedAt     DateTime   @default(now())
  @@unique([userId, permissionId])
}

model RefreshToken {
  id          String   @id @default(cuid())
  token       String   @unique
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt   DateTime
  isRevoked   Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model AuditLog {
  id          String   @id @default(cuid())
  actorId     String
  actor       User     @relation(fields: [actorId], references: [id])
  action      String   // e.g. "GRANT_PERMISSION", "SUSPEND_USER", "LOGIN"
  targetType  String?  // e.g. "User", "Permission"
  targetId    String?
  metadata    Json?    // Extra context (before/after state, etc.)
  ipAddress   String?
  createdAt   DateTime @default(now())
}

enum RoleName {
  ADMIN
  MANAGER
  AGENT
  CUSTOMER
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  BANNED
}
```

### Step 2.2 — Run Migration
```
Task: Run the following commands:
  npx prisma migrate dev --name init_rbac_schema
  npx prisma generate

Verify: Check that all tables are created in PostgreSQL with correct foreign keys.
```

### Step 2.3 — Write Seed Data
```
Task: Create /prisma/seed.ts with the following seed data:

1. Create 4 Roles: ADMIN, MANAGER, AGENT, CUSTOMER

2. Create Permission Atoms (one per module/action):
   Module: Dashboard    → atom: "view:dashboard"
   Module: Users        → atoms: "view:users", "create:users", "edit:users", "delete:users"
   Module: Leads        → atoms: "view:leads", "create:leads", "edit:leads", "delete:leads"
   Module: Tasks        → atoms: "view:tasks", "create:tasks", "edit:tasks", "delete:tasks"
   Module: Reports      → atoms: "view:reports", "export:reports"
   Module: Audit Log    → atom: "view:audit-log"
   Module: Settings     → atom: "view:settings", "edit:settings"
   Module: Customer Portal → atom: "view:customer-portal"
   Module: Permissions  → atoms: "view:permissions", "manage:permissions"

3. Assign default RolePermissions:
   ADMIN        → ALL permissions
   MANAGER      → view:dashboard, view:users, create:users, edit:users, view:leads, create:leads,
                   edit:leads, view:tasks, create:tasks, edit:tasks, view:reports, view:audit-log,
                   view:settings, view:permissions, manage:permissions
   AGENT        → view:dashboard, view:leads, view:tasks (base minimum — Manager grants more)
   CUSTOMER     → view:customer-portal

4. Create seed users:
   Admin:   admin@rbac.com / Admin@123456  (role: ADMIN)
   Manager: manager@rbac.com / Manager@123456  (role: MANAGER, managerId: admin.id)
   Agent:   agent@rbac.com / Agent@123456  (role: AGENT, managerId: manager.id)
   Customer: customer@rbac.com / Customer@123456  (role: CUSTOMER, managerId: manager.id)

Run with: npx prisma db seed
```

### Step 2.4 — Git Checkpoint
```
Commit message: "feat(db): add prisma schema, migrations, and seed data"
```

### ✅ Phase 2 Complete Criteria
- [ ] All Prisma models created with correct relations
- [ ] Migration runs without errors
- [ ] Seed runs and creates 4 roles, all permission atoms, and 4 test users
- [ ] Can query users with their roles and permissions in Prisma Studio (`npx prisma studio`)

---

## PHASE 3 — Backend: Authentication System

### Goal
Complete auth system: login, logout, JWT access/refresh token flow, brute-force protection, session blacklist.

### Step 3.1 — PrismaService
```
Task: Create /src/prisma/prisma.service.ts as a NestJS injectable singleton that extends PrismaClient.
It must call this.$connect() in onModuleInit and this.$disconnect() in onModuleDestroy.
Export PrismaModule as a Global module so all other modules can inject it without importing it.
```

### Step 3.2 — Auth DTOs & Validation
```
Task: Create the following DTOs using class-validator:

LoginDto:
  - email: string (IsEmail, IsNotEmpty)
  - password: string (IsString, MinLength(8))

RefreshTokenDto:
  - refreshToken: string (IsString)

All DTOs must use ValidationPipe globally (set in main.ts with whitelist: true, forbidNonWhitelisted: true).
```

### Step 3.3 — Password Hashing
```
Task: In UsersService, use bcryptjs with saltRounds=12 for hashing passwords on create/update.
Never return the password field in any API response. Use class-transformer @Exclude() or manually strip it.
```

### Step 3.4 — JWT Strategy (Access Token)
```
Task: Create JwtAccessStrategy (passport-jwt) that:
  - Reads the Bearer token from the Authorization header
  - Verifies against JWT_ACCESS_SECRET
  - Extracts { sub: userId, email, roleId } from payload
  - Attaches the resolved user (with their permissions) to request.user

Create JwtAuthGuard that uses this strategy.
```

### Step 3.5 — Refresh Token Strategy
```
Task: Create RefreshTokenStrategy (passport-jwt) that:
  - Reads the token from the httpOnly cookie named "refreshToken"
  - Verifies against JWT_REFRESH_SECRET
  - Checks the RefreshToken table to ensure token is not revoked and not expired
  - Attaches userId to request

Create RefreshGuard that uses this strategy.
```

### Step 3.6 — AuthService Methods
```
Task: Implement the following methods in AuthService:

1. login(loginDto):
   - Find user by email (throw 401 if not found)
   - Compare password with bcrypt.compare (throw 401 if mismatch)
   - Check user.status === ACTIVE (throw 403 if SUSPENDED or BANNED)
   - Generate access token (15 min) with payload { sub, email, roleId }
   - Generate refresh token (7 days), save hashed version to RefreshToken table
   - Write AuditLog: action="LOGIN", actorId=user.id
   - Return { accessToken } and set refreshToken as httpOnly cookie

2. refresh(userId, rawRefreshToken):
   - Validate token exists in DB and is not revoked
   - Issue new access token
   - Rotate refresh token (revoke old, create new)

3. logout(userId, refreshToken):
   - Revoke the refresh token in DB
   - Write AuditLog: action="LOGOUT"
   - Clear the cookie

4. getProfile(userId):
   - Return user with their resolved permissions (merge RolePermissions + UserPermissions)
```

### Step 3.7 — AuthController Endpoints
```
Task: Create the following REST endpoints:

POST /auth/login         → Public. Returns { accessToken, user }. Sets refreshToken cookie.
POST /auth/logout        → Protected (JwtAuthGuard). Clears cookie, revokes token.
POST /auth/refresh       → Protected (RefreshGuard). Returns new { accessToken }.
GET  /auth/me            → Protected (JwtAuthGuard). Returns current user with permissions.
```

### Step 3.8 — Brute Force Protection
```
Task: Use @nestjs/throttler to apply rate limiting on POST /auth/login:
  - 5 attempts per 60 seconds per IP
  - Return 429 Too Many Requests with message "Too many login attempts. Try again in 60 seconds."
Apply ThrottlerModule globally in AppModule with default 100 req/60s, then override on login route.
```

### Step 3.9 — CORS & Security Headers
```
Task: In main.ts:
  - Enable CORS with origin: process.env.FRONTEND_URL, credentials: true
  - Use helmet() middleware
  - Use cookie-parser middleware
  - Set global ValidationPipe
  - Set global prefix: /api/v1
```

### Step 3.10 — Git Checkpoint
```
Commit message: "feat(auth): implement JWT auth with refresh rotation, brute force protection, and audit logging"
```

### ✅ Phase 3 Complete Criteria
- [ ] POST /api/v1/auth/login returns access token and sets httpOnly cookie
- [ ] POST /api/v1/auth/refresh rotates refresh token
- [ ] POST /api/v1/auth/logout clears cookie and revokes token in DB
- [ ] GET /api/v1/auth/me returns user + permission atoms
- [ ] 6th login attempt within 60s returns 429
- [ ] Suspended/banned users get 403 on login

---

## PHASE 4 — Backend: Users, Permissions & Role Hierarchy

### Goal
Full user CRUD, permission management, role hierarchy enforcement, and audit logging on every mutation.

### Step 4.1 — Permission Resolution Logic
```
Task: Create a PermissionService method resolveUserPermissions(userId):

Logic:
  1. Load the user's role → get all RolePermissions for that role
  2. Load all UserPermissions for that user (individually granted/revoked atoms)
  3. Merge: UserPermissions OVERRIDE role defaults
  4. Return a flat array of permission atom strings: ["view:dashboard", "view:reports", ...]

This resolved set is what middleware.ts and guards must use.
Cache this in Redis (optional) or re-fetch on each request (acceptable for MVP).
```

### Step 4.2 — Permission Guard (Atom-Based)
```
Task: Create a RequirePermission(atom: string) decorator and PermissionGuard:

@RequirePermission('view:users')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Get('/users')
getUsers() { ... }

PermissionGuard:
  - Reads the required atom from the decorator metadata
  - Reads request.user.permissions (populated by JwtAuthGuard)
  - If atom is present in user's resolved permissions → allow
  - If not → throw ForbiddenException('Access denied: missing permission [atom]')
```

### Step 4.3 — Grant Ceiling Enforcement
```
Task: Create a GrantCeilingGuard used in the permission management endpoints:

Rule: A granting user can only grant a permission atom that exists in THEIR OWN resolved permission set.

Implementation:
  - When granterId tries to grant atom X to userId:
    - Resolve granterId's permissions
    - If atom X is NOT in granterId's permissions → throw ForbiddenException('Grant ceiling: you do not hold this permission')
    - Else → proceed with the grant
    - Write to AuditLog: { action: "GRANT_PERMISSION", actorId: granterId, targetType: "User", targetId: userId, metadata: { atom } }
```

### Step 4.4 — UsersModule Endpoints
```
Task: Implement the following endpoints with proper guards and audit logging:

--- Admin-only ---
GET    /users                       → RequirePermission('view:users') — list all users (paginated, filterable by role/status)
POST   /users                       → RequirePermission('create:users') — create user (any role)
GET    /users/:id                   → RequirePermission('view:users') — get single user with permissions
PATCH  /users/:id                   → RequirePermission('edit:users') — update user details
DELETE /users/:id                   → RequirePermission('delete:users') — soft delete (set status=BANNED)
PATCH  /users/:id/suspend           → RequirePermission('edit:users') — set status=SUSPENDED, audit log
PATCH  /users/:id/unsuspend         → RequirePermission('edit:users') — set status=ACTIVE, audit log
PATCH  /users/:id/ban               → RequirePermission('delete:users') — set status=BANNED, audit log

--- Manager scope (can only act on own subordinates) ---
GET    /users/my-team               → RequirePermission('view:users') — list users where managerId=me
POST   /users/my-team               → RequirePermission('create:users') — create agent/customer under me

Validation: A Manager hitting /users (all users) must only see their own subordinates.
Inject a scope filter: if req.user.role === MANAGER, add where: { managerId: req.user.id } to all queries.
```

### Step 4.5 — Permissions Management Endpoints
```
Task: Implement permission management endpoints:

GET    /permissions                           → RequirePermission('view:permissions') — list all atoms
GET    /permissions/user/:userId              → RequirePermission('view:permissions') — get user's resolved permissions
POST   /permissions/grant                     → RequirePermission('manage:permissions') — grant atom to user (+ GrantCeilingGuard)
DELETE /permissions/revoke                    → RequirePermission('manage:permissions') — remove UserPermission (+ GrantCeilingGuard)

Body for grant/revoke: { userId: string, atom: string }

Each mutation: Write AuditLog entry.
```

### Step 4.6 — Audit Log Endpoint
```
Task: Create AuditModule:

GET /audit-logs          → RequirePermission('view:audit-log')
  Query params: page, limit, actorId, action, targetType, dateFrom, dateTo
  Returns paginated, sorted-by-createdAt-desc audit entries with actor name populated.
```

### Step 4.7 — Git Checkpoint
```
Commit message: "feat(api): users CRUD, permission management with grant ceiling, and audit log endpoints"
```

### ✅ Phase 4 Complete Criteria
- [ ] All user CRUD endpoints work with correct permission guards
- [ ] Manager can only see/manage their own team
- [ ] Grant ceiling is enforced — granting a permission you don't hold returns 403
- [ ] Every mutation writes to audit_logs table
- [ ] GET /permissions/user/:id returns the correct merged permission set

---

## PHASE 5 — Frontend: Auth Flow & Zustand Store

### Goal
Login page (Figma-matching), auth state in Zustand, token refresh logic, and protected route scaffolding.

### Step 5.0 — Tailwind Design Token Configuration
```
Task: Update tailwind.config.ts to register all design system tokens from the DESIGN SYSTEM section:

extend: {
  colors: {
    primary: {
      DEFAULT: '#E84B1C',
      hover:   '#C93D14',
      light:   '#FFF4F0',
    },
    page:     '#FAF9F6',
    card:     '#FFFFFF',
    border:   '#E5E7EB',
    text: {
      primary:   '#1A1A1A',
      secondary: '#6B7280',
      muted:     '#9CA3AF',
    },
  },
  borderRadius: {
    card:  '12px',
    input: '8px',
  },
  boxShadow: {
    card:  '0 2px 12px rgba(0,0,0,0.08)',
    modal: '0 8px 32px rgba(0,0,0,0.16)',
    focus: '0 0 0 3px rgba(232,75,28,0.12)',
  },
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  },
}

Also add Google Fonts import for Inter in /src/app/layout.tsx.
```


### Step 5.1 — API Client Setup
```
Task: Create /src/lib/api.ts using axios:

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/v1',
  withCredentials: true, // sends httpOnly cookie
});

Add a request interceptor:
  - Attach the in-memory access token to every request as Authorization: Bearer <token>

Add a response interceptor:
  - On 401 response: attempt POST /auth/refresh to get a new access token
  - Store new access token in memory (Zustand)
  - Retry the original failed request once
  - If refresh also fails: clear auth state, redirect to /login
```

### Step 5.2 — Auth Zustand Store
```
Task: Create /src/store/authStore.ts:

interface AuthState {
  accessToken: string | null       // IN MEMORY ONLY — never localStorage
  user: User | null
  permissions: string[]            // resolved permission atoms
  isLoading: boolean
  isAuthenticated: boolean
  login: (email, password) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  setUser: (user: User) => void
}

Important: accessToken lives only in this Zustand store (memory). On page refresh, the store
is empty → immediately call GET /auth/refresh (cookie is still valid) → re-hydrate the store.
This happens in a top-level AuthProvider component.
```

### Step 5.3 — AuthProvider Component
```
Task: Create /src/components/layout/AuthProvider.tsx:

On mount:
  1. Call GET /auth/me (the cookie will be sent automatically)
  2. If success: populate authStore with user + permissions + new accessToken
  3. If fail (401/403): do nothing → middleware.ts will redirect to /login

Wrap the entire app in this provider (in /src/app/layout.tsx).
Show a full-screen loading spinner while the initial auth check is running.
```

### Step 5.4 — Next.js Middleware (Route Gating)
```
Task: Create /src/middleware.ts:

Logic:
  1. For every request to a route under /(dashboard):
     - Read the refreshToken cookie
     - If no cookie → redirect to /login
     - (Full permission check happens server-side via the API — the middleware just ensures a session exists)

  2. For the login page:
     - If a refreshToken cookie exists → redirect to /dashboard

  3. Match pattern: config.matcher = ['/((?!_next/static|_next/image|favicon.ico|api).*)']

Note: Deep permission checks (e.g. can this user access /reports) happen client-side via
the PermissionGate component and server-side via the API guards. Middleware is the first
coarse filter.
```

### Step 5.5 — Login Page (Figma Implementation — Pixel Accurate)
```
Task: Implement the login page at /src/app/(auth)/login/page.tsx

EXACT LAYOUT (from Figma prototype analysis):

Outer wrapper:
  - Full viewport height (100vh), flex row, no overflow
  - Background: #FAF9F6

LEFT PANEL (55% width on desktop, 100% on mobile):
  - Cream/off-white background (#FAF9F6)
  - Obliq logo top-left: orange rounded-square icon + "Obliq" wordmark
    Position: absolute top-6 left-8, or in a top nav bar
  - Login card centered vertically and horizontally:
      background: #FFFFFF
      border-radius: 12px
      box-shadow: 0 2px 12px rgba(0,0,0,0.08)
      padding: 40px 40px (desktop), 24px (mobile)
      width: ~420px max, full-width on mobile

  Card contents (top to bottom):
    1. "Login"                   → font-size: 24px, font-weight: 700, color: #1A1A1A, text-align: center
    2. "Enter your details to continue"  → font-size: 14px, color: #6B7280, text-align: center, margin-bottom: 28px
    3. Email label + input:
         Label: "Email", font-weight: 500, font-size: 14px, margin-bottom: 6px
         Input: type="email", placeholder="example@email.com"
         Height: 44px, border: 1px solid #E5E7EB, border-radius: 8px
         Focus: border-color: #E84B1C, box-shadow: 0 0 0 3px rgba(232,75,28,0.12)
    4. Password label + input (with eye toggle):
         Label: "Password", same style as Email label
         Input: type="password" (toggleable), placeholder="Enter your password"
         Same dimensions as email input
         Eye icon: grey, right-aligned inside the input, toggles visibility on click
    5. Inline row (flex, space-between):
         Left: checkbox + "Remember me" label (font-size: 14px, color: #6B7280)
         Right: "Forgot password?" link (color: #E84B1C, font-weight: 500, font-size: 14px)
    6. "Log in" button:
         Full-width, height: 48px, background: #E84B1C, color: #FFFFFF
         border-radius: 8px, font-weight: 500, font-size: 15px
         Hover: #C93D14
         Loading state: white spinner, button disabled
         margin-top: 20px
    7. Error banner (shown on API error):
         background: #FEE2E2, border: 1px solid #FECACA, border-radius: 8px
         text color: #991B1B, font-size: 14px, padding: 10px 14px
         appears ABOVE the Log In button
    8. "Don't have an account? Sign up" (bottom, centered)
         Note: "Sign up" is bold (#1A1A1A) — for this RBAC system, make the Sign up text
         non-functional (no route) or remove entirely per spec (users created by Admin only).
         Replace with: "Access is by invitation only." in #6B7280

Validation (react-hook-form + zod):
  - Email: required, must be valid email format
  - Password: required, min 8 characters
  - Show red helper text below the input on error (font-size: 12px, color: #EF4444)

RIGHT PANEL (45% width — desktop only, hidden on mobile):
  - Background: linear-gradient from #F5A623 (top-right) through #E84B1C to #8B2500 (bottom-left)
  - Layered SVG wave shapes on top of the gradient (3 waves, varying opacity)
    Wave colors: rgba(255,255,255,0.08), rgba(232,75,28,0.3), rgba(139,37,0,0.4)
    Use organic blob/wave shapes (SVG path or CSS clip-path)
  - Floating dashboard mockup card (center-right):
      White card, border-radius: 12px, shadow, ~60% width of the panel
      Inside: simplified sidebar + task list layout (static HTML, not functional)
      Sidebar items: Dashboard, Leads, Opportunities, Tasks, Reports, Contacts, Messages
      Main content: "Tasks" heading, List/Kanban tabs, 3-4 task rows

RESPONSIVENESS:
  - Mobile (< 768px): Only show left panel (full width). Right panel hidden. Logo at top-center.
  - Tablet (768px–1024px): Left panel full-width, right panel hidden or shown at 40%
  - Desktop (> 1024px): Full split layout as described

On successful login:
  - Store access token in Zustand (in memory only)
  - Redirect to /dashboard
```

### Step 5.6 — Git Checkpoint
```
Commit message: "feat(frontend): auth store, login page, API client with refresh interceptor, route middleware"
```

### ✅ Phase 5 Complete Criteria
- [ ] Login page matches Figma, fully responsive
- [ ] Successful login stores token in memory (not localStorage), redirects to /dashboard
- [ ] Page refresh re-hydrates auth state via cookie
- [ ] Unauthenticated requests to /dashboard redirect to /login
- [ ] Authenticated requests to /login redirect to /dashboard

---

## PHASE 6 — Frontend: Layout, Dynamic Sidebar & Permission Gate

### Goal
Dashboard shell with a dynamic sidebar that builds itself from the user's live permission set.

### Step 6.1 — Permission Gate Component
```
Task: Create /src/components/layout/PermissionGate.tsx:

interface Props {
  atom: string          // e.g. "view:reports"
  children: ReactNode
  fallback?: ReactNode  // what to render if no permission (default: null)
}

Logic:
  const { permissions } = useAuthStore()
  if (permissions.includes(atom)) return children
  return fallback ?? null

Usage example:
  <PermissionGate atom="view:reports">
    <SidebarItem href="/reports" label="Reports" />
  </PermissionGate>
```

### Step 6.2 — Sidebar Navigation Config
```
Task: Create /src/lib/navigation.ts — a config array defining all possible nav items:

const NAV_ITEMS = [
  { label: 'Dashboard',        href: '/dashboard',          atom: 'view:dashboard',        icon: LayoutDashboard },
  { label: 'Users',            href: '/users',              atom: 'view:users',             icon: Users },
  { label: 'Leads',            href: '/leads',              atom: 'view:leads',             icon: Target },
  { label: 'Tasks',            href: '/tasks',              atom: 'view:tasks',             icon: CheckSquare },
  { label: 'Reports',          href: '/reports',            atom: 'view:reports',           icon: BarChart2 },
  { label: 'Audit Log',        href: '/audit-log',          atom: 'view:audit-log',         icon: ScrollText },
  { label: 'Customer Portal',  href: '/customer-portal',    atom: 'view:customer-portal',   icon: UserCircle },
  { label: 'Settings',         href: '/settings',           atom: 'view:settings',          icon: Settings },
  { label: 'Permissions',      href: '/permissions',        atom: 'view:permissions',       icon: Shield },
]

The Sidebar component iterates over NAV_ITEMS and wraps each in <PermissionGate atom={item.atom}>.
Only items the user holds permission for are rendered.
```

### Step 6.3 — Dashboard Layout
```
Task: Create /src/app/(dashboard)/layout.tsx:

Layout structure:
  <AuthProvider>                          ← ensures auth is loaded
    <div className="flex h-screen">
      <Sidebar />                         ← dynamic, permission-driven
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />                        ← shows user avatar, name, role badge, logout
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  </AuthProvider>

Sidebar behavior:
  - Desktop: always visible (240px wide)
  - Mobile: hidden by default, opens as a slide-over drawer via hamburger menu
  - Highlights the active route
  - Shows role badge at the bottom (ADMIN / MANAGER / AGENT / CUSTOMER)

Topbar:
  - Shows current page title (from route)
  - User avatar (initials-based), full name, role badge
  - Logout button → calls authStore.logout() → redirects to /login
```

### Step 6.4 — 403 Forbidden Page
```
Task: Create /src/app/(dashboard)/403/page.tsx:

When a user navigates to a page they don't have permission for (caught by page-level check),
show a clean 403 page with:
  - Lock icon
  - "Access Denied" heading
  - "You don't have permission to view this page. Contact your administrator."
  - Back to Dashboard button
```

### Step 6.5 — Git Checkpoint
```
Commit message: "feat(frontend): dashboard layout, dynamic sidebar with permission-gated nav items, 403 page"
```

---

## PHASE 7 — Frontend: Core Module Pages

### Goal
All 8 modules built with proper permission gates, responsive design, and real API data.

### Step 7.1 — Dashboard Page
```
Task: /src/app/(dashboard)/dashboard/page.tsx

Requires atom: view:dashboard (check at page level — if missing, redirect to /403)

Content (adapt based on role):
  - Admin view: total users, total managers, total agents, total customers (stat cards)
  - Manager view: my team size, active agents, open tasks, open leads
  - Agent view: my tasks count, my leads count
  - All views: recent activity feed (last 5 audit log entries the user can see)

Fetch data from API on load. Show skeleton loaders while fetching.
```

### Step 7.2 — Users Management Page
```
Task: /src/app/(dashboard)/users/page.tsx

Requires atom: view:users

Features:
  - Searchable, filterable (by role, status) data table
  - Columns: Name, Email, Role, Status (badge), Manager, Created At, Actions
  - Actions per row (gated by individual atoms):
      Edit (requires edit:users) → opens edit modal
      Suspend/Unsuspend (requires edit:users) → confirmation dialog → API call
      Ban (requires delete:users) → confirmation dialog → API call
  - "Create User" button (requires create:users) → opens create modal
  - Pagination (20 per page)
  - Manager scope: Manager only sees their own team (backend enforces this too)

Create/Edit modal fields: firstName, lastName, email, password (create only), role, managerId
```

### Step 7.3 — Permissions Management Page
```
Task: /src/app/(dashboard)/permissions/page.tsx

Requires atom: view:permissions

This is the most critical UI. It is a visual permission editor.

Layout:
  Left panel: List of users (searchable, filterable by role)
  Right panel: Permission matrix for the selected user

Permission Matrix:
  - Group permissions by module (Dashboard, Users, Leads, Tasks, Reports, Audit Log, Settings, Customer Portal, Permissions)
  - Each atom shown as a toggle (on/off)
  - Toggle state = whether the user has that permission in their resolved set
  - Toggles that are part of the granter's ceiling are ENABLED (can toggle)
  - Toggles for permissions the granter doesn't hold are DISABLED (greyed out, tooltip: "You don't hold this permission")
  - Toggling ON → POST /permissions/grant { userId, atom }
  - Toggling OFF → DELETE /permissions/revoke { userId, atom }
  - Show a subtle indicator (e.g., star/dot) when a permission is an individual override vs inherited from role

Requires atom manage:permissions to actually toggle (if only view:permissions, show read-only matrix)
```

### Step 7.4 — Audit Log Page
```
Task: /src/app/(dashboard)/audit-log/page.tsx

Requires atom: view:audit-log

Features:
  - Paginated table (newest first)
  - Columns: Timestamp, Actor (name + role), Action, Target, Details
  - Filters: date range, actor, action type
  - Actions are color-coded (LOGIN=green, GRANT_PERMISSION=blue, SUSPEND_USER=orange, BAN_USER=red, LOGOUT=grey)
  - No edit/delete controls — append-only
```

### Step 7.5 — Leads, Tasks, Reports, Settings, Customer Portal Pages
```
Task: Create placeholder pages for the remaining modules.

For each page:
  1. Check the required permission atom at the top of the page
  2. If missing → redirect to /403
  3. Show a clean page with the module title, an icon, and placeholder content
     (e.g. "Leads module coming soon" or a simple mock table with dummy data)
  4. Each page must be fully responsive

Pages:
  /leads           → requires view:leads
  /tasks           → requires view:tasks
  /reports         → requires view:reports
  /settings        → requires view:settings
  /customer-portal → requires view:customer-portal
```

### Step 7.6 — Git Checkpoint
```
Commit message: "feat(frontend): dashboard, users, permissions editor, audit log, and placeholder module pages"
```

---

## PHASE 8 — Responsiveness, Polish & UI Consistency

### Goal
Every single page passes mobile (375px), tablet (768px), and desktop (1280px+) visual checks.

### Step 8.1 — Mobile Responsiveness Audit
```
Task: Go through each page and verify/fix:

1. Sidebar:
   - On mobile (< 768px): hidden by default, toggle via hamburger button in Topbar
   - Slide-over drawer with overlay backdrop
   - Closes when a nav item is clicked

2. Tables (Users, Audit Log):
   - On mobile: switch from table layout to card layout (each row = a card with stacked fields)
   - Or use horizontal scroll container with min-width on table
   - Action buttons collapse into a "⋮" dropdown menu on mobile

3. Modals:
   - Full screen on mobile (no border radius, no padding offset)
   - Scrollable if content overflows

4. Forms:
   - Single column on mobile, two columns on desktop (use CSS Grid with responsive breakpoints)

5. Permissions Matrix:
   - Module groups stack vertically on mobile
   - Toggle labels truncate with ellipsis if too long

6. Dashboard stat cards:
   - 1 column on mobile, 2 on tablet, 4 on desktop

Test breakpoints: 375px, 768px, 1024px, 1280px
```

### Step 8.2 — Loading States & Empty States
```
Task: Ensure every data-fetching component has:

Loading state:
  - Skeleton loaders (not spinners) for table rows and stat cards
  - Button loading spinner during form submissions
  - Full-page loading screen during initial auth check

Empty state:
  - Friendly illustration + message when a table/list has no data
  - e.g., "No users found. Create your first user to get started."
  - "No audit log entries yet."
```

### Step 8.3 — Toast Notifications
```
Task: Install and configure a toast library (react-hot-toast or sonner):

Show toasts for:
  ✅ Success: "User created successfully", "Permission granted", "User suspended"
  ❌ Error: "Failed to create user", "Permission denied", network errors
  ⚠️  Warning: "Session expired. Logging out..."

Toast appears top-right on desktop, top-center on mobile.
```

### Step 8.4 — Git Checkpoint
```
Commit message: "feat(ui): responsive layout, skeleton loaders, empty states, and toast notifications"
```

---

## PHASE 9 — Security Hardening & Edge Cases

### Goal
Ensure the system is secure against common attack vectors and handles edge cases gracefully.

### Step 9.1 — Backend Security Checklist
```
Task: Verify and implement the following:

1. All mutation endpoints validate input via class-validator DTOs — no raw req.body usage.
2. Passwords are never returned in any API response (use @Exclude in UserResponseDto).
3. Rate limiting is active on /auth/login (5 req/60s per IP).
4. JWT secrets are loaded from env vars — never hardcoded.
5. CORS only allows requests from FRONTEND_URL.
6. Helmet sets security headers (X-Frame-Options, Content-Security-Policy, etc.).
7. Refresh tokens are stored as hashes in the DB — never plaintext.
8. A Manager cannot grant permissions to users outside their team (add scope check to grant endpoint).
9. A Manager cannot grant permissions they don't hold (grant ceiling — already in Phase 4, verify it works).
10. Suspended/Banned users cannot refresh tokens (check user.status in RefreshTokenStrategy).
```

### Step 9.2 — Frontend Security Checklist
```
Task: Verify:

1. No tokens are ever written to localStorage or sessionStorage — only Zustand in-memory.
2. All API errors are caught and displayed gracefully (no unhandled promise rejections).
3. Forms are protected against double-submit (disable button while loading).
4. Confirmation dialogs shown before destructive actions (suspend, ban, revoke permission).
5. The permission matrix renders correctly when a user has ZERO permissions (empty state, not a crash).
6. Navigating directly to a URL without permission redirects to /403 (not a white screen).
```

### Step 9.3 — Git Checkpoint
```
Commit message: "feat(security): input validation, token security, scope enforcement, and UI edge case handling"
```

---

## PHASE 10 — Deployment

### Goal
Both apps live and publicly accessible with working environment variables.

### Step 10.1 — Backend Deployment (Railway or Render)
```
Task: Deploy the NestJS backend to Railway (preferred) or Render:

1. Push all backend code to GitHub.
2. Connect the repo to Railway/Render.
3. Set environment variables in the platform dashboard:
   DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET,
   JWT_ACCESS_EXPIRES_IN=15m, JWT_REFRESH_EXPIRES_IN=7d,
   FRONTEND_URL=<your-vercel-url>, PORT=3001

4. Add a PostgreSQL database service (Railway provides this natively).
5. After deploy: run prisma migrate deploy and the seed script.
6. Note the backend URL: e.g., https://rbac-backend.railway.app
```

### Step 10.2 — Frontend Deployment (Vercel)
```
Task: Deploy the Next.js frontend to Vercel:

1. Push all frontend code to GitHub.
2. Import the repo in Vercel dashboard.
3. Set environment variables:
   NEXT_PUBLIC_API_URL=<your-railway-backend-url>

4. Deploy. Note the URL: e.g., https://rbac-frontend.vercel.app
5. Go back to backend and update FRONTEND_URL to match the Vercel URL.
6. Redeploy backend.
```

### Step 10.3 — Smoke Test (Production)
```
Task: Verify the following work on the live deployment:

1. Login with admin@rbac.com / Admin@123456 → see all sidebar items
2. Login with agent@rbac.com / Agent@123456 → see limited sidebar
3. As manager, open Permissions page → toggle an atom for the agent → re-login as agent → verify sidebar changed
4. Attempt to navigate to /users as agent (without permission) → get /403
5. Attempt to refresh the page → stay logged in (cookie re-hydrates auth)
6. Logout → cookie cleared → redirect to /login → refresh persists at /login
7. Hit /auth/login 6 times → get 429 response
```

### Step 10.4 — Final Git Tag
```
Commit message: "chore: production deployment — frontend on Vercel, backend on Railway"
Create a git tag: v1.0.0 on both repos.
```

---

## PHASE 11 — Final Submission Checklist

```
Before submitting, verify every item below:

REPOSITORIES
  [ ] rbac-frontend GitHub repo is public
  [ ] rbac-backend GitHub repo is public
  [ ] Both have meaningful commit history (not a single giant commit)
  [ ] Both have a clear README.md with setup instructions, env variable list, and live URL

FUNCTIONALITY
  [ ] Login page matches Figma design
  [ ] Full website is responsive on mobile, tablet, and desktop
  [ ] Dynamic sidebar shows only permitted nav items
  [ ] Permission matrix works — grant/revoke in real time, grant ceiling enforced
  [ ] Users CRUD works with correct role scoping
  [ ] Audit log records every admin/manager action
  [ ] JWT refresh flow works (cookie survives page reload)
  [ ] Rate limiting active on login
  [ ] 403 page shown for unauthorized route access

SECURITY
  [ ] No tokens in localStorage
  [ ] All API responses strip passwords
  [ ] CORS correctly configured
  [ ] Suspended users cannot log in

DEPLOYMENT
  [ ] Frontend live URL provided
  [ ] Backend live URL provided
  [ ] Seed data available in production (test accounts work)

SUBMISSION FORMAT
  [ ] GitHub Frontend repo link
  [ ] GitHub Backend repo link
  [ ] Live deployment link (frontend URL)
```

---

## APPENDIX — Permission Atoms Reference

| Atom | Label | Module |
|------|-------|--------|
| `view:dashboard` | View Dashboard | Dashboard |
| `view:users` | View Users | Users |
| `create:users` | Create Users | Users |
| `edit:users` | Edit Users | Users |
| `delete:users` | Delete/Ban Users | Users |
| `view:leads` | View Leads | Leads |
| `create:leads` | Create Leads | Leads |
| `edit:leads` | Edit Leads | Leads |
| `delete:leads` | Delete Leads | Leads |
| `view:tasks` | View Tasks | Tasks |
| `create:tasks` | Create Tasks | Tasks |
| `edit:tasks` | Edit Tasks | Tasks |
| `delete:tasks` | Delete Tasks | Tasks |
| `view:reports` | View Reports | Reports |
| `export:reports` | Export Reports | Reports |
| `view:audit-log` | View Audit Log | Audit Log |
| `view:customer-portal` | View Customer Portal | Customer Portal |
| `view:settings` | View Settings | Settings |
| `edit:settings` | Edit Settings | Settings |
| `view:permissions` | View Permissions | Permissions |
| `manage:permissions` | Manage Permissions | Permissions |

---

## APPENDIX — Default Role Permission Map

| Atom | ADMIN | MANAGER | AGENT | CUSTOMER |
|------|-------|---------|-------|----------|
| view:dashboard | ✅ | ✅ | ✅ | ❌ |
| view:users | ✅ | ✅ | ❌ | ❌ |
| create:users | ✅ | ✅ | ❌ | ❌ |
| edit:users | ✅ | ✅ | ❌ | ❌ |
| delete:users | ✅ | ❌ | ❌ | ❌ |
| view:leads | ✅ | ✅ | ✅ | ❌ |
| create:leads | ✅ | ✅ | ✅ | ❌ |
| edit:leads | ✅ | ✅ | ✅ | ❌ |
| delete:leads | ✅ | ✅ | ❌ | ❌ |
| view:tasks | ✅ | ✅ | ✅ | ❌ |
| create:tasks | ✅ | ✅ | ✅ | ❌ |
| edit:tasks | ✅ | ✅ | ✅ | ❌ |
| delete:tasks | ✅ | ✅ | ❌ | ❌ |
| view:reports | ✅ | ✅ | ❌ | ❌ |
| export:reports | ✅ | ✅ | ❌ | ❌ |
| view:audit-log | ✅ | ✅ | ❌ | ❌ |
| view:customer-portal | ✅ | ✅ | ❌ | ✅ |
| view:settings | ✅ | ✅ | ❌ | ❌ |
| edit:settings | ✅ | ❌ | ❌ | ❌ |
| view:permissions | ✅ | ✅ | ❌ | ❌ |
| manage:permissions | ✅ | ✅ | ❌ | ❌ |

---

*RBAC Dynamic Permissions System · Full-Stack Execution Prompt v2.0 · Digital Pylot*
