import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Star } from 'lucide-react';
import './FeedbackRating.css';

const FeedbackRating = () => {
  const [feedback, setFeedback] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loggedEmail = sessionStorage.getItem('loggedInEmail') || Cookies.get('loggedInEmail');
    if (!loggedEmail) {
      setError('No logged-in email found.');
      return;
    }

    axios.get(`http://localhost:8080/api/teachers/email/${loggedEmail}`)
      .then((response) => {
        const teacherId = response.data.id;
        return axios.get(`http://localhost:8080/api/feedback/teacher/${teacherId}`);
      })
      .then((response) => {
        setFeedback(response.data);
        if (response.data.length > 0) {
          const totalRatings = response.data.length;
          const average = response.data.reduce((sum, item) => sum + item.rating, 0) / totalRatings;
          setAverageRating(average);
          setTotalRatings(totalRatings);
        }
      })
      .catch((error) => {
        console.error('Error fetching feedback:', error);
        setError('Failed to fetch feedback.');
      });
  }, []);

  return (
    <div className="feedback-container">
      <h1 className="page-title">My Feedback & Ratings</h1>

      {error && <p className="error-message">{error}</p>}

      {feedback.length > 0 ? (
        <>
          <div className="stats-card">
            <h2>Average Rating</h2>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`star-icon ${star <= averageRating ? 'star-active' : ''}`} />
              ))}
            </div>
            <p>{averageRating.toFixed(1)} / 5</p>
            <p className="total-ratings">Based on {totalRatings} ratings</p>
          </div>

          <div className="feedback-list">
            {feedback.map((item) => (
              <div key={item.id} className="feedback-card">
                <div className="feedback-content">
                  <img src={item.student.image || '/default-avatar.png'} alt={item.student.name} className="student-image" />
                  <div className="feedback-details">
                    <h3 className="student-name">{item.student.name}</h3>
                    <p className="comment">"{item.comment}"</p>
                    <div className="rating-stars">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className={`rating-star ${index < item.rating ? 'star-active' : ''}`} />
                      ))}
                    </div>
                    <span className="feedback-date">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="no-feedback">No feedback received yet.</p>
      )}
    </div>
  );
};

export default FeedbackRating;
