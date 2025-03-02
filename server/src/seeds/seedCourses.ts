import { db } from "../config/connection.js";  // Import the database connection
import mongoose from 'mongoose';
import { Course, Person, Student } from "../models/index.js";
import courseData from "../data/courseData.json" assert { type: "json" };


export const seedCourses = async () => {
  try {
    console.log("🔄 Seeding Courses...");

    const coursesToInsert = [];

    for (const course of courseData) {
      // Step 1: Find the instructor (Person)
      const instructorPerson = await Person.findOne({ 
        firstName: course.firstName, 
        lastName: course.lastName 
      });

      if (!instructorPerson) {
        console.warn(`⚠️ Instructor ${course.firstName} ${course.lastName} not found!`);
        continue;
      }

      // Step 2: Find student ObjectIds
      const studentIds = [];

      for (const student of course.students) {
        const studentRecord = await Student.findOne({ 
          firstName: student.firstName, 
          lastName: student.lastName 
        });

        if (studentRecord) {
          studentIds.push(studentRecord._id);
        } else {
          console.warn(`⚠️ Student ${student.firstName} ${student.lastName} not found.`);
        }
      }

      // Step 3: Create the Course document
      coursesToInsert.push({
        title: course.title,
        instructor: instructorPerson._id,
        students: studentIds
      });
    }

    if (coursesToInsert.length > 0) {
      await Course.insertMany(coursesToInsert);
      console.log(`✅ Inserted ${coursesToInsert.length} courses.`);
    }
  } catch (error) {
    console.error("❌ Error seeding courses:", error);
    mongoose.disconnect();
  }
};

// **Run the seeder only after DB connection is ready**
db.once("open", async () => {
  await seedCourses();
  process.exit(0); // Ensures script exits cleanly after execution
});