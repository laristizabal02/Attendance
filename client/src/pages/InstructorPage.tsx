import { Navigate } from 'react-router-dom';
import Auth from '../utils/auth';

const InstructorPage = () => {
  // Check if user is logged in
  if (!Auth.loggedIn()) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="flex-row justify-center mb-4">
      <div className="flex-column justify-flex-start min-100-vh">
        <div className="card p-4">
          <h2>You are on the Instructor page</h2>
          <button
            className="btn btn-danger mt-3"
            onClick={() => Auth.logout()} // Call logout function
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
};

export default InstructorPage;