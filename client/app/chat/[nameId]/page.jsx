"use client"
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Camera, Mic, Heart, Info } from 'lucide-react';
import Link from 'next/link';
import Picker from 'emoji-picker-react';

export default function Chat() {
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [imageUrl, setImageUrl] = useState('')

    const pathname = usePathname();
    const [character, setCharacter] = useState('');
    const [chatId, setChatId] = useState(null);

    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);

    const onEmojiClick = (emojiData) => {
        setMessage(prevMessage => prevMessage + emojiData.emoji);
        setShowEmojiPicker(false);
    };


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [responses]);

    useEffect(() => {
        if (pathname) {
            const nameId = pathname.split('/').pop();
            if (nameId) {
                const decodedNameId = decodeURIComponent(nameId);
                const [characterName, id] = decodedNameId.split('-');
                setCharacter(characterName);
                setChatId(id);

                const fetchInitialChat = async () => {
                    if (id) {
                        setIsLoading(true);
                        setError(null);
                        try {
                            const response = await fetch('/api/initial-chat', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ chatId: id }),
                            });
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            const data = await response.json();
                            setResponses(data.prevMessages);
                            setImageUrl(data.charImageUrl)
                        } catch (error) {
                            setError('Failed to load initial chat. Please try again.');
                        } finally {
                            setIsLoading(false);
                        }
                    }
                };

                fetchInitialChat();
            }
        }
    }, [pathname]);

    const handleAddMessage = async (event) => {
        event.preventDefault();
        if (!message.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, chatId }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setResponses(prev => [
                ...prev,
                { role: 'user', content: message },
                ...data.latestMessage,
            ]);
            setMessage('');
        } catch (error) {
            setError('Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="bg-white border-b p-4 flex items-center">
                <Link href="/chat" className="mr-4">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <Image
                    src={imageUrl}
                    alt={character}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                />
                <div className="flex-1">
                    <h1 className="font-semibold">{character || "Unknown"}</h1>
                    {isLoading ? <p className="text-xs text-green ">Typing ...</p> : <p className="text-xs text-gray-500">Active now</p> }
                </div>
                <Info className="w-6 h-6 text-gray-600" />
            </header>

            <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {responses.map((entry, index) => (
                    <div 
                        key={index} 
                        className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div 
                            className={`max-w-[70%] p-3 rounded-2xl ${
                                entry.role === 'user' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-300 text-black'
                            }`}
                        >
                            {entry.content}
                        </div>
                    </div>
                ))}
                {error && <div className="text-red-500 text-center">{error}</div>}
            </div>
            {showEmojiPicker && (
                        <div className="absolute bottom-[50px] right-[50px]">
                            <Picker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
            <form onSubmit={handleAddMessage} className="bg-white border-t p-4 flex items-center">
                <Camera className="w-6 h-6 text-gray-600 mr-3" />
                <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 bg-gray-100 rounded-full py-2 px-4 focus:outline-none"
                    placeholder="Message..."
                />
                {message.trim() ? (
                    <>
                    <button
                    type="button"
                    className="bg-gray-200 text-xl text-gray-800 p-2 ml-2 rounded-full"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                    😊
                    </button>
                    <button
                        type="submit"
                        className="ml-3 text-blue-500 font-semibold"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                    
                </>
                ) : (
                    <Mic className="w-6 h-6 text-gray-600 ml-3" />
                )}
            </form>
        </div>
    );
}