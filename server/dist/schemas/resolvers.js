import { signToken, AuthenticationError } from '../utils/auth.js';
import { User, Course } from '../models/index.js';
const resolvers = {
    Query: {
        courses: async () => {
            return await Course.find().populate('instructor').populate('students');
        },
        course: async (_parent, { _id }) => {
            return await Course.findById(_id).populate('instructor').populate('students');
        },
        courseStudents: async (_parent, { courseId }) => {
            const course = await Course.findById(courseId).populate('students');
            console.log("Course number", courseId);
            console.log("Students enrolled:", course?.students);
            return course ? course.students : [];
        },
    },
    Mutation: {
        addCourse: async (_parent, { input }) => {
            const course = new Course(input);
            await course.save();
            return course;
        },
        updateCourse: async (_parent, { _id, title }) => {
            return await Course.findByIdAndUpdate(_id, { title }, { new: true });
        },
        deleteCourse: async (_parent, { _id }) => {
            return await Course.findByIdAndDelete(_id);
        },
        addUser: async (_parent, { input }) => {
            // Create a new user with the provided username, email, and password
            const user = await User.create({ ...input });
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
            // Return the token and the user
            return { token, user };
        },
        login: async (_parent, { email, password }) => {
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
