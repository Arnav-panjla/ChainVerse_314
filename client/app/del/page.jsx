"use client"
import React, { useState, useEffect } from 'react';

export default function ChatList() {
  const [chats, setChats] = useState([]);

  // Function to fetch chats
  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chatsList');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setChats(data);
      console.log(`Fetched chats: `, chats); // Log the fetched data instead of the state
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };
  

  // Fetch data when the component mounts
  useEffect(() => {
    fetchChats();
  }, []);

  // Handle delete operation
  const handleDelete = async (chatId) => {
    try {
      await fetch(`/api/del/${chatId}`, {
        method: 'DELETE',
      });

      // Refresh the list after successful deletion
      setChats(chats.filter((chat) => chat.chatId !== chatId));
    } catch (error) {
      console.error('Error deleting chat:', error);
      // Optionally handle the error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="flex flex-col items-center">
        <h1 className="text-4xl text-white font-bold mb-6 mt-4">Chat List</h1>
        <div className="w-[75vw] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-transparent p-4 rounded-lg shadow-md">
            {chats.map((chat) => (
            <div key={chat.chatId} className="card mb-4 p-4 border border-gray-300 rounded-lg flex flex-col grow items-center">
                <h2 className="text-2xl text-white font-semibold">{chat.charName}</h2>
                <img
                src={chat.charImageUrl}
                alt={chat.charName}
                className="w-36 h-36 object-cover rounded-full mb-2"
                />
                <p className="text-white">Chain ID: {chat.chatId}</p>
                <button
                onClick={() => handleDelete(chat.chatId)}
                className=" bg-red-500 text-xl text-white p-2 rounded-lg mt-2 w-full hover:opacity-80 place-items-end"
                >
                Remove
                </button>
            </div>
            ))}
        </div>
    </div>

  );
}
