'use client';

import React, { useState, useEffect,useRef } from 'react';
import { usePathname } from 'next/navigation';
import Picker from 'emoji-picker-react';

export default function Chat() {
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const pathname = usePathname();
    const [character, setCharacter] = useState('');
    const [chatId, setChatId] = useState(null);


    // Ref for the chat container
    const chatContainerRef = useRef(null);

    // Auto-scroll to the bottom when new messages are added
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
                ...(message ? [{ role: 'user', content: message }] : []),
                ...data.latestMessage,
            ]);
            setMessage('');
        } catch (error) {
            setError('Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const onEmojiClick = (emojiData) => {
        setMessage(prevMessage => prevMessage + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl text-white font-bold mb-2">
                {character || "Unknown"}
            </h1>
            <div className="w-[75vw] bg-white p-4 border rounded-lg shadow-md">
                <div className="h-[60vh] overflow-y-auto mb-2"
                ref={chatContainerRef}
                >
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
                {showEmojiPicker && (
                        <div className="absolute bottom-[50px] right-[50px]">
                            <Picker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                <form onSubmit={handleAddMessage} className="flex flex-col">
                    <div className="flex">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1 border p-2 rounded-l-lg"
                            placeholder="Type your message..."
                            required
                        />
                        <button
                            type="button"
                            className="bg-gray-200 text-gray-800 p-2 rounded-r-lg"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            😊
                        </button>
                    </div>
                    
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-lg mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
}
