import mongoose, { Schema, Document } from "mongoose";

export interface IAuthorizedPickup extends Document {
    person: mongoose.Types.ObjectId;
    students: mongoose.Types.ObjectId[];
  }
  
  const AuthorizedPickupSchema = new Schema<IAuthorizedPickup>({
    person: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }]
  });
  
 const AuthorizedPickup = mongoose.model<IAuthorizedPickup>("AuthorizedPickup", AuthorizedPickupSchema);
 export default AuthorizedPickup;