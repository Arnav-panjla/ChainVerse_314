"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import avatar from '@public/assets/member1.jpg';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/post/show');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPosts(data);

      } catch (error) {
        setError(error.message);
      }
    }
    fetchPosts();
  }, []);

  if (error) return <div>Error: {error}</div>;

  // Reverse the posts array to render in reverse order
  const reversedPosts = [...posts].reverse();

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl text-white font-bold mb-4">All Posts</h1>
      {reversedPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="w-[80vw]">
          {reversedPosts.map((post) => (
            <div key={post.chatId} className="bg-white p-4 border rounded-lg shadow-md mb-4">
              <h2 className="text-sm text-grey-600 font-semibold mb-2">Post ID: {post.id}</h2>
              <div className="grid grid-cols-2 gap-4">
                {[post.url_1, post.url_2, post.url_3, post.url_4, post.url_5].map((url, index) => (
                  url ? (
                    <Image 
                      key={index} 
                      src={url} 
                      width={350}
                      height={350}
                      alt={`Post Image ${index + 1}`} 
                      className="w-full h-auto rounded-lg" 
                    />
                  ) : null
                ))}
              </div>
              <div className='text-black text-xl'>
                {post.parsedResponses.map((response, index) => (
                  <div key={index} className='my-6 flex flex-row'>
                      <Image
                        src={response.imageUrl && response.imageUrl.startsWith('http') ? response.imageUrl : avatar}
                        alt={response.name || 'Default Image'}
                        width={50}   // You can adjust these values based on your layout needs
                        height={50}  // You can adjust these values based on your layout needs
                        className="w-16 h-16 rounded-full mr-4"
                      />
                      <div className='flex flex-col'>
                        <strong>{response.name}:</strong>
                        <p>{response.response}</p>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
