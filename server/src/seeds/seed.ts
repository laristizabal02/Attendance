import { db } from "../config/connection.js";
import { seedPersons } from "./seedPeople.js";
import { seedUsers } from "./seedUsers.js";
import { seedCourses } from "./seedCourses.js";
import { seedInstructors } from "./seedInstructors.js";
import { seedParents } from "./seedParents.js";
import { seedStudents } from "./seedStudents.js";

const seedDatabase = async () => {
  try {
    console.log("🚀 Waiting for database connection...");

    await db.asPromise();
    console.log("✅ Database connected! Starting seeding process...");
    const seedAll = false;
    await seedPersons();
    if (seedAll) {
      await seedUsers();
      await seedCourses();
      await seedInstructors();
      await seedParents();
      await seedStudents();
    }

    console.log("🎉 Database seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
};

// Ensure script doesn't exit prematurely
db.on("error", (err) => {
  console.error("❌ Database connection error:", err);
});

// Start seeding
seedDatabase();
