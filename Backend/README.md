# Material Stock Management System — Backend

REST API backend for the **University Material Stock Management System**, built with Node.js, Express, PostgreSQL, and Prisma.

The backend provides the core application foundation for authentication, authorization, user and role management, session management, password management, and audit logging, while establishing the architecture for the system's future procurement, inventory, receiving, issuing, reporting, and reconciliation modules.

## Overview

The backend follows a modular monolith architecture and exposes a versioned REST API under:

```text
/api/v1
```

The current foundation includes:

* Authentication and authorization
* JWT access authentication
* Database-backed session management
* Role-based access control (RBAC)
* Permission-based authorization
* User management
* Role and permission management
* Password hashing and password management
* Password reset workflow
* Request validation
* Centralized error handling
* Audit-log foundation
* PostgreSQL database integration
* Prisma ORM
* Seed data and administrator setup

The backend intentionally separates authentication and authorization concerns from application business modules.

## Architecture

The system follows a three-tier architecture:

```text
┌──────────────────────────────┐
│        React Frontend        │
└──────────────┬───────────────┘
               │ REST / JSON
               ▼
┌──────────────────────────────┐
│     Node.js + Express API    │
│                              │
│  Authentication             │
│  Authorization / RBAC       │
│  Validation                 │
│  Business Modules            │
│  Audit Logging               │
└──────────────┬───────────────┘
               │ Prisma
               ▼
┌──────────────────────────────┐
│         PostgreSQL           │
└──────────────────────────────┘
```

The project is implemented as a **modular monolith**, rather than a microservices architecture.

## Technology Stack

| Technology | Purpose                 |
| ---------- | ----------------------- |
| Node.js    | JavaScript runtime      |
| Express.js | REST API framework      |
| PostgreSQL | Relational database     |
| Prisma     | ORM and database access |
| JWT        | Access authentication   |
| bcrypt     | Password hashing        |
| Zod        | Request validation      |
| Helmet     | HTTP security headers   |
| npm        | Package management      |

## Requirements

* Node.js 20+
* PostgreSQL 14+
* npm

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd <backend-directory>
```

Install dependencies:

```bash
npm install
```

## Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE material_stock_management;
```

Or, if `createdb` is available:

```bash
createdb material_stock_management
```

## Environment Configuration

Create a local environment file from the example:

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### Windows CMD

```cmd
copy .env.example .env
```

Configure the required values:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/material_stock_management?schema=public"

JWT_SECRET="use-a-long-random-secret-at-least-32-characters"

SEED_ADMIN_PASSWORD="your-secure-admin-password"
```

### Environment Security

Never commit `.env` or production credentials to source control.

Use strong, randomly generated secrets for:

* `JWT_SECRET`
* Database credentials
* Administrator credentials

## Prisma Setup

Generate the Prisma client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

Seed the database:

```bash
npm run prisma:seed
```

The complete local database setup can also be performed with:

```bash
npm run db:setup
```

For an existing deployment database:

```bash
npm run prisma:generate
npm run prisma:deploy
```

## Running the Server

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The default API server is:

```text
http://localhost:5000
```

Health check:

```http
GET /health
```

API documentation:

```text
http://localhost:5000/api-docs
```

OpenAPI document:

```text
http://localhost:5000/api-docs/openapi.json
```

## Authentication

Authentication uses JWT access tokens combined with database-backed sessions.

The authentication flow is:

```text
Client
  │
  │ username + password
  ▼
POST /api/v1/auth/login
  │
  ├── Validate request
  ├── Find user
  ├── Verify bcrypt password hash
  ├── Create database session
  └── Issue JWT
  │
  ▼
Client receives token
  │
  │ Authorization: Bearer <token>
  ▼
Protected API
  │
  ├── Verify JWT
  └── Verify active database session
