# Material Stock Management System — Frontend

A modern React-based frontend for the **University Material Stock Management System**. The application provides the user interface for authentication, role-based access control, stock management workflows, reporting, auditing, notifications, FIFO valuation, and inventory reconciliation.

The frontend is integrated with the system's REST API and uses backend-driven authentication and authorization rather than local demo authentication.

## Overview

The frontend is responsible for:

* User authentication and session management
* Role-based and permission-based navigation
* User and role management
* Material and inventory management
* Procurement workflows
* Goods receiving and stock operations
* Reporting and audit interfaces
* Notifications
* FIFO valuation
* Inventory reconciliation
* Protected routes and authorization handling

The application communicates with the backend through a versioned REST API.

## Technology Stack

* **React**
* **Vite**
* **JavaScript**
* **REST API**
* **JWT-based authentication**
* **Role-based access control (RBAC)**

## Prerequisites

Before running the project, make sure you have:

* Node.js 20+
* npm
* A running instance of the Material Stock Management backend

## Installation

Clone the repository and navigate to the frontend directory:

```bash
git clone <repository-url>
cd <frontend-directory>
```

Install dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env` file from the provided `.env.example`:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure the backend API URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

The frontend expects the backend API to be available at the configured URL.

> **Security:** Never place passwords, JWT secrets, database credentials, private API keys, or other backend secrets in frontend environment variables or source code. Vite environment variables are exposed to the client application.

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at the Vite development URL shown in the terminal, typically:

```text
http://localhost:5173
```

## Production Build

Create an optimized production build:

```bash
npm run build
```

The generated production assets can then be deployed to a suitable static hosting or frontend platform.

## Backend Integration

The frontend communicates with the backend using the versioned API base URL:

```text
/api/v1
```

Authentication is backend-driven.

The login flow sends credentials to:

```text
POST /api/v1/auth/login
```

After successful authentication, the frontend uses the returned access token for protected requests:

```http
Authorization: Bearer <token>
```

The frontend also handles authenticated session state, logout, password management, role-based access, and permission-based access.

## Authorization

The application uses role and permission information returned by the backend to control access to protected functionality.

Permission checks are designed around the application's canonical permission identifiers, allowing the frontend navigation and protected routes to remain aligned with the backend authorization system.

Examples include:

```text
manage_users
manage_roles
view_stock
receive_stock
issue_stock
view_reports
view_audit
```

Authorization failures are handled separately from expired or invalid authentication sessions.

## Application Structure

The frontend is organized around reusable React components, application context, protected routes, pages, configuration, and API integration.

Key areas include:

```text
src/
├── components/
├── config/
├── context/
├── pages/
├── routes/
└── ...
```

The exact structure may evolve as additional system modules are integrated.

## API Requirements

The frontend requires the backend application to be running before backend-dependent functionality can be used.

Default local backend:

```text
http://localhost:5000
```

Default API base URL:

```text
http://localhost:5000/api/v1
```

## Deployment

For production deployment:

1. Configure the production API URL.
2. Build the application with `npm run build`.
3. Deploy the generated build to the selected frontend hosting platform.
4. Configure the backend CORS policy to allow the production frontend origin.
5. Ensure no secrets are exposed through frontend environment variables.

## Project Status

**Status:** Backend-integrated frontend

The authentication flow and application modules are connected to the backend API, with reporting, audit, notifications, FIFO valuation, and reconciliation interfaces using live API integration.

## Development Notes

This frontend is part of a larger **University Material Stock Management System** consisting of:

* React frontend
* Node.js / Express backend
* PostgreSQL database
* Prisma ORM
* JWT authentication
* RBAC authorization

The frontend and backend communicate through documented REST API contracts.

## License

This project was developed as part of an internship project and is intended for educational and project demonstration purposes.
