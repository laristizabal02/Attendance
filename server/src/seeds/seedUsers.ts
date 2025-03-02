import { Person, User } from "../models/index.js";
import userData from "../data/userData.json" assert { type: "json" };

export const seedUsers = async () => {
  try {
    console.log("🔄 Seeding Users...");

    await User.deleteMany({});
    const usersToInsert = [];

    for (const user of userData) {
      // Ensure the associated Person exists
      const person = await Person.findOne({ firstName: user.firstName, lastName: user.lastName });

      if (!person) {
        console.warn(`⚠️ No matching Person found for User: ${user.username}`);
        continue; // Skip user if no Person is found
      }

      usersToInsert.push({
        username: user.username,
        email: user.email,
        password: user.password,
        person: person._id, // Link to existing Person
      });
    }

    await User.insertMany(usersToInsert);
    console.log(`✅ Inserted ${usersToInsert.length} users.`);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
  }
};
