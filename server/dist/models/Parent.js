import mongoose, { Schema } from "mongoose";
const ParentSchema = new Schema({
    person: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    homePhone: String,
    workPhone: String,
    workAddress: String,
    cellPhone: String,
    children: [{ type: Schema.Types.ObjectId, ref: "Student" }]
});
const Parent = mongoose.model("Parent", ParentSchema);
export default Parent;
