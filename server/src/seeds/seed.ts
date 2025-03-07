import db from '../config/connection.js';
import { Course, Instructor, Student, User, Person, Parent } from '../models/index.js';
import cleanDB from './cleanDB.js';
import mongoose from "mongoose";
import parentData from '../Data/parentData.json' assert { type: 'json'};
import userData from '../Data/userData.json' assert { type: 'json'};
import personData from '../Data/personData.json' assert { type: 'json'};
import courseData from '../Data/courseData.json' assert { type: 'json' };
import studentData from '../Data/studentData.json' assert { type: 'json' };
import instructorData from '../Data/instructorData.json' assert { type: 'json' };

const generateObjectIds = (count: number) => {
  return Array.from({ length: count }, () => new mongoose.Types.ObjectId());
};
const seedDatabase = async (): Promise<void> => {
  try {
    await db();
    await cleanDB();

    // Generate new ObjectIds for instructors, students, parents, courses, and persons
    const instructorIds = generateObjectIds(courseData.length);
    const studentIds = generateObjectIds(studentData.length);
    const parentIds = generateObjectIds(studentData.length * 2); // Assuming each student has 2 parents
    const courseIds = generateObjectIds(courseData.length);
    const personIds = generateObjectIds(studentData.length);

    // Map instructorIds, studentIds, etc., into the data structures
    const validCourses = courseData.map((course, index) => ({
      ...course,
      instructor: instructorIds[index],  // Assign generated instructor ObjectId
      students: [studentIds[index], studentIds[(index + 1) % studentIds.length]]  // Assign generated student ObjectIds
    }));

    const validStudents = studentData.map((student, index) => ({
      ...student,
      person: personIds[index],  // Assign generated person ObjectId
      parents: [parentIds[index * 2], parentIds[index * 2 + 1]],  // Assign generated parent ObjectIds
      courses: [courseIds[index]]  // Assign generated course ObjectId
    }));

    // Seed the data into the database
    await User.create(userData);
    console.log('User seeding completed!');
    await Course.create(validCourses);
    console.log('Course seeding completed!');
    await Student.create(validStudents);
    console.log('Student seeding completed!');
    await Person.create(personData);
    console.log('Persons created successfully')
    await seedParents();
    await seedInstructors();
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
const seedInstructors = async () => {
  try {
    for (const instructor of instructorData) {
      // First, try to find the corresponding Person
      let personRecord = await Person.findOne({
        firstName: instructor.firstName,
        lastName: instructor.lastName
      });

      // If the Person doesn't exist, create a new one
      if (!personRecord) {
        personRecord = new Person({
          firstName: instructor.firstName,
          lastName: instructor.lastName,
          phone: instructor.officePhone || undefined, // Use office phone if available
          address: undefined 
        });

        await personRecord.save();
        console.log(`Created new Person: ${instructor.firstName} ${instructor.lastName}`);
      }

      // Now construct the Instructor record
      const instructorEntry: any = {
        person: personRecord._id,
        school: instructor.school || undefined,
        officePhone: instructor.officePhone || undefined,
      };

      // Step 4: Insert the Instructor record into MongoDB
      await Instructor.create(instructorEntry);
      console.log(`Instructor added: ${instructor.firstName} ${instructor.lastName}`);
    }
  } catch (error) {
    console.error("Error seeding Instructors:", error);
  }
};

seedDatabase();
