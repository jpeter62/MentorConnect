import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const LogoutPage = () => {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    // Clear sessionStorage and cookies
    sessionStorage.clear();
    Cookies.remove('loggedInEmail');
    Cookies.remove('userRole');

    // Redirect to the home page
    navigate('/');
  };

  // Optionally, call the logout when the component mounts (if needed)
  useEffect(() => {
    handleLogout();
  }, [navigate]);

  return (
    <div>
      <h1>You have been logged out</h1>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default LogoutPage;
