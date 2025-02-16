import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Check, X, Search, Filter } from 'lucide-react';
import axios from 'axios';
import './SessionRequests.css';

const SessionRequests = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [confirmedRequests, setConfirmedRequests] = useState([]);
  const [teacherEmail, setTeacherEmail] = useState('');

  useEffect(() => {
    const fetchTeacherEmail = () => {
      const storedEmail = sessionStorage.getItem('loggedInEmail');
      if (storedEmail) {
        setTeacherEmail(storedEmail);
        fetchSessionRequests(storedEmail); // Fetch session requests using the teacher's email
      }
    };

    fetchTeacherEmail();
  }, []);

  const fetchSessionRequests = async (email) => {
    try {
      const teacherIdResponse = await axios.get('http://localhost:8080/api/sessions/teacher/id-by-email', {
        params: { email }
      });
      const teacherId = teacherIdResponse.data;
      if (!teacherId) return;

      // Fetch the teacher's sessions using the teacherId
      const sessionsResponse = await axios.get('http://localhost:8080/api/sessions/teacher', {
        params: { teacherId }
      });

      const sessions = sessionsResponse.data;
      setPendingRequests(sessions.filter((session) => session.status === 'PENDING'));
      setConfirmedRequests(sessions.filter((session) => session.status === 'CONFIRMED'));
    } catch (error) {
      console.error('Error fetching session requests:', error.response ? error.response.data : error.message);
    }
  };

  const updateSessionStatus = async (sessionId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/sessions/${sessionId}`,
        { status: newStatus },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const updatedSession = response.data;

      if (newStatus === 'CONFIRMED') {
        setPendingRequests((prevRequests) => prevRequests.filter((session) => session.id !== sessionId));
        setConfirmedRequests((prevRequests) => [...prevRequests, updatedSession]);
      } else if (newStatus === 'CANCELLED') {
        setPendingRequests((prevRequests) => prevRequests.filter((session) => session.id !== sessionId));
      }
    } catch (error) {
      console.error('Error updating session status:', error);
    }
  };

  const filteredPendingRequests = pendingRequests.filter((request) =>
    request.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredConfirmedRequests = confirmedRequests.filter((request) =>
    request.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="requests-container">
      <div className="requests-header">
        <div className="header-title">
          <h1>Session Requests</h1>
          <span className="request-count">{pendingRequests.length} pending</span>
        </div>

        <div className="header-controls">
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="tab-buttons">
            <button
              className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </button>
            <button
              className={`tab-button ${activeTab === 'confirmed' ? 'active' : ''}`}
              onClick={() => setActiveTab('confirmed')}
            >
              Confirmed
            </button>
          </div>

          <button className="filter-button">
            <Filter className="icon" />
            Filter
          </button>
        </div>
      </div>

      <div className="requests-grid">
        {activeTab === 'pending' && (filteredPendingRequests.length === 0 ? (
          <div className="empty-state">
            <p>No pending requests found</p>
          </div>
        ) : (
          filteredPendingRequests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-content">
                <div className="student-info">
                  <img src={request.student.image} alt={request.student.name} />
                  <div className="student-details">
                    <h3>{request.student.name}</h3>
                    <p className="course-info">{request.student.course} • {request.student.level}</p>
                    <p className="topic">{request.topic}</p>
                  </div>
                </div>

                <div className="session-info">
                  <div className="info-item">
                    <Calendar className="icon" />
                    <span>{request.date}</span>
                  </div>
                  <div className="info-item">
                    <Clock className="icon" />
                    <span>{request.time} ({request.duration})</span>
                  </div>
                </div>
              </div>

              <div className="request-actions">
                <button className="btn-decline" onClick={() => updateSessionStatus(request.id, 'CANCELLED')}>
                  <X className="icon" />
                  Decline
                </button>
                <button className="btn-accept" onClick={() => updateSessionStatus(request.id, 'CONFIRMED')}>
                  <Check className="icon" />
                  Accept
                </button>
              </div>
            </div>
          ))
        ))}

        {activeTab === 'confirmed' && (filteredConfirmedRequests.length === 0 ? (
          <div className="empty-state">
            <p>No confirmed requests found</p>
          </div>
        ) : (
          filteredConfirmedRequests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-content">
                <div className="student-info">
                  <img src={request.student.image} alt={request.student.name} />
                  <div className="student-details">
                    <h3>{request.student.name}</h3>
                    <p className="course-info">{request.student.course} • {request.student.level}</p>
                    <p className="topic">{request.topic}</p>
                  </div>
                </div>

                <div className="session-info">
                  <div className="info-item">
                    <Calendar className="icon" />
                    <span>{request.date}</span>
                  </div>
                  <div className="info-item">
                    <Clock className="icon" />
                    <span>{request.time} ({request.duration})</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default SessionRequests;
