import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  // Validate the presence of the token
  if (!token) {
    toast.error('Token is missing or invalid. Please try again.');
    navigate('/forgot-password'); // Redirect to forgot-password page
    return null;
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Password validation
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      toast.error('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      toast.error('Password must contain at least one number');
      return;
    }

    // Start loading
    setLoading(true);

    try {
      // Ensure the API URL is set
      if (!process.env.REACT_APP_API_URL) {
        throw new Error('API URL is not configured in the environment variables.');
      }

      console.log('Sending reset password request...');

      // Send the PUT request
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`,
        {
          password: newPassword, // Only send the password field
        }
      );
      
    

      if (response.status === 200) {
        toast.success('Password reset successful');
        setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
      } else {
        toast.error(response.data.message || 'Failed to reset password.');
      }
    } catch (error) {
      if (error.response) {
        // Backend returned an error
        toast.error(error.response.data?.message || 'An error occurred while resetting the password.');
      } else if (error.request) {
        // No response from the backend
        toast.error('No response from server. Please try again later.');
      } else {
        // Something went wrong during the request setup
        toast.error('Error: ' + error.message);
      }
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="reset-password-container">
      <Toaster />

      <motion.div
        className="reset-password-box"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          type: 'spring',
          stiffness: 120,
        }}
      >
        <h2>Reset Password</h2>

        <form onSubmit={handleResetPassword}>
          <div className="input-group">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
