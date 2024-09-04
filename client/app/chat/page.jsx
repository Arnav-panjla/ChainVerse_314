'use client';

import Link from 'next/link';
import Image from 'next/image';
import avatar from '@public/assets/member1.jpg'; 

const ChatList = () => {
  const chats = [
    { name: "Messi", avatar: avatar, chatId: 28 },
    { name: "Vitalik", avatar: avatar, chatId: 29 },
    { name: "Doraemon", avatar: avatar, chatId: 30 },
  ]

  return (
    <div className="chat-list">
      <h1 className="text-4xl font-bold mb-4 text-white text-center ">Chats</h1>
      <ul>
        {chats.map((chat) => (
          <li key={chat.chatId} className="mb-2 border-b py-2 px-4 bg-white rounded-lg transform scale-100 hover:scale-[1.02] transition-transform duration-300">
            <Link href={`/chat/${chat.name}-${+chat.chatId}`} className="flex items-center text-black">
              <Image
                src={chat.avatar}
                alt={chat.name}
                width={50}   // You can adjust these values based on your layout needs
                height={50}  // You can adjust these values based on your layout needs
                className="w-16 h-16 rounded-full mr-4"
              />
              <div className="flex-1 text-xl font-semibold">{chat.name}</div>
              <div className="text-sm">Chat ID: {chat.chatId}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
