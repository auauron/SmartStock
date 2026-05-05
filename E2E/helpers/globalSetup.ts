import { clearDatabase } from "./supabaseSeed";

async function globalSetup() {
  console.log("\nRunning global setup to clear test database...");

  try {
    await clearDatabase();
    console.log("Database cleared successfully before E2E tests.");
  } catch (error) {
    console.error("Failed to clear database during setup:", error);
    throw error;
  }
}

export default globalSetup;
