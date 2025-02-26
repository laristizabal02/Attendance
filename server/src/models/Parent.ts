import mongoose, { Schema, Document } from "mongoose";

export interface IParent extends Document {
    person: mongoose.Types.ObjectId;
    homePhone?: string;
    workPhone?: string;
    workAddress?: string;
    cellPhone?: string;
    children: mongoose.Types.ObjectId[]; // Array of Student IDs
  }
  
  const ParentSchema = new Schema<IParent>({
    person: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    homePhone: String,
    workPhone: String,
    workAddress: String,
    cellPhone: String,
    children: [{ type: Schema.Types.ObjectId, ref: "Student" }]
  });
  
  export const Parent = mongoose.model<IParent>("Parent", ParentSchema);
  