import mongoose, { Schema } from "mongoose";
const CourseSchema = new Schema({
    title: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "Instructor", required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }]
});
const Course = mongoose.model("Course", CourseSchema);
export default Course;
