import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInEmail = sessionStorage.getItem('loggedInEmail') || Cookies.get('loggedInEmail');
    const userRole = sessionStorage.getItem('userRole') || Cookies.get('userRole');

    if (loggedInEmail && userRole) {
      const roleRoutes = {
        '2': '/admin',
        '1': '/student-home',
        '3': '/mentor-dashboard'
      };
      navigate(roleRoutes[userRole] || '/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginAttempts = [
        { 
          url: 'http://localhost:8080/api/admin/login', 
          successPath: '/admin', 
          role: '2',
          errorMessage: 'Admin login failed'
        },
        { 
          url: 'http://localhost:8080/api/students/login', 
          successPath: '/student-home', 
          role: '1',
          errorMessage: 'Student login failed'
        },
        { 
          url: 'http://localhost:8080/api/teachers/login', 
          successPath: '/mentor-dashboard', 
          role: '3',
          errorMessage: 'Teacher login failed'
        }
      ];

      for (const attempt of loginAttempts) {
        try {
          const response = await axios.post(attempt.url, { email, password });
          
          if (response.data.success) {
            if (response.data.status === 'blocked') {
              toast.error('Your account has been blocked. Contact the administrator.', {
                duration: 4000,
                position: 'top-center'
              });
              setLoading(false);
              return;
            }

            toast.success('Login successful', {
              duration: 2000,
              position: 'top-center'
            });

            setSessionAndNavigate(email, attempt.role, attempt.successPath);
            return;
          }
        } catch (error) {
          if (error.response?.status === 403) {
            toast.error('Account blocked. Contact the administrator.', {
              duration: 4000,
              position: 'top-center'
            });
            setLoading(false);
            return;
          }
        }
      }

      toast.error('Invalid email or password', {
        duration: 3000,
        position: 'top-center'
      });
    } catch (error) {
      toast.error('Login error. Please try again.', {
        duration: 3000,
        position: 'top-center'
      });
    } finally {
      setLoading(false);
    }
  };

  const setSessionAndNavigate = (email, role, path) => {
    sessionStorage.setItem('loggedInEmail', email);
    sessionStorage.setItem('userRole', role);
    Cookies.set('loggedInEmail', email, { expires: 1, path: '/' });
    Cookies.set('userRole', role, { expires: 1, path: '/' });
    navigate(path);
  };

  return (
    <div className="main-container">
      <Toaster />

      <div className="auth-container">
        <motion.div
          className="auth-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-header">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Welcome Back
            </motion.h1>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="login-form"
          >
            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="auth-input"
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="auth-input"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="forgot-password-link">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <motion.button
              type="submit"
              className="submit-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                'Login'
              )}
            </motion.button>
          </motion.form>

          <div className="auth-footer">
            <p>Don't have an account?</p>
            <div className="register-options">
              <motion.a 
                href="/student-register" 
                className="register-btn student" 
                whileHover={{ scale: 1.05 }}
              >
                Register as Student
              </motion.a>
              <motion.a 
                href="/teacher-register" 
                className="register-btn teacher" 
                whileHover={{ scale: 1.05 }}
              >
                Register as Teacher
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;