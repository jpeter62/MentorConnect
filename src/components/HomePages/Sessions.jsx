import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Calendar, Clock, Video } from 'lucide-react'; // Added Star for feedback
import './Sessions.css';

const Sessions = () => {
  const [loggedEmail, setLoggedEmail] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the logged-in user's email from sessionStorage or cookies
    const storedEmail = sessionStorage.getItem('loggedInEmail') || Cookies.get('loggedInEmail');
    if (storedEmail) {
      setLoggedEmail(storedEmail);
      fetchStudentIdAndSessions(storedEmail);
    } else {
      setError('User is not logged in.');
    }
  }, []);

  const fetchStudentIdAndSessions = async (email) => {
    try {
      // Fetch the studentId using the email
      const studentIdResponse = await axios.get('http://localhost:8080/api/students/id-by-email', {
        params: { email },
      });
      const studentId = studentIdResponse.data.id;

      // Fetch the session details for the studentId
      const sessionsResponse = await axios.get('http://localhost:8080/api/sessions', {
        params: { studentId },
      });
      setSessions(sessionsResponse.data); // Directly set all sessions
    } catch (error) {
      console.error('Error fetching studentId or sessions:', error);
      setError('Failed to fetch session data.');
    }
  };

  const handleGiveFeedback = (session) => {
    // Redirect to feedback form or open a feedback modal
    const feedbackUrl = `/feedback?sessionId=${session.id}&teacherId=${session.teacher.id}`;
    window.location.href = feedbackUrl; // Redirect to feedback page
  };

  // Function to check if the session is in the past
  const isPastSession = (sessionDate) => {
    const today = new Date();
    const sessionDateObj = new Date(sessionDate);
    return sessionDateObj < today;
  };

  return (
    <div className="sessions-container">
      <h1 className="page-title">Your Sessions</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="sessions-grid">
        {/* Upcoming Sessions Section */}
        <div className="session-section">
          <h2 className="section-title">Upcoming Sessions</h2>
          <div className="sessions-list">
            {sessions.filter((session) => !isPastSession(session.date)).map((session) => (
              <div key={session.id} className="session-card">
                <div className="session-header">
                  <div className="session-info">
                    <h3 className="mentor-name">{session.teacher.name}</h3>
                    <p className="session-topic">{session.topic}</p>
                  </div>
                  <button
                    className="join-button"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default button behavior
                      window.location.href = 'https://meet.google.com/new'; // Redirect to Google Meet
                    }}
                  >
                    <Video size={16} />
                    Join
                  </button>
                </div>
                <div className="session-meta">
                  <div className="meta-item">
                    <Calendar size={16} />
                    {session.date}
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    {session.timeSlot}
                  </div>
                </div>
              </div>
            ))}
            {sessions.filter((session) => !isPastSession(session.date)).length === 0 && <p>No upcoming sessions found.</p>}
          </div>
        </div>

        {/* Past Sessions Section */}
        <div className="session-section">
          <h2 className="section-title">Past Sessions</h2>
          <div className="sessions-list">
            {/* Filter past sessions */}
            {sessions.filter((session) => isPastSession(session.date)).map((session) => (
              <div key={session.id} className="session-card">
                <div className="session-header">
                  <div className="session-info">
                    <h3 className="mentor-name">{session.teacher.name}</h3>
                    <p className="session-topic">{session.topic}</p>
                  </div>
                  <span className="completed-status">Completed</span>
                </div>
                <div className="session-meta">
                  <div className="meta-item">
                    <Calendar size={16} />
                    {session.date}
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    {session.timeSlot}
                  </div>
                </div>
              </div>
            ))}
            {sessions.filter((session) => isPastSession(session.date)).length === 0 && <p>No past sessions found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sessions;
