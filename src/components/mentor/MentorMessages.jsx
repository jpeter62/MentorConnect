import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './MentorMessages.css';

const MentorMessages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [students, setStudents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [lastMessages, setLastMessages] = useState({}); // New state for last messages
  const [teacherId, setTeacherId] = useState(null);
  const [loggedEmail, setLoggedEmail] = useState('');
  const [error, setError] = useState(null);

  // Fetch the logged-in mentor's email and retrieve teacher ID
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('loggedInEmail') || Cookies.get('loggedInEmail');
    if (storedEmail) {
      setLoggedEmail(storedEmail);

      axios
        .get(`http://localhost:8080/api/teachers/email/${storedEmail}`)
        .then((response) => {
          setTeacherId(response.data.id);
        })
        .catch((error) => {
          console.error('Error fetching teacher ID:', error);
          setError('Failed to fetch teacher ID.');
        });
    } else {
      setError('No logged-in email found.');
    }
  }, []);

  // Fetch students who have messaged the mentor and their last messages
  useEffect(() => {
    if (!teacherId) return;

    axios
      .get(`http://localhost:8080/api/messages/students/${teacherId}`)
      .then((response) => {
        setStudents(response.data);
        // Fetch last message for each student
        response.data.forEach(student => {
          fetchLastMessage(student.id);
        });
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        setError('Failed to load students.');
      });
  }, [teacherId]);

  // New function to fetch last message for a student
  const fetchLastMessage = (studentId) => {
    axios
      .get(`http://localhost:8080/api/messages/conversation/last`, {
        params: {
          studentId: studentId,
          teacherId: teacherId
        }
      })
      .then((response) => {
        if (response.data) {
          setLastMessages(prev => ({
            ...prev,
            [studentId]: response.data
          }));
        }
      })
      .catch((error) => {
        console.error(`Error fetching last message for student ${studentId}:`, error);
      });
  };

  // Fetch messages between mentor and selected student
  useEffect(() => {
    if (!selectedChat || !teacherId) return;

    setMessages([]); // Reset messages

    axios
      .get(`http://localhost:8080/api/messages/conversation`, {
        params: {
          studentId: selectedChat.id,
          teacherId: teacherId
        }
      })
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages.');
      });
  }, [selectedChat, teacherId]);

  // Send message handler
  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const senderId = teacherId;

    axios
      .post('http://localhost:8080/api/messages/send', null, {
        params: {
          studentId: selectedChat.id,
          teacherId: teacherId,
          senderId: senderId,
          content: message,
        },
      })
      .then((response) => {
        // Update conversation messages
        setMessages(prev => [...prev, response.data]);
        
        // Update last message for this student
        setLastMessages(prev => ({
          ...prev,
          [selectedChat.id]: response.data
        }));
        
        setMessage('');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        setError('Failed to send message.');
      });
  };

  return (
    <div className="page-container">
      <div className="app-container loaded">
        <div className="messages-wrapper">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-header">
              <h2>Your Students</h2>
            </div>

            <div className="chat-list">
              {students.map((student) => (
                <div
                  key={student.id}
                  className={`chat-item ${selectedChat?.id === student.id ? 'active' : ''}`}
                  onClick={() => setSelectedChat(student)}
                >
                  <div className="chat-item-content">
                    <h3 className="student-name">{student.name}</h3>
                    <p className="last-message">
                      {lastMessages[student.id]?.content || 'No messages yet'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="chat-window">
            {selectedChat ? (
              <>
                <div className="chat-header">
                  <h2 className="selected-student-name">{selectedChat.name}</h2>
                </div>

                <div className="messages-container">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.senderId === teacherId ? 'sent' : 'received'}`}>
                      <div className="message-content">
                        <p>{msg.content}</p>
                        <span className="message-time">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="message-input-container">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="message-input"
                  />
                  <button className="send-button" onClick={handleSendMessage}>
                    <Send size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">Select a conversation to start messaging</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorMessages;