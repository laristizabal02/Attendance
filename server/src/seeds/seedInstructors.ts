import { /*Course, */Instructor, Person } from "../models/index.js";
import instructorData from "../data/instructorData.json" assert { type: "json" };
// import mongoose from 'mongoose';
// import { db } from "../config/connection.js";  // Import shared database connection

export const seedInstructors = async () => {
  try {
    console.log("🔄 Seeding Instructors...");

    for (const instructor of instructorData) {
      // Look up existing Person
      let personRecord = await Person.findOne({ 
        firstName: instructor.firstName, 
        lastName: instructor.lastName
      });

      if (personRecord) {
        console.log(`✅ Found existing Person for Instructor: ${instructor.firstName} ${instructor.lastName} (ID: ${personRecord._id})`);
      } else {
        console.warn(`⚠️ Instructor ${instructor.firstName} ${instructor.lastName} has NO matching Person in MongoDB!`);
      }

      // Insert Instructor using the existing Person
      if (personRecord) {
        await Instructor.create({
          person: personRecord._id,
          school: instructor.school,
          officePhone: instructor.officePhone,
          courses: []
        });
        console.log(`✅ Inserted Instructor: ${instructor.firstName} ${instructor.lastName}`);
      } else {
        console.warn(`⚠️ Skipping Instructor ${instructor.firstName} ${instructor.lastName} due to missing Person record.`);
      }
    }
  } catch (error) {
    console.error("❌ Error seeding Instructors:", error);
  }
};