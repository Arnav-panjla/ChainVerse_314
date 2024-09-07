'use client';

import Link from 'next/link';
import Image from 'next/image';
import avatar from '@public/assets/member1.jpg'; 
import { useState, useEffect } from 'react';

const ChatList = () => {

    const [chats, setChats] = useState([]);

    useEffect(() => {
      // Fetch the chat list from the API
      const fetchChats = async () => {
        try {
          const response = await fetch('/api/chatsList');
          if (!response.ok) {
            throw new Error('Failed to fetch chats');
          }
          const data = await response.json();
          setChats(data);

        } catch (error) {
          console.error(error);
        }
      };

      fetchChats();
    }, []);

  return (
    <div className="chat-list">
      <h1 className="text-4xl font-bold mb-8 mt-6 text-white text-center ">Chats</h1>
      <ul className='w-[75vw] mx-auto'>
        {chats.map((chat) => (
          <li key={chat.chatId} className="mb-2 border-b py-2 px-4 bg-white rounded-lg transform scale-100 hover:scale-[1.02] transition-transform duration-300">
            <Link href={`/chat/${chat.charName}-${+chat.chatId}`} className="flex items-center text-black">
              <Image
                src={chat.charImageUrl || '/assets/member1.jpg'} // Use fallback if imageUrl is not available
                alt={chat.charName || 'Default Image'}
                width={50}   // You can adjust these values based on your layout needs
                height={50}  // You can adjust these values based on your layout needs
                className="w-16 h-16 rounded-full mr-4"
              />
              <div className="flex-1 text-xl font-semibold">{chat.charName}</div>
              <div className="text-sm">Chat ID: {chat.chatId}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
