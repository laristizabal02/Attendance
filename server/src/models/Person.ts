import mongoose, { Schema, Document } from "mongoose";

export interface IPerson extends Document {
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  users?: mongoose.Types.ObjectId[];  // Links to User documents
}

const PersonSchema = new Schema<IPerson>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: String,
  address: String,
  users: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

export const Person = mongoose.model<IPerson>("Person", PersonSchema);
