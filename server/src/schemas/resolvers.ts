import { signToken, AuthenticationError } from '../utils/auth.js'; 
import { User, Course, Instructor, Student  } from '../models/index.js';

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
      courses: async () => {
        return await Course.find().populate('instructor').populate('students');
      },
      course: async (_parent: any, { _id }: { _id: string }) => {
        return await Course.findById(_id).populate('instructor').populate('students');
      },
      courseStudents: async (_parent: any, { courseId }: { courseId: string }) => {
        const course = await Course.findById(courseId).populate('students');
        console.log("Students numer", courseId);
        console.log("Students enrolled:", course?.students);
        return course ? course.students : [];
      },
      
    },

    Mutation: {

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