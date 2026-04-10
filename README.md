# SmartStock

A responsive web-based inventory and restock management system built for small businesses. SmartStock replaces handwritten logs and spreadsheets with a centralized digital platform that lets business owners and staff monitor stock levels, manage products, and track restocking activity from any device.

## Overview

Many small retail stores, mini groceries, and supply shops still rely on manual methods to track inventory — leading to inaccurate records, delayed restocking, and lost sales. SmartStock addresses this by providing a modern dashboard where users can:

- Add, edit, categorize, and delete products with details such as name, price, quantity, category, and minimum stock threshold
- Automatically detect and flag low stock and out-of-stock items via status badges
- Log restock transactions (with an atomic server-side RPC) and browse a paginated restock history with product and date-range filters
- View summary stats: total products, low stock count, recently restocked items, and total inventory value
- Manage their account profile and notification preferences
- Install the app on any device as a Progressive Web App (PWA) for offline-capable, native-like access

## Tech Stack

| Layer          | Technology                                |
| -------------- | ----------------------------------------- |
| Framework      | React 19 + TypeScript 5.9                 |
| Build Tool     | Vite 7                                    |
| Styling        | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Routing        | React Router v7                           |
| Backend / Auth | Supabase (PostgreSQL + Auth + RLS)        |
| Icons          | Lucide React                              |
| Notifications  | Sonner                                    |
| PWA            | vite-plugin-pwa (Workbox)                 |
| Utilities      | tailwind-merge, tw-animate-css            |

## Project Structure

```
smart-stock/
├── E2E/                        # Playwright end-to-end tests
│   ├── inventory.spec.ts
│   └── restock.spec.ts
├── docs/                       # Project documentation
│   ├── backend-plan.md
│   ├── scd-final-project-guide.md
│   ├── supabase-schema-rls.sql
│   └── testing.md
├── server/
│   ├── functions/              # Server-side functions (planned)
│   │   ├── generateReport.ts
│   │   └── sendLowStockAlert.ts
│   └── utils/
│       └── emailService.ts
├── src/
│   ├── __tests__/              # Unit & integration tests (Vitest)
│   │   ├── productFactory.test.ts
│   │   ├── productsService.test.ts
│   │   ├── productsIntegration.test.ts
│   │   ├── restock.test.ts
│   │   ├── restock.integration.test.ts
│   │   └── setup.ts            # MSW-based test setup
│   ├── components/
│   │   ├── Layout.tsx          # App shell: sidebar, top bar, outlet
│   │   ├── RouteErrorBoundary.tsx
│   │   ├── auth/               # AuthShell, DisplayProfile
│   │   ├── dashboard/          # (planned dashboard widgets)
│   │   ├── inventory/          # ProductModal, DeleteConfirmationModal
│   │   ├── pwa/                # InstallPrompt (A2HS banner)
│   │   ├── restock/            # (planned restock sub-components)
│   │   └── ui/                 # Reusable UI primitives
│   │       ├── Button.tsx
│   │       ├── CheckboxField.tsx
│   │       ├── DropdownField.tsx  # Searchable custom dropdown
│   │       ├── FormDivider.tsx
│   │       ├── InputField.tsx
│   │       ├── Modal.tsx
│   │       ├── StatsCard.tsx
│   │       ├── TextAreaField.tsx
│   │       └── ToggleSwitch.tsx
│   ├── factories/
│   │   └── productFactory.ts   # DB ↔ domain mapping (Factory pattern)
│   ├── hooks/
│   │   ├── useProducts.ts      # Inventory CRUD hook
│   │   ├── useProfileCache.ts  # localStorage profile cache (10-min TTL)
│   │   └── useRestocks.ts      # Restock data & submission hook
│   ├── lib/
│   │   ├── cn.ts               # tailwind-merge helper
│   │   └── supabaseClient.ts   # Singleton Supabase client
│   ├── mocks/
│   │   └── handlers.ts         # MSW request handlers for testing
│   ├── pages/
│   │   ├── Dashboard.tsx       # Stats overview (mock data)
│   │   ├── Inventory.tsx       # Full CRUD, search, filter, sort
│   │   ├── Landing.tsx         # Public marketing page
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Restock.tsx         # Restock form + paginated history
│   │   ├── Settings.tsx        # Profile editor, notification toggles
│   │   └── NotFound.tsx        # 404 fallback
│   ├── router/
│   │   └── index.ts            # Route definitions, error boundaries
│   ├── services/
│   │   ├── productsService.ts  # Supabase CRUD + Proxy pattern
│   │   └── restockService.ts   # Restock queries & atomic RPC
│   ├── stores/
│   │   └── authStore.ts        # useSyncExternalStore auth state
│   ├── stories/                # Storybook component stories
│   ├── styles/
│   │   ├── tailwind.css
│   │   └── theme.css           # Design tokens & custom properties
│   └── types/
│       ├── index.ts            # Product, UserProfile, SignUpPayload
│       └── restock.ts          # RestockEntry, CreateRestockInput
├── .github/workflows/
│   ├── test.yml                # CI: unit & integration tests
│   └── playwright.yml          # CI: E2E tests
├── .storybook/                 # Storybook configuration
├── playwright.config.ts
├── vite.config.ts
├── vitest.config.ts
└── package.json
```

