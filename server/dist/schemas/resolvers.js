import { signToken, AuthenticationError } from '../utils/auth.js';
import { User, Course, Student } from '../models/index.js';
import Attendance from '../models/Attendance.js';
import { Types } from 'mongoose';
const resolvers = {
    Query: {
        attendanceByCourseAndDate: async (_parent, { courseId, date }) => {
            try {
                const courseObjectId = new Types.ObjectId(courseId);
                const dateObject = new Date(date); // Ensure the date is correctly parsed
                // Find attendance records for the specified course and date
                const attendanceRecords = await Attendance.find({
                    courseId: courseObjectId,
                    date: { $gte: dateObject.setHours(0, 0, 0, 0), $lt: dateObject.setHours(23, 59, 59, 999) },
                }).populate('studentId');
                return attendanceRecords;
            }
            catch (error) {
                console.error('Error fetching attendance:', error);
                throw new Error('Failed to fetch attendance');
            }
        },
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
                return validStudents; // Use 'validStudents' here
            }
            catch (error) {
                console.error('Error fetching students:', error);
                throw new Error('Failed to fetch students');
            }
        },
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
        addAttendance: async (_parent, { courseId, date, attendance }) => {
            try {
                // Convert the courseId to ObjectId
                const courseObjectId = new Types.ObjectId(courseId);
                // Ensure the attendance status is either 'present' or 'absent'
                const validStatuses = ['present', 'absent'];
                // Validate the attendance data
                attendance.forEach((att) => {
                    if (!validStatuses.includes(att.status)) {
                        throw new Error('Invalid attendance status');
                    }
                });
                // Save attendance records for each student
                const attendanceRecords = await Promise.all(attendance.map(async (att) => {
                    const studentObjectId = new Types.ObjectId(att.studentId);
                    // Check if the student is already enrolled in the course
                    const course = await Course.findById(courseObjectId);
                    if (!course || !course.students.includes(studentObjectId)) {
                        throw new Error('Student is not enrolled in the course');
                    }
                    // Create a new attendance record
                    const newAttendance = new Attendance({
                        studentId: studentObjectId,
                        courseId: courseObjectId,
                        date: new Date(date), // Ensure the date is correctly parsed
                        status: att.status,
                    });
                    // Save the attendance record to the database
                    await newAttendance.save();
                    // Return the saved attendance record for GraphQL response
                    const student = await Student.findById(studentObjectId); // Retrieve the student for the query
                    return {
                        date: newAttendance.date,
                        status: newAttendance.status,
                        student: {
                            _id: student?._id,
                            username: student?.username,
                        },
                    };
                }));
                // Return the array of attendance records
                return attendanceRecords;
            }
            catch (error) {
                console.error('Error adding attendance:', error);
                throw new Error('Failed to add attendance');
            }
        },
        addStudent: async (_, { username, email }) => {
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
            }
            catch (error) {
                console.error('Error creating student:', error);
                throw new Error('Failed to create student');
            }
        },
        addStudentToCourse: async (_parent, { courseId, studentId }) => {
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
