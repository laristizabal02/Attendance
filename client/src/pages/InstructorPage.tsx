import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_COURSES } from '../utils/queries';
import { ADD_COURSE, UPDATE_COURSE, DELETE_COURSE } from '../utils/mutations';
import Auth from '../utils/auth';

const InstructorPage = () => {
  const [courseTitle, setCourseTitle] = useState('');
  const { data, loading, error } = useQuery(QUERY_COURSES);
  const [addCourse] = useMutation(ADD_COURSE);
  const [updateCourse] = useMutation(UPDATE_COURSE);
  const [deleteCourse] = useMutation(DELETE_COURSE);

  // Check if user is logged in
  if (!Auth.loggedIn()) {
    return <Navigate to="/login" />;
  }

  const handleAddCourse = async () => {
    if (!courseTitle) return;

    const user = Auth.getUser();
    if (!user) {
      console.error("Instructor not logged in");
      return;
    }

    try {
      await addCourse({
        variables: { 
          input: { 
            title: courseTitle, 
            instructor: user.id,
            students: [] 
          } 
        },
        refetchQueries: [{ query: QUERY_COURSES }]
      });
      setCourseTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCourse = async (_id: string, newTitle: string) => {
    try {
      await updateCourse({
        variables: { _id, title: newTitle },
        refetchQueries: [{ query: QUERY_COURSES }]
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourse = async (_id: string) => {
    try {
      await deleteCourse({
        variables: { _id },
        refetchQueries: [{ query: QUERY_COURSES }]
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className="container mt-4">
      <div className="card p-4">
        <h2 className="mb-3">You are on the Instructor Page</h2>

        {/* Add Course Section */}
        <h3>Add New Course</h3>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Enter course title"
          />
          <button className="btn btn-primary" onClick={handleAddCourse}>
            Add Course
          </button>
        </div>

        {/* Courses Table */}
        <h3 className="mt-4">All Courses</h3>
        <table className="table table-striped table-bordered mt-3">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Course Title</th>
              <th scope="col" className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.courses.map((course: any) => (
              <tr key={course._id}>
                <td>{course.title}</td>
                <td className="text-center">
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => {
                      const newTitle = prompt("Enter new course title", course.title);
                      if (newTitle) {
                        handleUpdateCourse(course._id, newTitle);
                      }
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteCourse(course._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Logout Button */}
        <button
          className="btn btn-danger mt-3"
          onClick={() => Auth.logout()}
        >
          Logout
        </button>
      </div>
    </main>
  );
};

export default InstructorPage;