# SmartStock — Testing Documentation

## Overview

This document covers all tests implemented for the SmartStock restock feature, including the test setup, what each test verifies, and how the testing infrastructure is organized.

---

## Test Stack

| Tool | Role |
|------|------|
| **Vitest** | Test runner for both unit and integration tests |
| **Vite** | Automatically loads `.env.test` during test runs |
| **@supabase/supabase-js** | Typed client used in integration tests |
| **vi.mock** | Mocking library built into Vitest (replaces Supabase in unit tests) |

---

## File Structure

```
src/__tests__/
├── restock.test.ts              # Unit tests (no DB, fully mocked)
├── restock.integration.test.ts  # API integration tests (real test DB)
└── utils/
    └── db.ts                    # Shared test DB client and clearDatabase utility

.env.test                        # Test environment variables (SmartStock-test DB)
vite.config.ts                   # Vitest project config (unit + storybook)
.github/workflows/test.yml       # GitHub Actions CI (runs unit tests on PR)
```

---

## Environment Setup

Testing uses a **separate Supabase project** (`SmartStock-test`) so the production database is never touched.

**`.env.test`** — loaded automatically by Vitest during test runs:
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

> **Note:** Integration tests require RLS to be disabled on the test DB, since they use the anon key without a user session.

---

## Test Utility — `src/__tests__/utils/db.ts`

Shared setup file used by integration tests.

```ts
export const testClient = createClient(supabaseUrl, supabaseKey);
export const clearDatabase = async () => { ... }
```

| Export | Purpose |
|--------|---------|
| `testClient` | Supabase JS client pointed at the SmartStock-test DB |
| `clearDatabase()` | Wipes `restocks` then `products` in FK-safe order |

`clearDatabase()` is called in `beforeAll` and `afterAll` to guarantee every test run starts and ends with a clean slate.

---

## 1. Unit Tests — `restock.test.ts`

**Type:** Unit  
**Total tests:** 8  
**Database used:** None (fully mocked)  
**Command:** `npx vitest run --project unit`

### How it works

The Supabase client is replaced entirely with a fake before any test runs:

```ts
vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    auth: { getUser: vi.fn() },
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));
```

No network calls are made. Tests verify the **logic inside `restockService.ts`** — mapping, error handling, and data transformation.

### Test Cases

#### `getRestockProducts`
| # | Test | What it checks |
|---|------|----------------|
| 1 | User not signed in | Throws `"You must be signed in to manage restocks."` |
| 2 | DB fetch fails | Propagates the Supabase error message |
| 3 | Success | Returns correctly mapped `{ id, name }[]` array |

#### `getRestockHistory`
| # | Test | What it checks |
|---|------|----------------|
| 4 | DB fetch fails | Propagates the Supabase error message |
| 5 | Success | Maps both object and array `products` join shapes, defaults `notes` to `""` |

#### `createRestock`
| # | Test | What it checks |
|---|------|----------------|
| 6 | RPC fails | Propagates the Supabase RPC error |
| 7 | RPC returns empty array | Throws `"Failed to create restock entry."` |
| 8 | Success | Calls `create_restock_transaction` with correct params, returns mapped entry |

---

## 2. API Integration Tests — `restock.integration.test.ts`

**Type:** API Integration  
**Total tests:** 4  
**Database used:** `SmartStock-test` (real Supabase DB)  
**Command:** `npx vitest run src/__tests__/restock.integration.test.ts --project unit`

### How it works

Unlike unit tests, these tests connect to a real database over the network. The Supabase JS client (`testClient`) performs actual inserts, reads, and deletes.

**Lifecycle:**
```
beforeAll → clearDatabase() → seed test product (FK required for restocks)
  ↓
tests run in order (POST → GET by ID → GET all → DELETE)
  ↓
afterAll  → clearDatabase()
```

A dummy user (`TEST_USER_ID = "11111111-1111-1111-1111-111111111111"`) must exist in `auth.users` on the test DB (created via the seed SQL in `docs/supabase-schema-rls.sql`).

### Test Cases

| # | Test | What it checks |
|---|------|----------------|
| 1 | `POST restocks` | Creates a restock row, confirms `quantity_added`, `notes`, and `product_id` |
| 2 | `GET restocks by ID` | Fetches the created row by UUID, confirms data integrity |
| 3 | `GET restocks` (list) | Confirms response is a non-empty array |
| 4 | `DELETE restocks` | Deletes the row, then verifies it no longer exists |

### Why a separate test DB?

`clearDatabase()` deletes all rows from `restocks` and `products` on every run. Running this against the main database would permanently erase all real user data.

---

## CI — GitHub Actions

**File:** `.github/workflows/test.yml`  
**Trigger:** Every pull request targeting `main` or `develop`  
**What runs:** Unit tests only (`--project unit`)

Unit tests are used in CI because:
- They require no database credentials or secrets
- They run entirely in memory (no network)
- They complete in under 1 second

Integration tests are run locally before pushing, since they require a live database connection.

---

## Running Tests

```bash
# Run all tests (unit + storybook)
npm test

# Run unit tests only (fast, no DB)
npx vitest run --project unit

# Run integration tests only (requires SmartStock-test DB)
npx vitest run src/__tests__/restock.integration.test.ts --project unit

# Run a specific test file
npx vitest run src/__tests__/restock.test.ts --project unit
```
