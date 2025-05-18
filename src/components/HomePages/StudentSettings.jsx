import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  User, Lock, Save, Eye, GraduationCap, Book, BookOpen, LogOut 
} from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios'; 
import './StudentSettings.css';

const StudentSettings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
    },
    academic: {
      course: '',
      year: '',
      interests: [],
      institution: 'Marian College Kuttikanam',
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const yearOptions = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

  // Fetch student data when the component mounts
  useEffect(() => {
    const fetchStudentDetails = async () => {
      const email = Cookies.get('loggedInEmail'); // Assuming email is stored in cookies

      try {
        const response = await axios.get(`http://localhost:8080/api/students/details/${email}`);
        if (response.status === 200) {
          const { name, email, phone, course, year, interests = [] } = response.data;
          setProfile(prevProfile => ({
            ...prevProfile,
            personalInfo: {
              name,
              email,
              phone
            },
            academic: {
              course,
              year,
              institution: 'Marian College Kuttikanam', // Static
              interests: Array.isArray(interests) ? interests : [] 
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    fetchStudentDetails();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    Cookies.remove('loggedInEmail');
    Cookies.remove('userRole');
    navigate('/');
  };

  const handleSave = async () => {
    setIsEditing(false);
    
    const email = Cookies.get('loggedInEmail'); // Get the logged-in email
    const updatedData = {
      ...profile.personalInfo,
      ...profile.academic
    };

    try {
      const response = await axios.put(`http://localhost:8080/api/students/details/${email}`, updatedData);
      if (response.status === 200) {
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating student details:', error);
      alert('Failed to update profile.');
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }

    try {
      const email = Cookies.get('loggedInEmail');
      const response = await axios.put(
        `http://localhost:8080/api/students/password/${email}`,
        { currentPassword, newPassword }
      );

      if (response.status === 200) {
        alert('Password updated successfully!');
        setShowPasswordChange(false); // Close the password change modal
      } else {
        alert('Failed to update password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error updating password');
    }
  };

  return (
    <div className="msettings-container">
      <div className="msettings-wrapper">
        <div className="msettings-header">
          <div className="mheader-content">
            <div>
              <h1>Student Settings</h1>
              <p>Manage your profile and preferences</p>
            </div>
            <div className="mheader-buttons">
              <button onClick={() => setIsEditing(!isEditing)} className="medit-button">
                {isEditing ? <Save className="icon" /> : <Eye className="icon" />}
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
              <button onClick={handleLogout} className="mlogout-button">
                <LogOut className="micon" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="mmain-content">
          <div className="msettings-form">
            <div className="msettings-card">
              <h2>
                <User className="msection-icon" />
                Personal Information
              </h2>
              <div className="mform-grid">
                <div className="mform-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profile.personalInfo.name}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, name: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="mform-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profile.personalInfo.email}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, email: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="mform-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={profile.personalInfo.phone}
                    onChange={(e) => setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, phone: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="mform-group">
                  <label>Institution</label>
                  <input type="text" value={profile.academic.institution} disabled />
                </div>
              </div>
            </div>

            <div className="msettings-card">
              <h2>
                <GraduationCap className="msection-icon" />
                Academic Information
              </h2>
              <div className="mform-grid">
                <div className="mform-group">
                  <label>Course</label>
                  <input
                    type="text"
                    value={profile.academic.course}
                    onChange={(e) => setProfile({
                      ...profile,
                      academic: { ...profile.academic, course: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="mform-group">
                  <label>Year of Study</label>
                  <select
                    value={profile.academic.year}
                    onChange={(e) => setProfile({
                      ...profile,
                      academic: { ...profile.academic, year: e.target.value }
                    })}
                    disabled={!isEditing}
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="mform-group full-width">
                  <label>Fields of Interest</label>
                  <div className="minterests-container">
                    {profile.academic.interests.map((interest, index) => (
                      <span key={index} className="minterest-tag">
                        {interest}
                        {isEditing && (
                          <button
                            onClick={() => {
                              const newInterests = [...profile.academic.interests];
                              newInterests.splice(index, 1);
                              setProfile({
                                ...profile,
                                academic: { ...profile.academic, interests: newInterests }
                              });
                            }}
                            className="mremove-interest"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                    {isEditing && (
                      <button
                        onClick={() => {
                          const newInterest = prompt('Enter new field of interest');
                          if (newInterest) {
                            setProfile({
                              ...profile,
                              academic: {
                                ...profile.academic,
                                interests: [...profile.academic.interests, newInterest]
                              }
                            });
                          }
                        }}
                        className="madd-interest"
                      >
                        + Add Interest
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-preview">
            <div className="preview-card">
              <h2><Eye className="section-icon" />Profile Preview</h2>
              <div className="preview-content">
                <div className="profile-header">
                  <h3>{profile.personalInfo.name}</h3>
                  <p className="profile-course">{profile.academic.course}</p>
                  <p className="profile-year">{profile.academic.year} Year</p>
                </div>

                <div className="preview-details">
                  <div className="detail-item">
                    <Book className="detail-icon" />
                    <div>
                      <div className="detail-label">Institution</div>
                      <div className="detail-value">{profile.academic.institution}</div>
                    </div>
                  </div>
                  <div className="detail-item">
                    <BookOpen className="detail-icon" />
                    <div>
                      <div className="detail-label">Fields of Interest</div>
                      <div className="preview-interests">
                        {profile.academic.interests.map((interest, index) => (
                          <span key={index} className="interest-tag">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default StudentSettings;
