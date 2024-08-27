'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/chat', { message });
      setResponses([...responses, { user: message, bot: response.data.response }]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Chat with Bot</h1>
      <div className="w-full max-w-md bg-white p-4 border rounded-lg shadow-md">
        <div className="h-60 overflow-y-auto mb-4">
          {responses.map((entry, index) => (
            <div key={index} className="mb-2">
              <div className="font-bold">You:</div>
              <div>{entry.user}</div>
              <div className="font-bold mt-2">Bot:</div>
              <div>{entry.bot}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex">
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
      </div>
    </div>
  );
}
