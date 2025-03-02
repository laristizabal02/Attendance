import { Person, Student } from "../models/index.js";
import studentData from "../data/studentData.json" assert { type: "json" };

export const seedStudents = async () => {
    try {
      for (const student of studentData) {
        // First, try to find the corresponding Person
        let personRecord = await Person.findOne({
          firstName: student.firstName,
          lastName: student.lastName
        });
  
        // If the Person doesn't exist, create a new one
        if (!personRecord) {
          personRecord = new Person({
            firstName: student.firstName,
            lastName: student.lastName,
            phone: student.phone || undefined, // Use student phone if available
            address: student.address || undefined // Use student address if available
          });
  
          await personRecord.save();
          console.log(`Created new Person: ${student.firstName} ${student.lastName}`);
        }
        // instructorData.json has course titles in the courses array. Need to convert those
        // to _Id's
        //const courseIds = [];
        //for (const courseTitle of instructor.courses) {
        //  let course = await Course.findOne({ title: courseTitle });
  
          // If the course doesn't exist, create it
          //if (!course) {
          //  const courseInstructor = `${instructor.firstName} ${instructor.lastName}`;
          //  console.log(`Creating missing course: ${courseTitle} (Instructor: ${courseInstructor})`);
  
          //  course = new Course({
          //    title: courseTitle,
          //    instructor: personRecord._id, // Assign the instructor as course creator
          //    students: [] // Initially, no students
          //  });
  
          //  await course.save();
          //}
  
          //courseIds.push(course._id);
        //}
  
  
  
        // Now construct the Student record
        console.log(`Student nickName: ${student.nickName}`);
        console.log(`Student birthDate: ${student.birthDate}`);
        const studentEntry: any = {
          person: personRecord._id,
          nickName: student.nickName || undefined,
          birthDate: student.birthDate || undefined,
        };
  
        // Step 4: Insert the Instructor record into MongoDB
        await Student.create(studentEntry);
        console.log(`Student added: ${student.firstName} ${student.lastName}`);
      }
    } catch (error) {
      console.error("Error seeding Students:", error);
    }
  };