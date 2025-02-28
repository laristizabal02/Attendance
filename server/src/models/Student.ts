import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  username: string;
  email: string;
  courses: mongoose.Types.ObjectId[];
}

const StudentSchema = new Schema<IStudent>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
});

const Student = mongoose.model<IStudent>("Student", StudentSchema);
export default Student;