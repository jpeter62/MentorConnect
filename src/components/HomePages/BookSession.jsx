import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Cookies from 'js-cookie';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';  
import axios from 'axios';
import './BookSession.css';

const BookingSession = () => {
  const { state } = useLocation();
  const { mentor } = state || {};

  const [loggedEmail, setLoggedEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]); // ✅ Fetch from API
  const [sessionTopic, setSessionTopic] = useState('');

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('loggedInEmail') || Cookies.get('loggedInEmail');
    setLoggedEmail(storedEmail);
  }, []);

  // ✅ Fetch available slots when mentor & date are selected
  useEffect(() => {
    if (mentor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [mentor, selectedDate]);

  // ✅ Fetch available time slots from backend
  const fetchAvailableSlots = async () => {
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const response = await axios.get(`http://localhost:8080/api/schedules/available/${mentor.id}/${formattedDate}`);
      setAvailableTimeSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  // ✅ Handle booking confirmation
  const handleBookingConfirmation = () => {
    if (!mentor || !selectedDate || !selectedTimeSlot || !sessionTopic) {
      alert('Please fill all booking details');
      return;
    }

    const loggedEmail = sessionStorage.getItem('loggedInEmail') || Cookies.get('loggedInEmail');

    axios.get(`http://localhost:8080/api/students/getStudentIdByEmail1?email=${loggedEmail}`)
      .then(response => {
        const studentId = response.data;
        const formattedDate = selectedDate.toISOString().split('T')[0];

        const bookingDetails = {
          studentId: studentId,
          teacherId: mentor.id,
          date: formattedDate,
          timeSlot: selectedTimeSlot,
          topic: sessionTopic
        };

        axios.post('http://localhost:8080/api/sessions/book', bookingDetails)
          .then(() => {
            alert('Booking successful!');
          })
          .catch(error => {
            console.error('Booking error:', error);
            alert('Booking failed');
          });
      })
      .catch(error => {
        console.error('Error retrieving student ID:', error);
        alert('Failed to retrieve student ID');
      });
  };

  return (
    
    <div className="bs-container">
          <div className="bs-header">
        <h1>Book Session</h1>
      </div>
      
      <div className="bs-session-details">
        {mentor ? (
          <div>
            <h2 className="bs-mentor-name">{mentor.name}</h2>
            <p className="bs-mentor-title">{mentor.title}</p>
            <p className="bs-mentor-expertise">{mentor.expertise.join(', ')}</p>

            <div className="bs-booking-grid">
              <div className="bs-date-picker-container">
                <label className="bs-input-label">Select Date</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={new Date()}
                  className="bs-date-picker-input"
                />
              </div>

              <div className="bs-time-slot-container">
                <label className="bs-input-label">Available Time Slots</label>
                <div className="bs-time-slots-grid">
                  {availableTimeSlots.length > 0 ? (
                    availableTimeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`bs-time-slot-btn ${
                          selectedTimeSlot === slot ? 'bs-time-slot-selected' : ''
                        }`}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <p className="bs-no-slots">No slots available for this date.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bs-topic-container">
              <label className="bs-input-label">Session Topic</label>
              <input
                type="text"
                value={sessionTopic}
                onChange={(e) => setSessionTopic(e.target.value)}
                placeholder="Enter session topic"
                className="bs-topic-input"
              />
            </div>

            <div className="bs-summary-box">
              <h3 className="bs-summary-title">Booking Summary</h3>
              <p className="bs-summary-text">Mentor: {mentor.name}</p>
              <p className="bs-summary-text">Date: {selectedDate ? selectedDate.toLocaleDateString() : 'Not selected'}</p>
              <p className="bs-summary-text">Time: {selectedTimeSlot || 'Not selected'}</p>
            </div>

            <button onClick={handleBookingConfirmation} className="bs-confirm-btn">
              Confirm Booking
            </button>
          </div>
        ) : (
          <div className="bs-empty-state">
            <Calendar className="bs-empty-state-icon" />
            <p className="bs-empty-state-text">Select a mentor to start booking</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSession;
