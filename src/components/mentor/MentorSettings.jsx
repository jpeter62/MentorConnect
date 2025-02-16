import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Phone, Lock, IdCard, 
  Building, BookOpen, Clock, Save, 
  Eye, LogOut 
} from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';

// Rest of the component remains the same, just update the icon usage
const MentorSettings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    teachingId: '',
    department: '',
    expertise: '',
    experience: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch mentor data when component mounts
  useEffect(() => {
    const fetchMentorDetails = async () => {
      const email = Cookies.get('loggedInEmail');

      try {
        const response = await axios.get(`http://localhost:8080/api/teachers/details/${email}`);
        if (response.status === 200) {
          const {
            name,
            email,
            phone,
            teachingId,
            department,
            expertise,
            experience
          } = response.data;

          setProfile({
            name,
            email,
            phone,
            password: '',
            confirmPassword: '',
            teachingId,
            department,
            expertise,
            experience
          });
        }
      } catch (error) {
        console.error('Error fetching mentor details:', error);
      }
    };

    fetchMentorDetails();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    Cookies.remove('loggedInEmail');
    Cookies.remove('userRole');
    navigate('/');
  };

  const handleSave = async () => {
    setIsEditing(false);
    
    const email = Cookies.get('loggedInEmail');
    const updatedData = {
      ...profile,
      password: undefined,
      confirmPassword: undefined
    };

    try {
      const response = await axios.put(`http://localhost:8080/api/teachers/details/${email}`, updatedData);
      if (response.status === 200) {
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating mentor details:', error);
      alert('Failed to update profile.');
    }
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }

    try {
      const email = Cookies.get('loggedInEmail');
      const response = await axios.put(
        `http://localhost:8080/api/mentors/password/${email}`,
        { currentPassword, newPassword }
      );

      if (response.status === 200) {
        alert('Password updated successfully!');
        setShowPasswordChange(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error updating password');
    }
  };

  return (
    <div className="msettings-container">
      <div className="msettings-wrapper">
        {/* Header */}
        <div className="msettings-header">
          <div className="mheader-content">
            <div>
              <h1>Mentor Settings</h1>
              <p>Manage your profile and preferences</p>
            </div>
            <div className="mheader-buttons">
              <button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className="medit-button"
              >
                {isEditing ? <Save className="micon" /> : <Eye className="micon" />}
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
              <button
                onClick={handleLogout}
                className="mlogout-button"
              >
                <LogOut className="micon" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="mmain-content">
          <div className="msettings-form">
            {/* Personal Information */}
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
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="mform-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="mform-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="mform-group">
                  <label>Teaching ID</label>
                  <input
                    type="text"
                    value={profile.teachingId}
                    onChange={(e) => setProfile({...profile, teachingId: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="msettings-card">
              <h2>
                <BookOpen className="msection-icon" />
                Professional Information
              </h2>
              <div className="mform-grid">
                <div className="mform-group">
                  <label>Department</label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({...profile, department: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="mform-group">
                  <label>Expertise</label>
                  <input
                    type="text"
                    value={profile.expertise}
                    onChange={(e) => setProfile({...profile, expertise: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="mform-group">
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    value={profile.experience}
                    onChange={(e) => setProfile({...profile, experience: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Preview */}
          <div className="profile-preview">
            <div className="preview-card">
              <h2>
                <Eye className="msection-icon" />
                Profile Preview
              </h2>
              <div className="preview-content">
                <div className="profile-header">
                  <h3>{profile.name}</h3>
                  <p className="profile-title">{profile.department}</p>
                </div>

                <div className="preview-details">
                  <div className="detail-item">
                    <IdCard className="detail-icon" />
                    <span>{profile.teachingId}</span>
                  </div>
                  <div className="detail-item">
                    <Mail className="detail-icon" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="detail-item">
                    <Phone className="detail-icon" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="detail-item">
                    <Building className="detail-icon" />
                    <span>{profile.department}</span>
                  </div>
                  <div className="detail-item">
                    <BookOpen className="detail-icon" />
                    <span>{profile.expertise}</span>
                  </div>
                  <div className="detail-item">
                    <Clock className="detail-icon" />
                    <span>{profile.experience} years of experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Change Password</h3>
            <div className="modal-form">
              <div className="mform-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                />
              </div>
              <div className="mform-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>
              <div className="mform-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowPasswordChange(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="submit-button"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorSettings;