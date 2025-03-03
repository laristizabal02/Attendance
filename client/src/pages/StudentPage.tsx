import { useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { QUERY_COURSE_STUDENTS } from '../utils/queries';
import { ADD_STUDENT_TO_COURSE, GET_ALL_STUDENTS, ADD_NEW_STUDENT, ADD_ATTENDANCE } from '../utils/mutations'; // Import the mutation for attendance
import Auth from '../utils/auth';
import { useState } from 'react';
import mongoose from 'mongoose';

const StudentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Fetch course students
  const { data, loading, error } = useQuery(QUERY_COURSE_STUDENTS, {
    variables: { courseId },
  });

  // Fetch all students (used to populate the dropdown)
  const { data: studentsData, loading: studentsLoading, error: studentsError } = useQuery(GET_ALL_STUDENTS);

  // Define state for student selection
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [newStudentData, setNewStudentData] = useState({ username: '', email: '' });

  const [addStudentToCourse, { error: mutationError }] = useMutation(ADD_STUDENT_TO_COURSE);
  const [addNewStudent, { error: addStudentError }] = useMutation(ADD_NEW_STUDENT);
  const [addAttendance, { error: attendanceError }] = useMutation(ADD_ATTENDANCE); // Mutation for adding attendance
  

  // State for attendance tracking
  const [attendanceData, setAttendanceData] = useState<{ [key: string]: string }>({}); // { studentId: 'present' or 'absent' }

  // Handle attendance change (mark student as present or absent)
  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendanceData((prevState) => ({
      ...prevState,
      [studentId]: status,
    }));
  };

  // Handle adding attendance for all students
  const handleAddAttendance = async () => {
    try {
      // Prepare attendance data
      const attendance = Object.keys(attendanceData).map((studentId) => ({
        studentId,
        status: attendanceData[studentId],
      }));
      console.log('Attendance data:', attendance);
      console.log('Course ID:', courseId);
      console.log('Date:', new Date().toISOString());
      console.log('Attendance:', attendance);
      
      // Call the mutation to add attendance
      await addAttendance({
        variables: {
          courseId,
          date: new Date().toISOString(), // Use the current date, or you can choose a specific date
          attendance,
        },
      });

      alert('Attendance saved successfully!');
    } catch (e) {
      console.error('Error saving attendance:', e);
    }
  };

  const handleAddStudent = async () => {
    console.log(mongoose.Types.ObjectId.isValid(selectedStudentId));
    if (!mongoose.Types.ObjectId.isValid(selectedStudentId)) {
      alert('Invalid Student ID');
      return;
    }
    console.log("Adding student:", { courseId, studentId: selectedStudentId });
    try {
      await addStudentToCourse({
        variables: { courseId, studentId: selectedStudentId },
        update: (cache, { data: { addStudentToCourse } }) => {
          cache.writeQuery({
            query: QUERY_COURSE_STUDENTS,
            variables: { courseId },
            data: { course: addStudentToCourse },
          });
        },
      });
      setSelectedStudentId(''); // Reset input after adding the student
    } catch (e) {
      console.error('Error adding student:', e);
    }
  };

  const handleCreateNewStudent = async () => {
    const { username, email } = newStudentData;
    if (!username || !email) {
      alert('Please provide both username and email');
      return;
    }

    try {
      const { data } = await addNewStudent({
        variables: { username, email },
      });

      // Once the new student is created, reset the form and select the newly created student
      setNewStudentData({ username: '', email: '' });
      setSelectedStudentId(data.addStudent._id); // Set the new student ID for course addition

      alert('Student created successfully!');
    } catch (error) {
      console.error('Error creating student:', error);
    }
  };

  return (
    <main className="container mt-4">
      <div className="card p-4">
        <h2 className="mb-3">Students on the Course</h2>

        {/* Show loading state for course students */}
        {loading && <p>Loading students...</p>}
        {error && <p className="text-danger">Error: {error.message}</p>}

        {/* Show course students if available */}
        {!loading && !error && data?.course?.students?.length > 0 ? (
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {data.course.students.map((student: any) => (
                <tr key={student._id}>
                  <td>{student.username}</td>
                  <td>{student.email}</td>
                  <td>
                    <select
                      value={attendanceData[student._id] || ''}
                      onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                    >
                      <option value="">-- Select --</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
               
            </tbody>
            </table>
        ) : (
          !loading && !error && <p>No students enrolled yet.</p>
        )}

        {/* Add attendance button - Now placed right after the student list */}
        <div className="mt-4">
          <button className="btn btn-success" onClick={handleAddAttendance}>
            Save Attendance
          </button>

          {/* Show error if any during attendance mutation */}
          {attendanceError && <p className="text-danger mt-2">Error saving attendance: {attendanceError.message}</p>}
        </div>


        {/* Add student form */}
        <div className="mt-4">
          <h3>Add Student to Course</h3>
          <div className="form-group">
            <label htmlFor="studentId">Select Student</label>

            {studentsLoading ? (
              <p>Loading students...</p>
            ) : studentsError ? (
              <p className="text-danger">Error loading students: {studentsError.message}</p>
            ) : (
              <select
                id="studentId"
                className="form-control"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                <option value="">-- Select a student --</option>
                {studentsData?.allStudents.map((student: any) => (
                  <option key={student._id} value={student._id}>
                    {student.username} ({student.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          <button className="btn btn-primary mt-2" onClick={handleAddStudent}>
            Add Student
          </button>

          {/* Show error if any during mutation */}
          {mutationError && <p className="text-danger mt-2">Error adding student: {mutationError.message}</p>}
        </div>

        {/* Form for creating new student */}
        <div className="mt-4">
          <h3>Create New Student</h3>
          <div className="form-group">
            <label htmlFor="username">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={newStudentData.username}
              onChange={(e) => setNewStudentData({ ...newStudentData, username: e.target.value })}
              placeholder="Enter Full Name"
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={newStudentData.email}
              onChange={(e) => setNewStudentData({ ...newStudentData, email: e.target.value })}
              placeholder="Enter email"
            />
          </div>
          <button className="btn btn-success mt-2" onClick={handleCreateNewStudent}>
            Create New Student
          </button>

          {/* Show error if any during mutation */}
          {addStudentError && <p className="text-danger mt-2">Error creating student: {addStudentError.message}</p>}
        </div>

       

        {/* Navigation Buttons - Always Visible */}
        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-secondary" onClick={() => navigate('/instructor')}>
            ← Back to Courses
          </button>
          <button className="btn btn-danger" onClick={() => Auth.logout()}>
            Logout
          </button>
        </div>
      </div>
    </main>
  );
};

export default StudentPage;