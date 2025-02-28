import mongoose from 'mongoose';
import db from '../config/connection.js';
import { Course, Student, User } from '../models/index.js';
import cleanDB from './cleanDB.js';
import userData from './userData.json' assert { type: 'json' };
import courseData from './courseData.json' assert { type: 'json' };
import studentData from './studentData.json' assert { type: 'json' };
const generateObjectIds = (count) => {
    return Array.from({ length: count }, () => new mongoose.Types.ObjectId());
};
const seedDatabase = async () => {
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
            instructor: instructorIds[index], // Assign generated instructor ObjectId
            students: [studentIds[index], studentIds[(index + 1) % studentIds.length]] // Assign generated student ObjectIds
        }));
        const validStudents = studentData.map((student, index) => ({
            ...student,
            person: personIds[index], // Assign generated person ObjectId
            parents: [parentIds[index * 2], parentIds[index * 2 + 1]], // Assign generated parent ObjectIds
            courses: [courseIds[index]] // Assign generated course ObjectId
        }));
        // Seed the data into the database
        await User.create(userData);
        console.log('User seeding completed!');
        await Course.create(validCourses);
        console.log('Course seeding completed!');
        await Student.create(validStudents);
        console.log('Student seeding completed!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
seedDatabase();
