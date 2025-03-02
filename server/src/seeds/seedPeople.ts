import { Person } from "../models/index.js";
import personData from "../data/personData.json" assert { type: "json" };

export const seedPersons = async () => {
  try {
    console.log("🔄 Seeding People...");

    for (const person of personData) {
      // Check if Person already exists
      let existingPerson = await Person.findOne({ firstName: person.firstName, lastName: person.lastName });

      if (existingPerson) {
        console.log(`⚠️ Person ${person.firstName} ${person.lastName} already exists in MongoDB.`);
        continue;
      }

      // Insert new Person
      const newPerson = await Person.create(person);
      console.log(`✅ Inserted Person: ${newPerson.firstName} ${newPerson.lastName} (ID: ${newPerson._id})`);
    }
  } catch (error) {
    console.error("❌ Error seeding Persons:", error);
  }
};
