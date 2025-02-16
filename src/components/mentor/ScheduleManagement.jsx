import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Cookies from 'js-cookie';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import './ScheduleManagement.css';

const ScheduleManagement = () => {
  const [loggedTeacher, setLoggedTeacher] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [existingSchedules, setExistingSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  useEffect(() => {
    fetchLoggedTeacher();
  }, []);

  useEffect(() => {
    if (loggedTeacher && selectedDate) {
      fetchExistingSchedules();
    }
  }, [loggedTeacher, selectedDate]);

  const fetchLoggedTeacher = async () => {
    const loggedEmail = sessionStorage.getItem('loggedInEmail') || Cookies.get('loggedInEmail');
    if (!loggedEmail) {
      alert('No teacher logged in!');
      return;
    }
    
    try {
      console.log("Fetching teacher for email:", loggedEmail);
      const response = await axios.get(`http://localhost:8080/api/teachers/email/${loggedEmail}`);
      setLoggedTeacher(response.data);
    } catch (error) {
      console.error('Error fetching teacher:', error);
    }
  };

  const fetchExistingSchedules = async () => {
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const response = await axios.get(`http://localhost:8080/api/schedules/available/${loggedTeacher.id}/${formattedDate}`);
      setExistingSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleTimeSlotToggle = async (slot) => {
    const newSlots = selectedTimeSlots.includes(slot)
      ? selectedTimeSlots.filter((s) => s !== slot)
      : [...selectedTimeSlots, slot];
  
    setSelectedTimeSlots(newSlots);
  
    if (!newSlots.includes(slot)) {
      try {
        await axios.post('http://localhost:8080/api/schedules/set-unavailable', {
          teacherId: loggedTeacher.id,
          date: selectedDate.toISOString().split('T')[0],
          unavailableSlots: [slot],
        });
        console.log(`Marked ${slot} as unavailable`);
      } catch (error) {
        console.error('Error marking slot unavailable:', error);
      }
    }
  };

  const handleSaveSchedule = async () => {
    if (!loggedTeacher || !selectedDate || selectedTimeSlots.length === 0) {
      alert('Please select a date and at least one time slot.');
      return;
    }

    setLoading(true);
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const scheduleData = selectedTimeSlots.map((slot) => ({
        teacherId: loggedTeacher.id,
        date: formattedDate,
        timeSlot: slot,
        available: true,
      }));

      await axios.post('http://localhost:8080/api/schedules/save', scheduleData);
      alert('Schedule saved successfully!');
      setSelectedTimeSlots([]);
      fetchExistingSchedules();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher-schedule-wrapper">
      <h2 className="teacher-schedule-title">Set Your Availability</h2>
      {loggedTeacher ? (
        <p className="teacher-login-status">
          Logged in as: <strong>{loggedTeacher.name}</strong>
        </p>
      ) : (
        <p className="teacher-login-status">Loading teacher details...</p>
      )}
      
      <div className="teacher-schedule-layout">
        <div className="teacher-date-section">
          <label className="teacher-date-label">Select Date</label>
          <div className="teacher-date-picker">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()}
              className="teacher-date-input"
            />
          </div>
        </div>
        
        <div className="teacher-timeslot-section">
          <label className="teacher-timeslot-label">Select Available Time Slots</label>
          <div className="teacher-timeslot-grid">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => handleTimeSlotToggle(slot)}
                className={`teacher-timeslot-button ${
                  selectedTimeSlots.includes(slot) ? 'selected' : ''
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSaveSchedule}
        disabled={loading}
        className="teacher-save-button"
      >
        {loading ? 'Saving...' : 'Save Availability'}
      </button>

      <div className="teacher-schedule-list">
        <h3 className="teacher-schedule-subtitle">Existing Schedules</h3>
        <ul className="teacher-schedule-items">
          {existingSchedules.map((schedule) => (
            <li
              key={schedule.id}
              className={`teacher-schedule-item ${
                schedule.isAvailable ? 'available' : ''
              }`}
            >
              {schedule.date} - {schedule.timeSlot} ({schedule.isAvailable ? 'Available' : 'Booked'})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScheduleManagement;