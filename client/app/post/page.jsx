'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image'; // Import Next.js Image component

export default function Chat() {
  const [imageUrls, setImageUrls] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('/api/chatsList');
        if (!response.ok) {
          throw new Error('Failed to fetch chats');
        }
        const data = await response.json();
        setChats(data);
        console.log(chats);

      } catch (error) {
        console.error(error);
      }
    };

    fetchChats();
  }, []);

  // Helper function to process image URLs
  const processImageUrls = (urls) => {
    return urls.split('\n').filter(url => url.trim() !== ''); // Return non-empty trimmed URLs
  };

  const handleStartPost = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const imageUrlList = processImageUrls(imageUrls); // Use the helper function

      const response = await fetch('/api/post/start-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chats: chats,
          imageUrls: imageUrlList
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setChatStarted(true);
    } catch (error) {
      console.error('Error starting chat:', error);
      setError('Failed to start chat. Please try again.');
    } finally {
      setIsLoading(false);
      setImageUrls('')
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl text-white font-bold mb-2">
        My Post
      </h1>
      <div className="w-[75vw] bg-white p-4 border rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4 h-[60vh] overflow-y-auto mb-2">
          {processImageUrls(imageUrls).map((imageUrl, index) => (
            <div key={index} className="mb-2 flex justify-center items-center">
              <Image
                src={imageUrl.trim().startsWith('http') ? imageUrl.trim() : '/public/default-image.jpg'}
                alt={`Image ${index}`}
                width={250}
                height={250}
                className="w-80 h-80 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {chatStarted  && (
          <div className="text-green-500 mb-2">
            Posted Sucessfully: Recieved 5 comments
          </div>
        )}
        <form onSubmit={handleStartPost} className="flex flex-col">
          <textarea
            value={imageUrls}
            onChange={(e) => setImageUrls(e.target.value)}
            className="border p-2 rounded-lg mb-2"
            placeholder="Enter image URLs ipfs or google.storage (one link per line) upto 4 images"
            rows={4}
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg" disabled={isLoading}>
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
