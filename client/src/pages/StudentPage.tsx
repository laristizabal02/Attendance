import { useQuery } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { QUERY_COURSE_STUDENTS } from '../utils/queries';
import Auth from '../utils/auth';

const StudentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const { data, loading, error } = useQuery(QUERY_COURSE_STUDENTS, {
    variables: { courseId },
  });

  return (
    <main className="container mt-4">
      <div className="card p-4">
        <h2 className="mb-3">Students on the Course</h2>

        {/* Show loading state */}
        {loading && <p>Loading students...</p>}

        {/* Show error message */}
        {error && <p className="text-danger">Error: {error.message}</p>}

        {/* Show students if available */}
        {!loading && !error && data?.course?.students?.length > 0 ? (
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {data.course.students.map((student: any) => (
                <tr key={student._id}>
                  <td>{student.username}</td>
                  <td>{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && !error && <p>No students enrolled yet.</p>
        )}

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