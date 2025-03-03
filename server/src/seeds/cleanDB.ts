import { Course, Instructor, Parent, Person, Student, User } from '../models/index.js';
import process from 'process';

const cleanDB = async (): Promise<void> => {
  try {


    // Delete documents from User collection
    await User.deleteMany({});
    console.log('User collection cleaned.');
    // Delete documents from Student collection
    await Student.deleteMany({});
    console.log('Student collection cleaned.');
    // Delete documents from Parent collection
    await Parent.deleteMany({});
    console.log('Parent collection cleaned.');
    // Delete documents from Instructor collection
    await Instructor.deleteMany({});
    console.log('Instructor collection cleaned.');
    // Delete documents from Person collection
    await Person.deleteMany({});
    console.log('Person collection cleaned.');
    // Delete documents from Course collection
    await Course.deleteMany({});
    console.log('Course collection cleaned.');

  } catch (err) {
    console.error('Error cleaning collections:', err);
    process.exit(1);
  }
};

export default cleanDB;
