import mongoose, { Schema, Document } from "mongoose";

export interface IEmergencyContact extends Document {
    person: mongoose.Types.ObjectId;
    relationship: string;
  }
  
  const EmergencyContactSchema = new Schema<IEmergencyContact>({
    person: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    relationship: { type: String, required: true }
  });
  
  export const EmergencyContact = mongoose.model<IEmergencyContact>("EmergencyContact", EmergencyContactSchema);
  