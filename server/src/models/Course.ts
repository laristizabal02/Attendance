import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
    title: string;
    instructor: mongoose.Types.ObjectId;
    students: mongoose.Types.ObjectId[];
  }
  
  const CourseSchema = new Schema<ICourse>({
    title: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "Instructor", required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }]
  });
  
const Course = mongoose.model<ICourse>("Course", CourseSchema);
export default Course;