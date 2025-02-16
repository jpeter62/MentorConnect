import React, { useState, useEffect } from 'react';
import { Star, Filter } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './FindMentor.css';

const FindMentors = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulated dynamic data for expertise, rating, and availability
    const dynamicData = [
      {
        expertise: ['Java', 'Python', 'Data Science'],
        rating: 4.9,
        
      },
      {
        expertise: ['System Design', 'Cloud', 'AI'],
        rating: 4.8,
       
      },
      {
        expertise: ['Ethical Hacking', 'Cryptography', 'Network Security'],
        rating: 4.7,
        
      },
      {
        expertise: ['JavaScript', 'React', 'Node.js'],
        rating: 4.6,
        
      },
    ];

    // Fetch mentors data from the backend
    axios.get('http://localhost:8080/api/teachers')
      .then(response => {
        const backendMentors = response.data;

        // Merge backend data with dynamic data
        const mergedMentors = backendMentors.map((mentor, index) => ({
          ...mentor,
          ...dynamicData[index % dynamicData.length], // Cycle through dynamicData if backendMentors exceed its length
        }));

        setMentors(mergedMentors); // Set merged data to state
      })
      .catch(error => {
        console.error('Error fetching mentor data:', error);
        setError('Failed to load mentors. Please try again later.');
      });
  }, []);

  const handleBookSession = (mentor) => {
    navigate('/booksession', { state: { mentor } });  // Pass the selected mentor as state to the BookingSession page
  };


  return (
    <div className="mentors-container">
      <div className="header">
        <h1>Find Your Perfect Mentor</h1>
        
      </div>

      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="mentors-grid">
          {mentors.map((mentor, index) => (
            <div key={index} className="mentor-card">
              <div className="mentor-avatar"></div>
              <h3>{mentor.name}</h3> {/* Fetched mentor name */}
              <p className="title">{mentor.title}</p> {/* Fetched mentor title */}
              <div className="expertise-tags">
                {mentor.expertise.map((skill, i) => (
                  <span key={i} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="rating">
                <Star className="star-icon" size={16} />
                <span>{mentor.rating}</span> {/* Dynamic rating */}
              </div>
              <p className="availability">{mentor.availability}</p> {/* Dynamic availability */}
              <button 
                className="book-button" 
                onClick={() => handleBookSession(mentor)}>
                Book Session
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindMentors;
