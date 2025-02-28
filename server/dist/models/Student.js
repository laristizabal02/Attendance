import mongoose, { Schema } from "mongoose";
const StudentSchema = new Schema({
    person: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    parents: [{ type: Schema.Types.ObjectId, ref: "Parent" }],
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
});
const Student = mongoose.model("Student", StudentSchema);
export default Student;
