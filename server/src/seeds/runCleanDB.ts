import { db } from "../config/connection.js";
import { cleanDB } from "./cleanDB.js";

const runCleanDB = async () => {
  try {
    console.log("🚀 Waiting for database connection...");
    await db.asPromise();
    console.log("✅ Database connected! Cleaning database...");

    await cleanDB();

    console.log("✅ Database cleaning complete!");
    process.exit(0);  // Ensures script exits after cleaning
  } catch (error) {
    console.error("❌ Error during cleaning:", error);
    process.exit(1);
  }
};

// Ensure script doesn't exit prematurely
db.on("error", (err) => {
  console.error("❌ Database connection error:", err);
});

// Start cleaning
runCleanDB();