```

Logout revokes the database session, preventing the associated JWT from being used again even if the token has not yet expired.

## Role-Based Access Control

Authorization is enforced server-side using roles and permissions.

The system includes the following roles:

* Administrator
* PAO
* Procurement Officer
* Inspector
* Storekeeper
* Stock Clerk
* Department User
* Department Head
* Accounts Officer
* Stock Auditor
* Security Officer

Public registration creates a **Department User** account. Privileged roles cannot be self-assigned through public signup.

Role assignment is performed through protected user-management functionality.

## Permissions

The backend uses the same canonical permission identifiers expected by the frontend.

Examples:

```text
view_dashboard
manage_users
manage_roles
receive_stock
inspect_stock
view_stock
issue_stock
view_requisitions
approve_requisition
view_reports
view_audit
```

Permission identifiers should remain consistent between the frontend and backend to prevent authorization and integration mismatches.

## API Endpoints

### Authentication

| Method | Endpoint                       | Description                      |
| ------ | ------------------------------ | -------------------------------- |
| POST   | `/api/v1/auth/login`           | Authenticate a user              |
| POST   | `/api/v1/auth/signup`          | Create a Department User account |
| POST   | `/api/v1/auth/forgot-password` | Request password reset           |
| POST   | `/api/v1/auth/reset-password`  | Reset password                   |
| GET    | `/api/v1/auth/me`              | Get authenticated user           |
| POST   | `/api/v1/auth/logout`          | Revoke current session           |
| POST   | `/api/v1/auth/change-password` | Change password                  |

### User Management

| Method | Endpoint                      | Permission     |
| ------ | ----------------------------- | -------------- |
| GET    | `/api/v1/users`               | `manage_users` |
| GET    | `/api/v1/users/:userId`       | `manage_users` |
| PATCH  | `/api/v1/users/:userId`       | `manage_users` |
| PUT    | `/api/v1/users/:userId/roles` | `manage_users` |

### Roles & Permissions

| Method | Endpoint                    | Permission     |
| ------ | --------------------------- | -------------- |
| GET    | `/api/v1/roles`             | `manage_roles` |
| GET    | `/api/v1/roles/permissions` | `manage_roles` |

### Audit

| Method | Endpoint             | Permission   |
| ------ | -------------------- | ------------ |
| GET    | `/api/v1/audit-logs` | `view_audit` |

## Example Authentication Request

```http
POST /api/v1/auth/login
Content-Type: application/json
```

```json
{
  "username": "admin",
  "password": "your-password",
  "remember": false
}
```

Example response:

```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "<uuid>",
      "username": "admin",
      "email": "admin@university.local",
      "fullName": "System Administrator",
      "department": "Administration",
      "roles": ["Administrator"],
      "role": "Administrator",
      "permissions": ["..."]
    },
    "expiresAt": "..."
  }
}
```

The `roles` property represents the canonical backend role representation. The `role` property is retained as a compatibility field for the existing React frontend.

## Protected Requests

Authenticated requests must include:

```http
Authorization: Bearer <jwt>
```

Example:

```http
GET /api/v1/auth/me
Authorization: Bearer <jwt>
```

## Security

The backend includes several security controls:

* Passwords are never stored in plaintext.
* Passwords are hashed using bcrypt.
* JWT authentication is combined with database session validation.
* Logout revokes the active database session.
* Password changes and resets invalidate active sessions.
* Password reset tokens are stored as SHA-256 hashes.
* Password reset tokens expire.
* Public signup cannot assign privileged roles.
* RBAC authorization is enforced server-side.
* Request bodies are validated using Zod.
* HTTP security headers are enabled through Helmet.
* CORS is restricted to the configured frontend origin.
* Authentication and user-management actions provide an audit-log foundation.

## Password Reset

During development, a reset token may be returned when explicitly enabled:

```env
NODE_ENV=development
RETURN_RESET_TOKEN_IN_DEVELOPMENT=true
```

This behavior is intended for development only.

In production:

```env
RETURN_RESET_TOKEN_IN_DEVELOPMENT=false
```

The reset token must not be exposed through the production API.

## Project Structure

```text
backend/
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   └── env.js
    ├── lib/
    │   └── prisma.js
    ├── middleware/
    │   ├── auth.js
    │   ├── authorization.js
    │   ├── errorHandler.js
    │   ├── notFound.js
    │   └── validate.js
    ├── utils/
    │   ├── asyncHandler.js
    │   ├── httpError.js
    │   ├── jwt.js
    │   ├── password.js
    │   └── tokens.js
    ├── validators/
    │   ├── auth.schemas.js
    │   ├── role.schemas.js
    │   └── user.schemas.js
    └── modules/
        ├── audit/
        ├── auth/
        ├── roles/
        └── users/
```

## Verification

Before deployment, run the project's verification and production-readiness commands:

```bash
npm install
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
npm run verify:permissions
npm test
npm start
```

## Current Scope

The current backend foundation focuses on authentication, authorization, users, roles, permissions, sessions, password management, and audit infrastructure.

The architecture is designed to support the system's broader business modules, including:

* Procurement
* Purchase requisitions
* Purchase orders
* Suppliers
* Inventory
* Goods receiving
* Inspection workflows
* Stock issuing
* Stock transfers
* Stock taking
* FIFO valuation
* Reporting
* Gate passes
* Notifications

These modules are implemented progressively on top of the established backend foundation.

## Frontend Integration

The backend is designed to integrate with the existing React frontend without unnecessarily changing the frontend's established contracts.

The frontend uses:

```text
http://localhost:5000/api/v1
```

during local development.

The backend returns normalized user, role, and permission information required by the frontend's protected routes and authorization helpers.

## Production Deployment

Before deploying to production:

1. Use a strong random `JWT_SECRET`.
2. Use secure database credentials.
3. Configure the production `DATABASE_URL`.
4. Set the correct frontend origin through `FRONTEND_URL`.
5. Enable HTTPS.
6. Ensure development reset-token behavior is disabled.
7. Run Prisma deployment migrations.
8. Run the project's automated verification and tests.
9. Never commit `.env` or production secrets to Git.

## Project Status

**Status:** Backend foundation completed and integrated with the frontend.

The backend establishes the authentication, authorization, database, session, security, and API foundations required for the Material Stock Management System.

## License

This project was developed as part of an internship project and is intended for educational and project demonstration purposes.
