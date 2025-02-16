import React, { useState, useEffect } from 'react';
import { Send, Plus, Search, X } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Messages.css';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [mentors, setMentors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [lastMessages, setLastMessages] = useState({}); // New state for last messages
  const [studentId, setStudentId] = useState(null);
  const [loggedEmail, setLoggedEmail] = useState('');
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch student ID based on logged-in email
  useEffect(() => {
    const storedEmail = Cookies.get('loggedInEmail');
    if (storedEmail) {
      setLoggedEmail(storedEmail);

      axios
        .get(`http://localhost:8080/api/students/email/${storedEmail}`)
        .then((response) => {
          if (response.data && response.data.id) {
            setStudentId(response.data.id);
          } else {
            setError('Student ID not found.');
          }
        })
        .catch((error) => {
          console.error('Error fetching student ID:', error);
          setError('Failed to fetch student ID.');
        });
    } else {
      setError('No logged-in email found.');
    }
  }, []);

  // Fetch mentors list and their last messages
  useEffect(() => {
    if (!studentId) return;

    axios
      .get('http://localhost:8080/api/teachers')
      .then((response) => {
        setMentors(response.data);
        // Fetch last message for each mentor
        response.data.forEach(mentor => {
          fetchLastMessage(mentor.id);
        });
      })
      .catch((error) => {
        console.error('Error fetching mentors:', error);
        setError('Failed to load mentors.');
      });
  }, [studentId]);

  // New function to fetch last message for a mentor
  const fetchLastMessage = (mentorId) => {
    axios
      .get(`http://localhost:8080/api/messages/conversation/last`, {
        params: {
          studentId: studentId,
          teacherId: mentorId
        }
      })
      .then((response) => {
        if (response.data) {
          setLastMessages(prev => ({
            ...prev,
            [mentorId]: response.data
          }));
        }
      })
      .catch((error) => {
        console.error(`Error fetching last message for mentor ${mentorId}:`, error);
      });
  };

  // Fetch conversation messages when a mentor is selected
  useEffect(() => {
    if (!selectedChat || !studentId) return;

    setMessages([]); // Reset messages

    axios
      .get(`http://localhost:8080/api/messages/conversation`, {
        params: {
          studentId: studentId,
          teacherId: selectedChat.id
        }
      })
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });
  }, [selectedChat, studentId]);

  // Send message handler
  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const senderId = studentId;

    axios
      .post('http://localhost:8080/api/messages/send', null, {
        params: {
          studentId: studentId,
          teacherId: selectedChat.id,
          senderId: senderId,
          content: message,
        },
      })
      .then((response) => {
        // Update conversation messages
        setMessages(prev => [...prev, response.data]);
        
        // Update last message for this mentor
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

  // Filter mentors based on search query
  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="app-container loaded">
        <div className="messages-wrapper">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-header">
              <h2>Your Mentors</h2>
            </div>

            <div className="chat-list">
              {filteredMentors.length > 0 ? (
                filteredMentors.map((mentor) =>
                  mentor && mentor.id ? (
                    <div
                      key={mentor.id}
                      className={`chat-item ${selectedChat?.id === mentor.id ? 'active' : ''}`}
                      onClick={() => setSelectedChat(mentor)}
                    >
                      <div className="chat-item-content">
                        <h3 className="mentor-name">{mentor.name}</h3>
                        <p className="last-message">
                          {lastMessages[mentor.id]?.content || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  ) : null
                )
              ) : (
                <p>No mentors available</p>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="chat-window">
            {selectedChat ? (
              <>
                <div className="chat-header">
                  <h2 className="selected-mentor-name">{selectedChat.name}</h2>
                </div>

                <div className="messages-container">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.senderId === studentId ? 'sent' : 'received'}`}>
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

export default Messages;