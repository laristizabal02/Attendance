import { Navigate } from 'react-router-dom';
import Auth from '../utils/auth';

const InstructorPage = () => {
  // Check if user is logged in
  if (!Auth.loggedIn()) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-lg-10">
        <div className="card p-4">
          <h2>You are on the Instructor page</h2>
        </div>
      </div>
    </main>
  );
};

export default InstructorPage;