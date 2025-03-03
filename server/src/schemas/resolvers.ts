import { signToken, AuthenticationError } from '../utils/auth.js'; 
import { User, Course, Student } from '../models/index.js';
import { Types } from 'mongoose';

interface AddUserArgs {
    input:{
      username: string;
      email: string;
      password: string;
    }
  }

interface LoginUserArgs {
    email: string;
    password: string;
  }



  const resolvers = {
    Query: {
      allStudents: async () => {
        try {
          const students = await Student.find(); // Fetch all students from the database
          
          // Filter out students without a valid 'username' field
          const validStudents = students.filter(student => student.username);
  
          // Optionally, replace invalid usernames with a default value (like 'Unknown')
          students.forEach(student => {
            if (!student.username) {
              student.username = 'Unknown'; // Default value for username
            }
          });
  
          // Return valid students only
          return validStudents;  // Use 'validStudents' here
        } catch (error) {
          console.error('Error fetching students:', error);
          throw new Error('Failed to fetch students');
        }
      },
      courses: async () => {
        return await Course.find().populate('instructor').populate('students');
      },
      course: async (_parent: any, { _id }: { _id: string }) => {
        return await Course.findById(_id).populate('instructor').populate('students');
      },
      courseStudents: async (_parent: any, { courseId }: { courseId: string }) => {
        const course = await Course.findById(courseId).populate('students');
        console.log("Course number", courseId);
        console.log("Students enrolled:", course?.students);
        return course ? course.students : [];
      },
      
    },

    Mutation: {

      addStudent: async (_: any, { username, email }: { username: string, email: string }) => {
        try {
          // Create a new student and save to the database
          console.log(username, email);
          const newStudent = new Student({
            username,
            email,
          });
  
          // Save the student to the database
          await newStudent.save();
  
          return newStudent; // Return the newly created student
        } catch (error) {
          console.error('Error creating student:', error);
          throw new Error('Failed to create student');
        }
      },

      addStudentToCourse: async (_parent: any, { courseId, studentId }: { courseId: string, studentId: string }) => {
        // Convert the string IDs to ObjectId
        const courseObjectId = new Types.ObjectId(courseId); 
        const studentObjectId = new Types.ObjectId(studentId);
  
        const course = await Course.findById(courseObjectId);
        if (!course) {
          throw new Error('Course not found');
        }
  
        const student = await Student.findById(studentObjectId);
        if (!student) {
          throw new Error('Student not found');
        }
  
        // Add student to course
        course.students.push(studentObjectId);
        await course.save();
  
        // Return the updated course with the students
        return course.populate('students');
      },

      addCourse: async (_parent: any, { input }: { input: { title: string, instructor: string, students: string[] } }) => {
        const course = new Course(input);
        await course.save();
        return course;
      },
      updateCourse: async (_parent: any, { _id, title }: { _id: string, title: string }) => {
        return await Course.findByIdAndUpdate(_id, { title }, { new: true });
      },
      deleteCourse: async (_parent: any, { _id }: { _id: string }) => {
        return await Course.findByIdAndDelete(_id);
      },

        addUser: async (_parent: any, { input }: AddUserArgs) => {
          // Create a new user with the provided username, email, and password
          const user = await User.create({ ...input });
        
          // Sign a token with the user's information
          const token = signToken(user.username, user.email, user._id);
        
          // Return the token and the user
          return { token, user };
        },
        
        login: async (_parent: any, { email, password }: LoginUserArgs) => {
          // Find a user with the provided email
          const user = await User.findOne({ email });
        
          // If no user is found, throw an AuthenticationError
          if (!user) {
            throw new AuthenticationError('Could not authenticate user.');
          }
        
          // Check if the provided password is correct
          const correctPw = await user.isCorrectPassword(password);
        
          // If the password is incorrect, throw an AuthenticationError
          if (!correctPw) {
            throw new AuthenticationError('Could not authenticate user.');
          }
        
          // Sign a token with the user's information
          const token = signToken(user.username, user.email, user._id);
        
          // Return the token and the user
          return { token, user };
        },

    },

  };

  export default resolvers;