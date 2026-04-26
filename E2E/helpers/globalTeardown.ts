import { clearDatabase } from "./supabaseSeed";

async function globalTeardown() {
  console.log("\nRunning global teardown to clear test database lololol...");
  try {
    await clearDatabase();
    console.log("Database cleared successfully, YYAAAYY!");
  } catch (error) {
    console.error("Failed to clear database during teardown:", error);
  }
}

export default globalTeardown;
