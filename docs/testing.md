# SmartStock — Testing Documentation

## Overview

This document covers all tests implemented for the SmartStock inventory and restock features, including the test setup, what each test verifies, and how the testing infrastructure is organized.

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
├── inventoryFactory.test.ts     # Unit tests for data normalization
├── inventoryService.test.ts     # Proxy and service unit tests
├── restock.test.ts              # Unit tests for restock logic
├── inventoryIntegration.test.ts # API integration tests (real test DB)
└── utils/
    └── db.ts                    # Shared test DB client and clearDatabase utility

.env.test                        # Test environment variables (SmartStock-test DB)
vite.config.ts                   # Vitest project config
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
| `clearDatabase()` | Wipes `restocks` then `inventories` in FK-safe order |

`clearDatabase()` is called in `beforeAll` and `afterAll` to guarantee every test run starts and ends with a clean slate.

---

## 1. Unit Tests

**Type:** Unit  
**Database used:** None (fully mocked)  
**Command:** `npx vitest run`

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

No network calls are made. Tests verify the **domain logic** — mapping, proxy behavior, and data transformation.

---

## 2. API Integration Tests

**Type:** API Integration  
**Database used:** `SmartStock-test` (real Supabase DB)  
**Command:** `npx vitest run src/__tests__/inventoryIntegration.test.ts`

### How it works

Unlike unit tests, these tests connect to a real database over the network. The Supabase JS client (`testClient`) performs actual inserts, reads, and deletes.

**Lifecycle:**
```
beforeAll → clearDatabase() → seed test inventory (FK required for restocks)
  ↓
tests run in order (POST → GET by ID → GET all → DELETE)
  ↓
afterAll  → clearDatabase()
```

A dummy user (`TEST_USER_ID = "11111111-1111-1111-1111-111111111111"`) must exist in `auth.users` on the test DB.

### Why a separate test DB?

`clearDatabase()` deletes all rows from `restocks` and `inventories` on every run. Running this against the main database would permanently erase all real user data.

---

## CI — GitHub Actions

**File:** `.github/workflows/test.yml`  
**Trigger:** Every pull request targeting `main`  
**What runs:** Unit tests only

Unit tests are used in CI because:
- They require no database credentials or secrets
- They run entirely in memory (no network)
- They complete in under 2 seconds

Integration tests are run locally before pushing, since they require a live database connection.

---

## Running Tests

```bash
# Run all tests
npm test

# Run a specific test file
npx vitest src/__tests__/inventoryIntegration.test.ts
```
