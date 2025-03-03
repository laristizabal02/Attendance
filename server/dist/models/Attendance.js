import { Schema, model } from 'mongoose';
import { Types } from 'mongoose';
const AttendanceSchema = new Schema({
    studentId: { type: Types.ObjectId, ref: 'Student', required: true },
    courseId: { type: Types.ObjectId, ref: 'Course', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent'], required: true },
});
const Attendance = model('Attendance', AttendanceSchema);
export default Attendance;
