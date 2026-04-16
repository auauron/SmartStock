# SmartStock Backend Plan

This document is the backend roadmap for SmartStock. It is written for the current project state, where Supabase authentication already exists, while inventory and restock data still use local or mock state in the frontend.

## Current State

What is already in place:

- Supabase client setup in `src/lib/supabaseClient.ts`
- Authentication flow using Supabase Auth
- Profile caching in local storage
- Inventory and restock UI flows already exist in the frontend

What is not yet implemented:

- Database-backed inventory management
- Database-backed restock history
- Backend data validation and ownership rules
- Low-stock email alerts
- Report generation

## Main Backend Goal

Move the app from local frontend state to a real backend flow built on Supabase, while keeping the implementation simple, defendable, and aligned with course requirements.

## What To Do First

The first backend task should be the data model and backend contract.

Do this before email alerts, report generation, or other utility features.

Reason:

- Inventory and restocks are the core business data of the app
- Alerts and reports depend on accurate inventory and restock data
- A stable schema makes frontend integration and testing much easier
- It avoids rewriting the backend twice

## Recommended Build Order

### Phase 1: Backend Foundation

1. Define the database schema in Supabase.
2. Add relationships, constraints, and basic validation rules.
3. Add Row Level Security policies so users can only access their own data.
4. Define TypeScript types for backend entities.

### Phase 2: Core Inventory Backend

1. Implement inventory read and write functions.
2. Connect the Inventory page to live Supabase data.
3. Replace local inventory arrays with backend reads and writes.
4. Handle create, edit, delete, search, and filtering against stored data.

### Phase 3: Core Restock Backend

1. Implement restock creation and restock history retrieval.
2. Update inventory quantity when a restock is added.
3. Connect the Restock page to the database.
4. Keep restock history tied to inventory records.

### Phase 4: Account and Preference Data

1. Persist profile-related business data if needed outside Auth metadata.
2. Add notification preference storage if low-stock alerts will be configurable.
3. Connect the Settings page to real backend fields where appropriate.

### Phase 5: Utility Features

1. Implement low-stock detection logic.
2. Implement the low-stock alert backend flow.
3. Implement report generation.
4. Add export and import support if needed.

### Phase 6: Testing and Stabilization

1. Add unit tests for pure backend helpers and factories.
2. Add API tests for backend-facing service functions.
3. Add Storybook coverage for reusable frontend components involved in backend flows.
4. Add Playwright tests for full user flows once backend integration is stable.

## Proposed Data Model

Keep the initial schema small and focused.

### `profiles`

Purpose:

- Extend user information beyond Auth when needed

Suggested fields:

- `id` or `user_id`
- `full_name`
- `business_name`
- `created_at`
- `updated_at`

### `inventories`

Purpose:

- Store the user inventory catalog

Suggested fields:

- `id`
- `user_id`
- `name`
- `category`
- `price`
- `quantity`
- `min_stock`
- `created_at`
- `updated_at`

Suggested rules:

- `price >= 0`
- `quantity >= 0`
- `min_stock >= 0`

### `restocks`

Purpose:

- Track each restock event for an item

Suggested fields:

- `id`
- `inventory_id`
- `user_id`
- `quantity_added`
- `notes`
- `restocked_at`
- `created_at`

Suggested rules:

- `quantity_added > 0`
- foreign key from `inventory_id` to `inventories.id`

### `notification_preferences`

Purpose:

- Support settings for alerts later

Suggested fields:

- `user_id`
- `low_stock_alerts`
- `restock_confirmations`
- `email_notifications`
- `updated_at`

## Access Control and Security

Use Supabase Row Level Security from the beginning.

Minimum policy direction:

- users can only read their own inventory
- users can only insert items for themselves
- users can only update their own inventory
- users can only delete their own inventory
- users can only read and create their own restock history
- users can only manage their own preferences

This matters for the project defense because it shows backend and security awareness, not just frontend functionality.

## Suggested Backend Code Structure

The current `server/functions` and `server/utils` files are empty. That is fine for now, but they should not be the first thing you implement.

Recommended direction:

- Keep `src/lib/supabaseClient.ts` as the shared Singleton client
- Add a small frontend-facing service layer for database operations
- Use the server functions later for utility workflows such as alerts and reports

Suggested future structure:

```text
src/
  lib/
    supabaseClient.ts
  services/
    inventoryService.ts
    restocksService.ts
    settingsService.ts
  factories/
    inventoryFactory.ts
    createRestockEntry.ts

server/
  functions/
    sendLowStockAlert.ts
    generateReport.ts
  utils/
    emailService.ts
```

## What To Do With The Empty Server Files

Current recommendation:

- Keep `server/functions/sendLowStockAlert.ts`
- Keep `server/functions/generateReport.ts`
- Keep `server/utils/emailService.ts`
- Do not implement them first

Reason:

- They are still valid planned backend features
- They will make more sense after inventory and restocks are connected to real data
- Removing them now does not improve the project in a meaningful way

If the structure starts to feel confusing later, it is reasonable to move or rename them once the real backend flow is in place.

## Course Requirement Alignment

### Testing Subject

Planned testing strategy for backend-related work:

- Unit testing with Vitest for factories, validation helpers, and data transformation logic
- API testing with Vitest and MSW for service-layer calls to Supabase-backed flows
- Storybook coverage for reusable components involved in data entry and backend-connected UI
- Playwright for end-to-end flows such as sign in, create item, edit item, delete item, and add restock

### Components Subject

Required patterns should be demonstrated in a way that matches the current architecture.

#### Singleton Pattern

Use `src/lib/supabaseClient.ts` as the shared application-wide client.

#### Factory Method Pattern

Add typed factory functions for backend-facing entity creation, such as:

- `inventoryFactory`
- `createRestockEntry`

These functions should centralize defaults, shaping, and validation before data is stored or sent.

#### Decorator Pattern

Use reusable UI wrappers around base fields and interactive inputs, especially in forms used for inventory and restock data entry.

## First Backend Coding Session Checklist

Use this as the first practical session plan:

1. Create the Supabase tables for `inventories` and `restocks`.
2. Add constraints and relationships.
3. Add Row Level Security policies.
4. Create shared TypeScript types for inventory and restock records.
5. Add `inventoryService.ts` with fetch, create, update, and delete functions.
6. Connect the Inventory page to those functions.

If there is still time after that:

7. Add `restocksService.ts`.
8. Connect the Restock page to backend data.

## What Not To Start With

Avoid starting the backend with these:

- email sending
- report export
- advanced analytics
- a separate custom backend server that duplicates Supabase capabilities

That would increase complexity too early and make the project harder to finish cleanly.

## Final Recommendation

If only one thing is started first, it should be this:

Build the Supabase schema and connect Inventory to real database operations.

That gives the project the biggest improvement, creates the base for Restock, and makes later features like alerts, reports, and tests much more straightforward.
