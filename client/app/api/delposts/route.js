import { deletePost } from '@lib/db'; // Adjust the path to where your db functions are located

// Handler for DELETE requests
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get('ids'); // Get the IDs from the query parameters

  if (!ids) {
    return new Response(JSON.stringify({ message: 'Post IDs are required' }), { status: 400 });
  }

  // Convert comma-separated string of IDs to an array of integers
  const idArray = ids.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));

  if (idArray.length === 0) {
    return new Response(JSON.stringify({ message: 'Invalid post IDs' }), { status: 400 });
  }

  try {
    // Delete each post with the given IDs
    await Promise.all(idArray.map(id => deletePost(id)));

    // Respond with a success message
    return new Response(JSON.stringify({ message: `Posts with IDs ${ids} deleted successfully` }), { status: 200 });
  } catch (error) {
    // Handle errors
    console.error('Error deleting posts:', error);
    return new Response(JSON.stringify({ message: 'Failed to delete posts' }), { status: 500 });
  }
}
