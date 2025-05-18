import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./Auth.css";

const TeacherRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    teachingId: "",
    department: "",
    expertise: "",
    experience: "",
  });

  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [success, setSuccess] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[0-9]{10}$/;

  // Input change handler
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "email") {
      checkEmailAvailability(e.target.value);
    }
  };

  // Check if the email is already in use
  const checkEmailAvailability = async (email) => {
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/teachers/check-email", { email });
      if (response.data.isAvailable) {
        setEmailError("");
      } else {
        setEmailError("Email is already in use. Please use another.");
      }
    } catch (err) {
      setEmailError("Error checking email availability. Please try again.");
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validations
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format");
      return;
    }
    if (!phoneRegex.test(formData.phone)) {
      setError("Phone number must be 10 digits");
      return;
    }
    if (emailError) {
      setError("Please resolve the email error before submitting");
      return;
    } 
    try {
      const response = await axios.post('http://localhost:8080/api/teachers/register', formData);
      setSuccess('Registration successful! ');
      setTimeout(() => (window.location.href = '/login'), 2000);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Registration failed. Please try again.');
      } else if (err.request) {
        setError('No response from server. Check your internet connection.');
      } else {
        setError(`Unexpected error: ${err.message}`);
      }
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-box registration-box"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-header">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Teacher Registration
          </motion.h1>
        </div>

        {error && <div className="error-message">{error}</div>}
        {emailError && <div className="error-message">{emailError}</div>}
        {success && <div className="success-message">{success}</div>}

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="form-columns">
            <div className="form-column">
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="teachingId"
                  placeholder="Teaching ID"
                  value={formData.teachingId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <select
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleInputChange}
                  required
                  className="select-input"
                >
                  <option value="">Area of Expertise</option>
                  <option value="computerScience">Computer Science</option>
                  <option value="artificialIntelligence">Artificial Intelligence</option>
                  <option value="networking">Networking</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-column">
              <div className="input-group">
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  className="select-input"
                >
                  <option value="">Years of Experience</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            className="submit-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Register
          </motion.button>

          <div className="auth-footer">
            <p>Already have an account? 
              <motion.a 
                href="/login"
                className="login-link"
                whileHover={{ scale: 1.05 }}
              >
                Login here
              </motion.a>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default TeacherRegistration;
