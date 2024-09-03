'use client';

import React, { useState } from 'react';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [chatId, setChatId] = useState(0);
  const [character, setCharacter] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [responses, setResponses] = useState([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStartChat = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/chat/start-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: `You are an ${character} simulating the role of my friend. Your task is to comment on the image in less than 50 words, in a friendly, engaging, and authentic manner.`,
          imageUrls: imageUrls.split('\n').filter(url => url.trim() !== '')
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Start chat response:', data);
      setChatId(data.chatId);
      setResponses(prev => [...prev, ...(message ? [{ role: 'user', content: message }] : []), ...data.latestMessage]);
      setChatStarted(true);
      setMessage('');
      setImageUrls('');
    } catch (error) {
      console.error('Error starting chat:', error);
      setError('Failed to start chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMessage = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/chat/add-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          chatId        
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Add message response:', data);
      setResponses(prev => [...prev, ...(message ? [{ role: 'user', content: message }] : []), ...data.latestMessage]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl text-white font-bold mb-2">
        Chat with {character ? character : "Bot"}
      </h1>
      <div className="w-[75vw] bg-white p-4 border rounded-lg shadow-md">
        <div className="h-[60vh] overflow-y-auto mb-2">
          {responses.map((entry, index) => (
            <div key={index} className="mb-2">
              <div className="font-bold">
                {entry.role === 'user' ? 'You:' : `${character || 'Bot'}:`}
              </div>
              <div>{entry.content}</div>
            </div>
          ))}
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
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
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              className="border p-2 rounded-lg mb-2"
              placeholder="Enter name of character..."
              required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg" disabled={isLoading}>
              {isLoading ? 'Starting Chat...' : 'Start Chat'}
            </button>
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
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
