import mongoose, { Schema } from "mongoose";
const PersonSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    address: String,
    users: [{ type: Schema.Types.ObjectId, ref: "User" }]
});
const Person = mongoose.model("Person", PersonSchema);
export default Person;
