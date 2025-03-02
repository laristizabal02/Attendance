import mongoose, { Schema } from "mongoose";
const EmergencyContactSchema = new Schema({
    person: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    relationship: { type: String, required: true }
});
const EmergencyContact = mongoose.model("EmergencyContact", EmergencyContactSchema);
export default EmergencyContact;
