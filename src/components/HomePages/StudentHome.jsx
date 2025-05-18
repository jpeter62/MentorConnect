import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Home, Calendar, Bell, Search, Users, MessageSquare, Clock, Settings, MessageCircle, Star, TrendingUp , X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import Cookies from 'js-cookie';
import axios from 'axios';
import './StudentHome.css';

const StudentHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [stats, setStats] = useState({
    sessionsCompleted: 0,
    hoursLearned: 0,
    skillsImproved: 0,
  });

  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const storedEmail = sessionStorage.getItem('loggedInEmail') || Cookies.get('loggedInEmail');
        if (storedEmail) {
          setEmail(storedEmail);

          const nameResponse = await axios.get(`http://localhost:8080/api/students/name/${storedEmail}`);
          if (nameResponse.data && nameResponse.data.name) {
            setStudentName(nameResponse.data.name);
          }

          fetchStudentSessions(storedEmail);
        }
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/teachers');
        setTeachers(response.data);
      } catch (error) {
        console.error('Error fetching teacher details:', error);
      }
    };

    fetchStudentDetails();
    fetchTeachers();
  }, []);

  const fetchStudentSessions = async (email) => {
    try {
      const studentIdResponse = await axios.get('http://localhost:8080/api/students/id-by-email', {
        params: { email },
      });
      const studentId = studentIdResponse.data.id;
  
      const sessionsResponse = await axios.get('http://localhost:8080/api/sessions', {
        params: { studentId },
      });
  
      // Ensure each session has both date and timeSlot
      setUpcomingSessions(sessionsResponse.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };
  

  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => ({
        sessionsCompleted: prev.sessionsCompleted < 12 ? prev.sessionsCompleted + 1 : prev.sessionsCompleted,
        hoursLearned: prev.hoursLearned < 24 ? prev.hoursLearned + 1 : prev.hoursLearned,
        skillsImproved: prev.skillsImproved < 8 ? prev.skillsImproved + 1 : prev.skillsImproved,
      }));
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const handleBookSession = () => {
    navigate("/find-mentors");
  };

  const handleLogout = () => {
    sessionStorage.clear();
    Cookies.remove('loggedInEmail');
    Cookies.remove('userRole');
    navigate('/');
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/student-home' },
    { icon: Users, label: 'Find Mentors', path: '/find-mentors' },
    { icon: MessageSquare, label: 'Messages', path: '/messages', badge: 3 },
    { icon: Clock, label: 'Sessions', path: '/sessions' },
    { icon: MessageCircle, label: 'Feedback', path: '/feedback' },
    { icon: Settings, label: 'Settings', path: '/student-settings' },
  ];
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Start Your Learning Journey! 🚀",
      message: "Book your first mentoring session today and get personalized guidance for your career.",
      time: "Just now"
    },
    {
      id: 2,
      title: "New Mentor Available! ⭐",
      message: "Expert in Web Development has joined our platform. Explore their profile now!",
      time: "2 hours ago"
    }
  ]);
  
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // ... (keep all existing code)

  const handleNotificationClick = () => {
    setShowNotificationsDropdown(!showNotificationsDropdown);
  };

  const handleCloseNotifications = (e) => {
    e.stopPropagation();
    setShowNotificationsDropdown(false);
  };

  const removeNotification = (e, notificationId) => {
    e.stopPropagation();
    setNotifications(notifications.filter(notif => notif.id !== notificationId));
  };

  return (
    <div className="happ-container">
      {/* Sidebar */}
      <aside className="hsidebar">
        <div className="hlogo-container">
          <h1 className="hlogo">Mentor Connect</h1>
        </div>
        <nav className="hnav-menu">
          {navItems.map((item) => (
            <Link to={item.path} key={item.label} className="hnav-item nav-link">
              <item.icon className="hnav-icon" />
              <span>{item.label}</span>
              {item.badge && <span className="hnav-badge">{item.badge}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="hmain-content">
        {/* Top Bar */}
        <header className="htop-bar">
          <div className="hsearch-container">
            <Search className="hsearch-icon" />
            <input
              type="text"
              placeholder="Search mentors..."
              className="hsearch-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="top-bar-actions">
            <div className="notification-container">
              <div
                className="notification-bell"
                onClick={handleNotificationClick}
              >
                <Bell />
                <span className="notification-badge">{notifications.length}</span>
              </div>
              
              {showNotificationsDropdown && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    <button 
                      className="close-notifications"
                      onClick={handleCloseNotifications}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="notifications-list">
                    {notifications.map(notification => (
                      <div key={notification.id} className="notification-item">
                        <div className="notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                        <button 
                          className="remove-notification"
                          onClick={(e) => removeNotification(e, notification.id)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="no-notifications">
                        No new notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button 
              className="book-session-btn" 
              onClick={handleBookSession}
            >
              Book Session
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="content-grid">
          {/* Main Section */}
          <div className="hmain-section">
            <Card className="welcome-card">
              <CardHeader>
                <CardTitle>Welcome to Mentor Connect, {studentName || 'Student'}! 👋</CardTitle>
                <button className="btn-primary" onClick={handleLogout}>Logout</button>
              </CardHeader>
              <CardContent>
                <div className="stats-container">
                  <div className="stat-item">
                    <Clock className="stat-icon" />
                    <span className="stat-value">{stats.sessionsCompleted}</span>
                    <span className="stat-label">Sessions Completed</span>
                  </div>
                  <div className="stat-item">
                    <TrendingUp className="stat-icon" />
                    <span className="stat-value">{stats.hoursLearned}</span>
                    <span className="stat-label">Hours Learned</span>
                  </div>
                  <div className="stat-item">
                    <Star className="stat-icon" />
                    <span className="stat-value">{stats.skillsImproved}</span>
                    <span className="stat-label">Skills Improved</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mentors-card">
              <CardHeader>
                <CardTitle>Recommended Mentors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mentors-grid">
                  {teachers.map((teacher) => (
                    <div key={teacher.id} className="mentor-card">
              
                      <h3 className="mentor-name">{teacher.name}</h3>
                      <p className="mentor-title">{teacher.expertise}</p>
                      <div className="mentor-rating">
                        <Star className="star-icon" />
                        <span>4.9</span> {/* Placeholder for rating */}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="right-sidebar">
          <Card className="calendar-widget">
  <CardHeader>
    <CardTitle>Upcoming Sessions</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="sessions-list">
      {upcomingSessions.length > 0 ? (
        upcomingSessions.map((session, index) => (
          <div key={index} className="session-item">
            <div className="session-info">
              <h3 className="mentor-name">{session.teacher.name}</h3>
              <p className="session-topic">{session.topic}</p>
            </div>
            <div className="session-time">
              <Calendar className="time-icon" />
              <span>{session.date}</span> {/* 🗓️ Show Date */}
            </div>
            <div className="session-time">
              <Clock className="time-icon" />
              <span>{session.timeSlot}</span> {/* ⏰ Show Time */}
            </div>
          </div>
        ))
      ) : (
        <p>No upcoming sessions found.</p>
      )}
    </div>
  </CardContent>
</Card>

            
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentHome;
