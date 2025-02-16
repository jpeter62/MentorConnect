import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Request method: POST");

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });


      if (response.data.success) {
        toast.success('Password reset link sent to your email. Please check your inbox.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#0BB8AE',
            color: 'white',
          }
        });

        // Optional: Redirect to login or show verification page
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#000',
          color: 'white',
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container" style={{
      background: `linear-gradient(135deg, 
        #EFEDE8 50%, 
        #9DC2C8 25%, 
        #000 20%, 
        #0BB8AE 5%)`
    }}>
      <Toaster />
      
      <motion.div 
        className="forgot-password-box"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.5, 
          type: "spring", 
          stiffness: 120 
        }}
      >
        <div className="forgot-password-content">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Forgot Password</h2>
            <p>Enter your email to receive a password reset link</p>
          </motion.div>

          <form onSubmit={handleResetPassword}>
            <motion.div 
              className="input-group"
              whileFocus={{ 
                scale: 1.05,
                borderColor: '#0BB8AE'
              }}
            >
              <input 
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </motion.div>

            <motion.button 
              type="submit" 
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </motion.button>
          </form>

          <motion.div 
            className="back-to-login"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/login')}
          >
            Back to Login
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
