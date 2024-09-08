'use client';

import { useState } from 'react';

export default function DeletePostsPage() {
  const [postId, setPostId] = useState('');
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/delposts?ids=${postId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Success: ${data.message}`);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('Failed to delete posts');
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Delete Posts</h1>
      <input
        type="text"
        value={postId}
        onChange={(e) => setPostId(e.target.value)}
        placeholder="Enter post IDs (comma-separated)"
        className="border p-2 rounded-lg mb-4"
      />
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white p-2 rounded-lg"
      >
        Delete Posts
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
