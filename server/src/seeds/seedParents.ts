import { Parent, Person } from "../models/index.js";
import parentData from "../data/parentData.json" assert { type: "json" };

export const seedParents = async () => {
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