## Pages & Features

| Page           | Status | Description                                                                            |
| -------------- | ------ | -------------------------------------------------------------------------------------- |
| Landing        | Done   | Public marketing/entry page                                                            |
| Login / Signup | Done   | Supabase Auth with email confirmation and user-friendly error mapping                  |
| Dashboard      | UI Done | Stats overview with low-stock alerts and recent activity panels (currently mock data)  |
| Inventory      | Done   | Full CRUD via Supabase, search, category filter, multi-column sort, delete confirmation |
| Restock        | Done   | Restock form with searchable product dropdown, paginated history, date/product filters  |
| Settings       | UI Done | Profile info editor and notification toggles (UI complete, backend pending)            |
| Not Found      | Done   | 404 fallback page with route error boundary                                            |

## Authentication

- Supabase email/password sign-up and sign-in
- Email confirmation enforcement with clear user-facing messages
- Comprehensive auth error mapping: 25+ Supabase error codes translated to friendly messages (rate limits, MFA, SSO, etc.)
- User profile (full name, email, business name) loaded from Supabase user metadata
- Profile cached in `localStorage` with a 10-minute TTL to reduce redundant API calls
- Custom auth store built with React's `useSyncExternalStore` for tear-free reads

## Database

The Supabase PostgreSQL schema contains:

| Table                        | Purpose                                           |
| ---------------------------- | ------------------------------------------------- |
| `profiles`                   | User profile data (linked to `auth.users`)        |
| `products`                   | Inventory items with price, quantity, min_stock    |
| `restocks`                   | Restock transaction log with quantity and notes    |
| `notification_preferences`   | Per-user notification toggles                     |

**Key features:**
- Row Level Security (RLS) on all tables — users can only access their own data
- `create_restock_transaction` — atomic RPC that updates product quantity and inserts a restock record in a single transaction, preventing lost updates
- Automatic `updated_at` triggers on mutable tables
- Indexed columns for `user_id`, `name`, `category`, and `restocked_at`

## Progressive Web App (PWA)

SmartStock is installable as a PWA with:

- Auto-updating service worker (Workbox via `vite-plugin-pwa`)
- Offline caching of app shell, static assets, and Google Fonts
- NetworkFirst caching strategy for Supabase API responses (5-minute expiry)
- Native install prompt with iOS fallback instructions
- Standalone display mode with custom theme color

## Testing

| Type              | Tool                               | Scope                                                                          | Status |
| ----------------- | ---------------------------------- | ------------------------------------------------------------------------------ | ------ |
| Unit Testing      | Vitest + MSW                       | `productFactory`, `productsService`, `restockService`, store logic             | Done   |
| Integration Tests | Vitest (no mocks)                  | Real Supabase HTTP calls for products and restocks                             | Done   |
| Component Testing | Storybook 10 + Chromatic           | `Button`, `InputField`, `CheckboxField`, `DropdownField`, `ProductModal`       | Done   |
| E2E Testing       | Playwright (Chromium, Firefox, WebKit) | Inventory CRUD flows, restock submission and history verification           | Done   |

