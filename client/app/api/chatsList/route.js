import { getAllChats } from '@/lib/db';

export async function GET() {
    try {
      const chats = getAllChats();
      // console.log(chats);
      return new Response(JSON.stringify(chats), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch chats' }), { status: 500 });
    }
  }