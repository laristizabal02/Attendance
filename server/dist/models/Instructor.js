import mongoose, { Schema } from "mongoose";
const InstructorSchema = new Schema({
    person: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    school: { type: String, required: true },
    officePhone: String,
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
});
const Instructor = mongoose.model("Instructor", InstructorSchema);
export default Instructor;
