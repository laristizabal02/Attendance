import mongoose, { Schema } from "mongoose";
const StudentSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
});
const Student = mongoose.model("Student", StudentSchema);
export default Student;
