import { Course, Instructor, Parent, Person, Student, User } from '../models/index.js';

export const cleanDB = async () => {
  console.log("🔄 Cleaning database collections...");

  await User.deleteMany({});
  console.log("✅ User collection cleaned.");

  await Student.deleteMany({});
  console.log("✅ Student collection cleaned.");

  await Parent.deleteMany({});
  console.log("✅ Parent collection cleaned.");

  await Instructor.deleteMany({});
  console.log("✅ Instructor collection cleaned.");

  await Person.deleteMany({});
  console.log("✅ Person collection cleaned.");

  await Course.deleteMany({});
  console.log("✅ Course collection cleaned.");

  console.log("✅ Database cleaning complete!");
};
export default cleanDB;
