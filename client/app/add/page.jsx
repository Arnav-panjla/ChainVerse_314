'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import avatar from '@public/assets/member1.jpg';

export default function Chat() {
  const [chatId, setChatId] = useState(0);
  const [character, setCharacter] = useState('');
  const [nature, setNature] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl,setImageUrl] = useState('')

  // Capitalize each word in a string
  const capitalizeWords = (str) => {
    return str
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  };

  // Handle the form submission
  const handleStartChat = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // Capitalize the character name
    const formattedCharacter = capitalizeWords(character);
    setCharacter(formattedCharacter);

    try {
      const response = await fetch('/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ charName: formattedCharacter }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Start chat response:', data);
      setIma(data.chatId);

    } catch (error) {
      console.error('Error starting chat:', error);
      setError('Failed to start chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  const handleGenerateProfileImage = async (event) => {
    event.preventDefault();
    setIsGenerating(true);
    setError(null);

    // Capitalize the character name
    const formattedCharacter = capitalizeWords(character);
    setCharacter(formattedCharacter);

    try {
      const response = await fetch('/api/add/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ charName: formattedCharacter }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile image response:', data);
      setImageUrl(data.url);

    } catch (error) {
      console.error('Error starting chat:', error);
      setError('Failed to start chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  // Handle reset form
  const handleReset = () => {
    setCharacter('');
    setNature('');
    setChatId(0);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl text-white font-bold mb-8">
        Add a New Person
      </h1>
      <Image
        src={imageUrl}
        alt={character}
        width={200}
        height={200}
        className="rounded-full mb-4"
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
          <button
          onClick={handleGenerateProfileImage}
          className="bg-blue-500 text-white p-2 rounded-lg"
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating image.....':'Generate Profile Image'}
        </button>
          
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Starting Chat...' : 'Start Chat'}
          </button>
        </form>
        
        {chatId  && (
          <div className="text-green-500 mb-2">
            Character added successfully: {character} <br />
            ID: {chatId}
          </div>
        )}
      </div>
    </div>
  );
}
