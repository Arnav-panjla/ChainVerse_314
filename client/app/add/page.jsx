'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import avatar from '@public/assets/member1.jpg';

export default function Chat() {
  const [chatId, setChatId] = useState(-1);
  const [character, setCharacter] = useState('');
  const [nature, setNature] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
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
  function convertString(input) {
    // Replace newline characters with commas and keep spaces intact
    const result = input
      .replace(/\r?\n|\r/g, ', ') // Replace newline characters with a comma and a space
      .trim(); // Trim leading and trailing whitespace
  
    return result;
  }
  

  // Handle the form submission
  const handleStartChat = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // Capitalize the character name
    setCharacter(capitalizeWords(character));


    try {
      const response = await fetch('/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          charName: character ,
          charNature : convertString(nature),
          imageUrl : imageUrl
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Start chat response:', data);
      setChatId(data.chatId);

    } catch (error) {
      console.error('Error starting chat:', error);
      setError('Failed to start chat. Please try again.');
    } finally {
      setIsLoading(false);
      setCharacter('');
      setNature('');
      setImageUrl('');
    }
  };



  const handleGenerateProfileImage = async (event) => {
    event.preventDefault();
    setIsGenerating(true);
    setIsDisabled(true);
    setError(null);

    // Capitalize the character name
    setCharacter(capitalizeWords(character));
    

    try {
      const response = await fetch('/api/add/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          charName: character,
          charNature : convertString(nature)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile image response:', data);
      setImageUrl(data.imageUrl);
      setIsGenerating(false);
      setIsDisabled(false);

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
    setChatId(-1);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl text-white font-bold mb-8">
        Add a New Person
      </h1>
      <Image
        src={imageUrl || '/assets/member1.jpg'} // Use fallback if imageUrl is not available
        alt={character || 'Default Image'}
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
            placeholder="Describe your character  "
            rows={2}
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
            disabled={isLoading || isDisabled}
          >
            {isLoading ? 'Starting Chat...' : 'Start Chat'}
          </button>
        </form>
        
        {chatId !== -1  && (
          <div className="text-green-500 mb-2">
            Added successfully: <br />
            ID: {chatId}
          </div>
        )}
      </div>
    </div>
  );
}
