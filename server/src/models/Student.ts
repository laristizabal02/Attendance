import mongoose, { Schema, Document } from "mongoose";
export interface IStudent extends Document {
    person: mongoose.Types.ObjectId;
    nickName?:  string;
    birthDate: Date;
    parents: mongoose.Types.ObjectId[];
    courses: mongoose.Types.ObjectId[];
  }
  
  const StudentSchema = new Schema<IStudent>({
    person: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    nickName: { type: String, required: false},
    birthDate: { type: Date, required: true},
    parents: [{ type: Schema.Types.ObjectId, ref: "Parent" }],
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
  });
  
  const Student = mongoose.model<IStudent>("Student", StudentSchema);
  export default Student;
  