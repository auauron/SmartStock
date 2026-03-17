# SmartStock

A responsive web-based inventory and restock management system built for small businesses. SmartStock replaces handwritten logs and spreadsheets with a centralized digital platform that lets business owners and staff monitor stock levels, manage products, and track restocking activity from any device.

## Overview

Many small retail stores, mini groceries, and supply shops still rely on manual methods to track inventory — leading to inaccurate records, delayed restocking, and lost sales. SmartStock addresses this by providing a modern dashboard where users can:

- Add, edit, categorize, and delete products with details such as name, price, quantity, category, and minimum stock threshold
- Automatically detect and flag low stock and out-of-stock items
- Log restock transactions and maintain a full restock history
- View summary stats: total products, low stock count, recently restocked items, and total inventory value
- Manage their account profile and notification preferences

## Tech Stack

| Layer          | Technology                                |
| -------------- | ----------------------------------------- |
| Framework      | React 19 + TypeScript                     |
| Build Tool     | Vite                                      |
| Styling        | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Routing        | React Router v7                           |
| Backend / Auth | Supabase (PostgreSQL + Auth)              |
| Icons          | Lucide React                              |
| Notifications  | Sonner                                    |
| Utilities      | tailwind-merge, tw-animate-css            |

## Pages & Features

| Page           | Status      | Description                                                                                           |
| -------------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| Landing        | Done        | Public marketing/entry page                                                                           |
| Login / Signup | Done        | Supabase Auth with email confirmation and user-friendly error messages                                |
| Dashboard      | In Progress | Stats overview; currently displays mock data                                                          |
| Inventory      | In Progress | Full CRUD (add, edit, delete), search, and category filter; currently uses local state with mock data |
| Restock        | In Progress | Restock entry form and history log; currently uses local state with mock data                         |
| Settings       | Done (UI)   | Profile info editor and notification toggles                                                          |
| Not Found      | Done        | 404 fallback page with route error boundary                                                           |

## Authentication

- Supabase email/password sign-up and sign-in
- Email confirmation enforcement with clear user-facing messages
- User profile (full name, email, business name) loaded from Supabase user metadata
- Profile cached in `localStorage` with a 10-minute TTL to reduce redundant API calls
- Custom auth store built with React's `useSyncExternalStore`

## Planned / In Progress

- Connect inventory and restock pages to live Supabase data
- Implement `generateReport` server function for downloadable inventory reports
- Implement `sendLowStockAlert` email notifications via the `emailService` utility
- Real-time stock updates using Supabase subscriptions

## Testing Plan

Planned testing coverage to satisfy course requirements:

| Type               | Tool                               | Scope                                                                        |
| ------------------ | ---------------------------------- | ---------------------------------------------------------------------------- |
| Unit Testing       | Vitest                             | Utility functions, store logic, hooks                                        |
| API Testing        | Vitest + MSW (Mock Service Worker) | Supabase client calls and server functions                                   |
| Component Testing  | Storybook                          | UI component library (`Button`, `InputField`, `Modal`, `StatsCard`, etc.)    |
| End-to-End Testing | Playwright                         | Critical user flows: sign up, log in, add/edit/delete product, log a restock |

## Design Patterns Plan (SCD-Aligned)

This section is aligned to the SCD final-project requirements by showing pattern category, implementation status, code location, and system-specific justification.

| Pattern        | Category   | Status                  | SmartStock Usage                                                                                                              | Code Location                                                                                                  | Problem Without Pattern                                                                                         |
| -------------- | ---------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Singleton      | Creational | Implemented             | One shared Supabase client used across auth and data-access code                                                              | `src/lib/supabaseClient.ts`                                                                                    | Repeated client setup, inconsistent configuration, and higher risk of auth/session behavior drift               |
| Decorator      | Structural | Implemented             | Reusable form-field wrappers add labels, icon/adornment support, and consistent UI behavior around base input/select/textarea | `src/components/ui/InputField.tsx`, `src/components/ui/SelectField.tsx`, `src/components/ui/TextAreaField.tsx` | Repeated form UI logic across pages, inconsistent field behavior, and harder maintenance                        |
| Factory Method | Creational | Planned (next priority) | Typed creation functions for product/restock entities with centralized defaults and validation                                | Planned in `src/factories` and to be used from `src/pages/Inventory.tsx`, `src/pages/Restock.tsx`              | Scattered object-construction logic in UI handlers, inconsistent defaults/validation, and tighter page coupling |

### Pattern Demonstration Notes (for SCD panel)

- Singleton can be demonstrated by tracing all Supabase usage back to one exported client instance.
- Decorator can be demonstrated by showing multiple forms that reuse the same field wrappers with different props.
- Factory Method will be demonstrable after factory functions are implemented and wired into product/restock creation flows.
