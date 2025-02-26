import mongoose, { Schema, Document } from "mongoose";
export interface IInstructor extends Document {
    person: mongoose.Types.ObjectId;
    school: string;
    officePhone?: string;
    courses: mongoose.Types.ObjectId[]; // Courses they teach
  }
  
  const InstructorSchema = new Schema<IInstructor>({
    person: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    school: { type: String, required: true },
    officePhone: String,
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
  });
  
  export const Instructor = mongoose.model<IInstructor>("Instructor", InstructorSchema);
  