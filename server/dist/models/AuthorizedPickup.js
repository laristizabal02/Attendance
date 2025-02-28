import mongoose, { Schema } from "mongoose";
const AuthorizedPickupSchema = new Schema({
    person: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }]
});
const AuthorizedPickup = mongoose.model("AuthorizedPickup", AuthorizedPickupSchema);
export default AuthorizedPickup;
