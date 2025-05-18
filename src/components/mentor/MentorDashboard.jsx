import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import './MentorDashboard.css';
import { Calendar, Users, Star, Home, Clock, MessageSquare, Settings, Clipboard } from 'lucide-react';

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    sessionCount: 0,
    averageRating: 4,
    hoursCompleted: 15,
  });

  const [teacherName, setTeacherName] = useState('');
  const [students, setStudents] = useState([]);
  const [email, setEmail] = useState('');
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const storedEmail = sessionStorage.getItem('loggedInEmail') || Cookies.get('loggedInEmail');
        if (storedEmail) {
          setEmail(storedEmail);

          const response = await axios.get(`http://localhost:8080/api/teachers/name/${storedEmail}`);
          if (response.data?.name) {
            setTeacherName(response.data.name);
          }

          fetchTeacherSessions(storedEmail);
        }
      } catch (error) {
        console.error('Error fetching teacher details:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/students');
        setStudents(response.data);
        setStats((prevStats) => ({
          ...prevStats,
          totalStudents: response.data.length,
        }));
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchTeacherDetails();
    fetchStudents();
  }, []);

  const fetchTeacherSessions = async (email) => {
    try {
        // Fetch teacher ID using the email
        const teacherIdResponse = await axios.get('http://localhost:8080/api/sessions/teacher/id-by-email', {
            params: { email },
        });
        const teacherId = teacherIdResponse.data;
        if (!teacherId) return;

        // Fetch the teacher's sessions using the teacherId
        const sessionsResponse = await axios.get('http://localhost:8080/api/sessions/teacher', {
            params: { teacherId },
        });

        const sessions = sessionsResponse.data;
        setPendingRequests(sessions.filter((session) => session.status === 'PENDING'));
        setUpcomingSessions(sessions.filter((session) => session.status === 'CONFIRMED'));
        
        // Update the stats based on the sessions data
        setStats((prevStats) => ({
          ...prevStats,
          sessionCount: sessions.length, // Set the session count from the fetched data
        }));
    } catch (error) {
        console.error('Error fetching sessions:', error.response ? error.response.data : error.message);
    }
};

  const updateSessionStatus = async (sessionId, newStatus) => {
    try {
        const response = await axios.put(
            `http://localhost:8080/api/sessions/${sessionId}`,
            { status: newStatus },  // Sending status as an object
            { headers: { 'Content-Type': 'application/json' } }
        );

        // After successfully updating the session, update local state
        const updatedSession = response.data;

        // Remove from pendingRequests and add to upcomingSessions if status is 'CONFIRMED'
        if (newStatus === 'CONFIRMED') {
            setPendingRequests(prevRequests =>
                prevRequests.filter(session => session.id !== sessionId)
            );
            setUpcomingSessions(prevSessions => [...prevSessions, updatedSession]);
        } else if (newStatus === 'CANCELLED') {
            setPendingRequests(prevRequests =>
                prevRequests.filter(session => session.id !== sessionId)
            );
        }
    } catch (error) {
        console.error("Error updating session status:", error);
    }
};

  const handleLogout = () => {
    sessionStorage.clear();
    Cookies.remove('loggedInEmail');
    Cookies.remove('userRole');
    navigate('/');
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/mentor-dashboard' },
    { icon: Clipboard, label: 'Session Requests', path: '/session-requests' },
    { icon: Calendar, label: 'Schedule Management', path: '/schedule-management' },
    { icon: MessageSquare, label: 'Messaging', path: '/mentor-messages', badge: 2 },
    { icon: Star, label: 'Feedback', path:  '/feedback-rating' },
    { icon: Settings, label: 'Settings', path: '/mentor-settings' },
  ];

  const handleJoinSession = () => {
    // Redirecting to the default Google Meet link
    window.location.href = 'https://meet.google.com/new';
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="hmentor-sidebar">
        <div className="hlogo-container">
          <h1 className="hlogo">Mentor Connect</h1>
        </div>
        <nav className="hnav-menu">
          {navItems.map((item) => (
            <Link to={item.path} key={item.label} className="hnav-item">
              <item.icon className="hnav-icon" />
              <span>{item.label}</span>
              {item.badge && <span className="hnav-badge">{item.badge}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome back, {teacherName ? teacherName : 'Teacher'}! 👋</h1>
          <p>You have {pendingRequests.length} pending session requests</p>
          <button className="btn-primary" onClick={handleLogout}>Logout</button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stats-card"><Users className="stats-icon" /><h3>{stats.totalStudents}</h3><p>Total Students</p></div>
          <div className="stats-card"><Clipboard className="stats-icon" /><h3>{stats.sessionCount}</h3><p>Sessions Conducted</p></div>
          <div className="stats-card"><Star className="stats-icon" /><h3>{stats.averageRating}</h3><p>Average Rating</p></div>
          <div className="stats-card"><Clock className="stats-icon" /><h3>{stats.hoursCompleted}</h3><p>Hours Completed</p></div>
        </div>

        <div className="main-grid">
          {/* Pending Requests */}
          <div className="section-card">
            <h2>Pending Requests</h2>
            <div className="request-list">
              {pendingRequests.length === 0 ? <p>No pending session requests.</p> : pendingRequests.map((request) => (
                <div key={request.id} className="request-card">
                  <div className="student-info">
                    <img src={request.student.image || '/default-avatar.png'} alt={request.student.name} />
                    <div>
                      <h3>{request.student.name}</h3>
                      <p>{request.topic}</p>
                      <p>{request.date} at {request.timeSlot}</p>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button className="btn-accept" onClick={() => updateSessionStatus(request.id, 'CONFIRMED')}>Accept</button>
                    <button className="btn-reject" onClick={() => updateSessionStatus(request.id, 'CANCELLED')}>Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="section-card">
            <h2>Upcoming Sessions</h2>
            <div className="session-list">
              {upcomingSessions.length === 0 ? <p>No upcoming sessions.</p> : upcomingSessions.map((session) => (
                <div key={session.id} className="session-card">
                  <Clock className="session-icon" />
                  <h3>{session.topic}</h3>
                  <p>{session.student.name}</p>
                  <p>{session.date} at {session.timeSlot}</p>
                  {/* Join button which triggers window.location.href */}
                  <button className="btn-join" onClick={handleJoinSession}>Join Session</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard; 
