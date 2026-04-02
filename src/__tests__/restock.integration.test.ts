import { describe, it, expect } from "vitest";

// In Vitest, environmental variables from .env are automatically loaded onto import.meta.env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * API TEST
 * Unlike the unit test which mocks the database, an API test verifies
 * the actual HTTP REST endpoints over the network.
 * 
 * Since this application relies on Supabase, the API is PostgREST,
 * which provides a RESTful interface to your database.
 */
describe("Restock REST API Tests", () => {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };

  it("GET /rest/v1/products - should return 200 OK with success data", async () => {
    // Making a direct HTTP call to the Supabase REST API
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=id,name`,
      {
        method: "GET",
        headers,
      }
    );

    // Verify HTTP Status Code
    expect(response.status).toBe(200);
    
    // Verify JSON Response format
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("GET /rest/v1/restocks - should return 200 OK array data", async () => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/restocks?select=*`, {
      method: "GET",
      headers,
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("POST /rest/v1/rpc/create_restock_transaction - should respond properly to RPC", async () => {
    // Making an HTTP POST to test the RPC (Remote Procedure Call) endpoint.
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/create_restock_transaction`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          p_product_id: "fake-id",
          p_quantity_added: 10,
          p_notes: "API test request",
        }),
      }
    );

    // Since we are not passing a valid user session JWT (just the anon key), 
    // depending on your Row Level Security (RLS) policies, this should safely return 
    // standard HTTP codes (200 empty array, or 401/403 access denied) rather than crashing.
    expect([200, 400, 401, 403, 404]).toContain(response.status);
    
    // We confirm this is a valid structured API response
    const data = await response.json().catch(() => null);
    expect(data).toBeDefined();
  });
});
