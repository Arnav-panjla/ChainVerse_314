// app/api/delete-chat/[chatId]/route.ts
import { NextResponse } from 'next/server';
import { deleteChat } from '@/lib/db';

export async function DELETE(request, { params }) {
  const { chatId } = params;

  try {
    deleteChat(chatId);
    return NextResponse.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 });
  }
}
