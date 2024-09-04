'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import avatar from '@public/assets/member1.jpg';



export default function Chat() {
  const [chatId, setChatId] = useState(0);
  const [character, setCharacter] = useState('');
  const [nature, setNature] = useState([]);
  const [responses, setResponses] = useState([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);



  const handleStartChat = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: `You are an ${character} simulating the role of my friend, in a friendly, engaging, and authentic manner. lets start with a simple Hi!`
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Start chat response:', data);
      setChatId(data.chatId);
      // setResponses(prev => [...prev, ...(message ? [{ role: 'user', content: message }] : []), ...data.latestMessage]);
      setChatStarted(true);
    } catch (error) {
      console.error('Error starting chat:', error);
      setError('Failed to start chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center ">
      <h1 className="text-2xl text-white font-bold mb-8">
        Add a new person
      </h1>
      <Image
                src={avatar}
                alt={character}
                width={200}   // You can adjust these values based on your layout needs
                height={200}  // You can adjust these values based on your layout needs
                className=" rounded-full mr-4"
              />
      <div className="w-[75vw] bg-transparent p-4 rounded-lg shadow-md">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        
        <form onSubmit={handleStartChat} className="flex flex-col space-y-4">
        <input
            type="text"
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            className="border p-2 rounded-lg"
            placeholder="Enter name of character..."
            required
          />
          <textarea
            value={nature}
            onChange={(e) => setNature(e.target.value)}
            className="border p-2 rounded-lg mb-2"
            placeholder="Enter nature of your character (one per line)"
            rows={3}
          />
          
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg" disabled={isLoading}>
            {isLoading ? 'Starting Chat...' : 'Start Chat'}
          </button>
        </form>
        
        {chatId!==0 && <p className="text-green-500 mb-2">
          character added sucessfully:
          {character} 
          Id-{chatId}
        </p>}
        
      </div>
    </div>
  );
}