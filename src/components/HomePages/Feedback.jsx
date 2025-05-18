import React, { useState, useEffect, useCallback } from 'react';
import { Star } from 'lucide-react';
import './Feedback.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [previousFeedback, setPreviousFeedback] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [loggedEmail, setLoggedEmail] = useState(null);

  // Fetch the logged-in user's email and retrieve student ID
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('loggedInEmail') || Cookies.get('loggedInEmail');
    if (storedEmail) {
      setLoggedEmail(storedEmail);

      // Fetch student ID based on email
      axios
        .get(`http://localhost:8080/api/students/email/${storedEmail}`)
        .then((response) => {
          setStudentId(response.data.id); // Assuming the response contains the student's ID
        })
        .catch((error) => {
          console.error('Error fetching student ID:', error);
          setError('Failed to fetch student ID. Please try again later.');
        });
    } else {
      setError('No logged-in email found.');
    }
  }, []);

  // Fetch mentors data from the backend
  const fetchMentors = useCallback(() => {
    axios
      .get('http://localhost:8080/api/teachers')
      .then((response) => {
        setMentors(response.data);
      })
      .catch((error) => {
        console.error('Error fetching mentor data:', error);
        setError('Failed to load mentors. Please try again later.');
      });
  }, []);

  // Fetch parevious feedback
  const fetchPreviousFeedback = useCallback(() => {
    if (!studentId) return;

    axios
      .get(`http://localhost:8080/api/feedback/student/${studentId}`)
      .then((response) => {
        setPreviousFeedback(response.data);
      })
      .catch((error) => {
        console.error('Error fetching feedback:', error);
        setError('Failed to fetch previous feedback. Please try again later.');
      });
  }, [studentId]);

  useEffect(() => {
    if (studentId) {
      fetchMentors();
      fetchPreviousFeedback();
    }
  }, [fetchMentors, fetchPreviousFeedback, studentId]);

  const handleSubmit = async () => {
    if (!rating) {
      alert('Please select a rating before submitting feedback.');
      return;
    }
    if (!selectedMentor) {
      alert('Please select a mentor to provide feedback.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/feedback', {
        student: { id: studentId }, // Nested object with student ID
  teacher: { id: selectedMentor }, // Nested object with teacher ID
  rating,
  comment: feedback
      });

      alert('Feedback submitted successfully!');
      setFeedback('');
      setRating(0);
      fetchPreviousFeedback(); // Refresh feedback list after submission
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-form">
        <h1 className="page-title">Session Feedback</h1>
        <div className="form-content">
          {/* Mentor Selection - Display mentors as clickable cards */}
          <div className="mentor-selection">
            <label className="form-label">Select a Mentor</label>
            <div className="mentor-list">
              {mentors.length === 0 ? (
                <p>No mentors available</p>
              ) : (
                mentors.map((mentor) => (
                  <div
  key={mentor.id}
  className={`mentor-card ${mentor.id === selectedMentor ? 'selected' : ''}`}
  onClick={() => setSelectedMentor(mentor.id)} // Correctly updates selected mentor
>
  <h3>{mentor.name}</h3>
</div>

                ))
              )}
            </div>
          </div>

          <div className="rating-section">
            <label className="form-label">Rate your session</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`star-icon ${star <= rating ? 'star-active' : ''}`}
                  onClick={() => setRating(star)}
                  title={`${star} Star${star > 1 ? 's' : ''}`}
                />
              ))}
            </div>
          </div>

          <div className="feedback-section">
            <textarea
              className="feedback-textarea"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What did you learn? How was the mentor's teaching style?"
              disabled={loading}
            />
          </div>

          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </div>

      {/* Previous Feedback */}
      <div className="previous-feedback">
        <h2 className="section-title">Previous Feedback</h2>
        {previousFeedback.length ? (
          previousFeedback.map((session) => (
            <div key={session.id} className="feedback-card">
              <h3 className="mentor-name">{session.teacher.name}</h3>
              <p className="feedback-text">{session.comment}</p>
              <div className="rating-display">
                {Array.from({ length: session.rating }).map((_, i) => (
                  <Star key={i} className="rating-star" />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="no-feedback-message">No feedback submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default Feedback;
