import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [userName, setUserName] = useState('');

  // Fetch messages from the backend
  const fetchMessages = async () => {
    try {
      const response = await fetch('https://chatbot-backend-nodejs.vercel.app/messages');
      const data = await response.json();
      setMessages(data.messages); // Update messages in the state
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    // Fetch all messages when the app loads
    fetchMessages();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!userMessage || !userName) {
      alert('Please enter your name and a message');
      return;
    }

    const messageData = {
      user: userName,
      message: userMessage,
    };

    try {
      // Send the user's message to the backend
      const response = await fetch('https://chatbot-backend-nodejs.vercel.app/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: data.user, message: data.message },
        { user: 'Chatbot', message: data.botResponse },
      ]);

      // Clear the input fields
      setUserMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="App">
      <h1>Sujal's Chatbot</h1>

      <div className="message-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.user === 'Chatbot' ? 'bot' : 'user'}`}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <textarea
          placeholder="Type your message..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