**Test commands:**

```bash
# Unit tests (with MSW mocking)
npm test -- --project unit

# Integration tests (real Supabase)
npm run test:integration

# Storybook component tests
npm test -- --project storybook

# E2E tests
npx playwright test

# All tests
npm test
```

## CI/CD

- **Unit & Integration tests** — GitHub Actions workflow (`.github/workflows/test.yml`)
- **E2E tests** — GitHub Actions workflow (`.github/workflows/playwright.yml`)
- **Visual regression** — Chromatic integration via Storybook

## Design Patterns (SCD-Aligned)

This section is aligned to the SCD final-project requirements by showing pattern category, implementation status, code location, and system-specific justification.

| Pattern        | Category   | Status      | SmartStock Usage                                                                                                              | Code Location                                                                                                  | Problem Without Pattern                                                                                         |
| -------------- | ---------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Singleton      | Creational | Implemented | One shared Supabase client used across auth, services, and layout code                                                        | `src/lib/supabaseClient.ts`                                                                                    | Repeated client setup, inconsistent configuration, and higher risk of auth/session behavior drift               |
| Factory Method | Creational | Implemented | `ProductFactory` maps between Supabase DB rows (`snake_case`) and domain models (`camelCase`) with centralized field defaults  | `src/factories/productFactory.ts`, used in `src/services/productsService.ts`                                   | Scattered object-construction logic in UI handlers, inconsistent defaults/validation, and tighter page coupling |
| Proxy          | Structural | Implemented | `ProductServiceProxy` wraps `ProductService` to enforce auth checks and input validation before every Supabase operation      | `src/services/productsService.ts`                                                                              | Auth verification scattered across pages, duplicated validation logic, and harder-to-test service boundaries    |
| Decorator      | Structural | Implemented | Reusable form-field wrappers add labels, icon/adornment support, and consistent UI behavior around base input/select/textarea | `src/components/ui/InputField.tsx`, `src/components/ui/DropdownField.tsx`, `src/components/ui/TextAreaField.tsx` | Repeated form UI logic across pages, inconsistent field behavior, and harder maintenance                        |

### Pattern Demonstration Notes (for SCD panel)

- **Singleton** can be demonstrated by tracing all Supabase usage back to one exported client instance in `supabaseClient.ts`.
- **Factory Method** can be demonstrated by stepping through `ProductFactory.createFromDb()` and `ProductFactory.toDb()` to show the mapping boundary.
- **Proxy** can be demonstrated by comparing `ProductService` (plain Supabase calls) vs `ProductServiceProxy` (auth + validation wrapper).
- **Decorator** can be demonstrated by showing multiple forms that reuse the same field wrappers with different props.

## Planned / In Progress

- [ ] **Smart Analysis — Inventory Insights Dashboard**
  - Restock frequency analysis (which products are restocked most often)
  - Low stock predictions based on historical restock intervals
  - Category breakdown (total value, product count, average stock per category)
  - Spending trends over time (weekly/monthly restock volume)
  - Stock health score (% in stock vs low vs out-of-stock)
- [ ] Connect Dashboard page to live Supabase data (replace mock stats/low-stock/activity)
- [ ] Wire up Settings page to persist notification preferences to `notification_preferences` table
- [ ] Implement `generateReport` server function for downloadable inventory reports
- [ ] Implement `sendLowStockAlert` email notifications via the `emailService` utility
- [ ] Real-time stock updates using Supabase subscriptions

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project with the required schema applied

### Installation

```bash
git clone https://github.com/auauron/SmartStock.git
cd SmartStock
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

For integration/E2E tests, create a `.env.test` with test credentials.

### Development

```bash
npm run dev          # Start Vite dev server at http://localhost:5173
npm run storybook    # Start Storybook at http://localhost:6006
```

### Build

```bash
npm run build        # TypeScript check + production build
npm run preview      # Preview the production build locally
```
