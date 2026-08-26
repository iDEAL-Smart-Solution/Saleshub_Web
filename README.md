# iDEAL SalesHub – Frontend

Marketing and sales management system for iDEAL. Built with React + TypeScript + Vite.

---

## Technology Stack

| Layer            | Technology                          |
|------------------|-------------------------------------|
| Framework        | React 19                            |
| Language         | TypeScript 6                        |
| Build tool       | Vite 8                              |
| Styling          | Tailwind CSS 4 (CSS-first config)   |
| Routing          | React Router 7                      |
| State management | Zustand 5                           |
| HTTP client      | Axios                               |
| Forms            | React Hook Form + Zod               |
| Charts           | Recharts                            |
| Icons            | Lucide React                        |
| Testing          | Vitest + Testing Library            |

---

## Prerequisites

- Node.js 20+
- npm 10+

---

## Setup

```bash
# 1. Clone and install
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend URL
```

---

## Environment Variables

| Variable            | Description                        | Example                        |
|---------------------|------------------------------------|--------------------------------|
| `VITE_API_BASE_URL` | Base URL of the .NET backend API   | `http://localhost:5000/api`    |

> Only `VITE_` prefixed variables are exposed to the browser. Never place secrets here.

---

## Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Run tests (single pass)
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## Folder Structure

```
src/
│
├── app/
│   ├── router/           # React Router configuration
│   └── providers/        # Root provider tree
│
├── assets/               # Static assets (logo, images)
│
├── components/
│   ├── common/           # Button, Input, Select, Card, Badge, Modal, PageHeader, Pagination
│   ├── feedback/         # Spinner, LoadingState, EmptyState, ErrorState
│   ├── tables/           # Table component
│   ├── forms/            # (Phase 2+) Form field components
│   └── charts/           # (Phase 2+) Chart wrappers
│
├── constants/
│   ├── roles.ts          # Role constants + hierarchy
│   └── routes.ts         # Route path constants
│
├── features/
│   ├── auth/             # Login, logout, token refresh (Phase 2)
│   ├── users/            # User management (later phases)
│   ├── products/         # Product CRUD (later phases)
│   ├── customers/        # Customer management (later phases)
│   ├── sales/            # Sales workflow (later phases)
│   ├── kpi/              # KPI display (later phases)
│   ├── performance/      # Performance display (later phases)
│   ├── commissions/      # Commission display (later phases)
│   └── notifications/    # In-app notifications (later phases)
│
├── hooks/
│   ├── usePageTitle.ts   # Sets document title
│   ├── useDisclosure.ts  # Boolean open/close state
│   └── usePagination.ts  # Pagination state
│
├── layouts/
│   ├── AuthLayout/       # Split-panel auth layout (branding + form)
│   └── DashboardLayout/  # Sidebar + header + main content
│
├── pages/
│   ├── auth/             # LoginPage, RegisterPage
│   ├── admin/            # Admin-scoped pages
│   ├── dev/              # Dev-scoped pages
│   ├── marketing-lead/   # MarketingLead-scoped pages
│   ├── marketer/         # Marketer-scoped pages
│   ├── errors/           # 401, 403, 404 pages
│   └── DashboardPage.tsx # Shared dashboard placeholder
│
├── services/
│   └── api/
│       ├── client.ts     # Axios instance (base URL, interceptors)
│       └── errorHandler.ts # Normalizes API errors
│
├── stores/
│   └── authStore.ts      # Zustand auth store (Phase 2 actions stubbed)
│
├── tests/
│   ├── setup.ts          # Vitest + Testing Library setup
│   ├── components/       # Component tests
│   ├── stores/           # Store tests
│   └── utils/            # Utility/constant tests
│
├── types/
│   ├── api.ts            # ApiResponse, PaginatedResponse, ApiError
│   └── auth.ts           # AuthUser, AuthTokens, AuthState
│
├── App.tsx               # Root component
└── main.tsx              # Entry point
```

---

## Architecture Principles

1. **Pages never call the API directly.** All HTTP communication goes through `services/api/`.
2. **The backend is authoritative.** KPI, commissions, sale qualification — all calculated server-side. The frontend only displays what the backend returns.
3. **Role-based access.** Use `ROLES` constants and `hasAtLeastRole()` from `constants/roles.ts`. Never scatter role strings.
4. **Feature-oriented structure.** Business logic lives in `features/`, not in pages or components.
5. **Generic components.** `components/` contains only reusable, domain-agnostic UI.
6. **Strict TypeScript.** No `any`. All API shapes are typed via DTOs in `types/`.

---

## Roles

| Role           | Privileges                                                    |
|----------------|---------------------------------------------------------------|
| `Dev`          | Highest — full system access, settings                       |
| `Admin`        | User management, sale confirmation, KPI management           |
| `MarketingLead`| Records sales, manages customers, views team performance     |
| `Marketer`     | Views own sales, KPI progress, commissions, notifications    |

---

## Backend

- .NET 10 ASP.NET Core Web API
- PostgreSQL + Entity Framework Core
- ASP.NET Identity + JWT + Refresh Tokens
- Hangfire (background jobs)
- Mailtrap (email delivery)

Configure `VITE_API_BASE_URL` to point to the running backend.
