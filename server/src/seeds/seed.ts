import db from '../config/connection.js';
import { User, Person, Parent } from '../models/index.js';
import cleanDB from './cleanDB.js';
//import mongoose from "mongoose";
import parentData from './parentData.json' assert { type: 'json'};
import userData from './userData.json' assert { type: 'json'};
import personData from './personData.json' assert { type: 'json'};

const seedDatabase = async (): Promise<void> => {
  try {
    await db();
    await cleanDB();

    await User.create(userData);
    console.log('Users created successfully')
    await Person.create(personData);
    console.log('Persons created successfully')
    await seedParents()
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }

}
const seedParents = async () => {
  try {
    for (const parent of parentData) {
      // First, try to find the corresponding Person
      let personRecord = await Person.findOne({ 
        firstName: parent.firstName, 
        lastName: parent.lastName 
      });

      // If the Person doesn't exist, create a new one
      if (!personRecord) {
        personRecord = new Person({
          firstName: parent.firstName,
          lastName: parent.lastName,
          phone: parent.homePhone || parent.cellPhone, // Use available phone info
          address: parent.workAddress || undefined // Use work address if available
        });

        await personRecord.save();
        console.log(`Created new Person: ${parent.firstName} ${parent.lastName}`);
      }

      // Now construct the Parent record
      const parentEntry: any = {
        person: personRecord._id,
        homePhone: parent.homePhone || undefined,
        workPhone: parent.workPhone || undefined,
        workAddress: parent.workAddress || undefined,
        cellPhone: parent.cellPhone || undefined,
      };

      // Step 4: Insert the Parent record into MongoDB
      await Parent.create(parentEntry);
      console.log(`Parent added: ${parent.firstName} ${parent.lastName}`);
    }
  } catch (error) {
    console.error("Error seeding Parents:", error);
  }
};

seedDatabase();
