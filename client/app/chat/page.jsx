'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [responses, setResponses] = useState([]);
  const [chatStarted, setChatStarted] = useState(false);

  const handleStartChat = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/chat/start-chat', { 
        message, 
        imageUrls: imageUrls.split('\n').filter(url => url.trim() !== '')
      });
      setResponses(response.data.messages);
      setChatStarted(true);
      setMessage('');
      setImageUrls('');
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const handleAddMessage = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/chat/add-message', { message });
      setResponses(response.data.messages);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl text-white font-bold mb-4">Chat with Bot</h1>
      <div className="w-[75vw] bg-white p-4 border rounded-lg shadow-md">
        <div className="h-[60vh] overflow-y-auto mb-4">
          {responses.map((entry, index) => (
            <div key={index} className="mb-2">
              <div className="font-bold">{entry.role === 'user' ? 'You:' : 'Bot:'}</div>
              <div>{entry.content}</div>
            </div>
          ))}
        </div>
        {!chatStarted ? (
          <form onSubmit={handleStartChat} className="flex flex-col">
            <textarea
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              className="border p-2 rounded-lg mb-2"
              placeholder="Enter image URLs (one per line)"
              rows={3}
            />
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border p-2 rounded-lg mb-2"
              placeholder="Type your message..."
              required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">Start Chat</button>
          </form>
        ) : (
          <form onSubmit={handleAddMessage} className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border p-2 rounded-l-lg"
              placeholder="Type your message..."
              required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg">Send</button>
          </form>
        )}
      </div>
    </div>
  );
}