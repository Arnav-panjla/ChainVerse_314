'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import from next/navigation

export default function Chat() {
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get the current pathname
    const pathname = usePathname();
    const [character, setCharacter] = useState('');
    const [chatId, setChatId] = useState(null);
    useEffect(() => {
        if (pathname) {
            // Extract nameId from the pathname
            const nameId = pathname.split('/').pop(); // Get the last part of the pathname
            if (nameId) {
                // Decode the URL-encoded string
                const decodedNameId = decodeURIComponent(nameId);
                // Split the decoded string
                const [characterName, id] = decodedNameId.split('-');
                console.log(decodedNameId);
                setCharacter(characterName);
                setChatId(id);
                console.log(id)

                // Fetch initial chat data from the backend
                const fetchInitialChat = async () => {
                    if (id) { // Ensure chatId is not null
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
                            console.log('Initial chat data:', data);
                            setResponses(data.prevMessages);
                        } catch (error) {
                            console.error('Error fetching initial chat:', error);
                            setError('Failed to load initial chat. Please try again.');
                        } finally {
                            setIsLoading(false);
                        }
                    }
                };

                fetchInitialChat();
            }
        }
    }, [pathname]); // Run this effect whenever pathname changes

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
                Chat with {character || "Unknown"}
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
            </div>
        </div>
    );
}
