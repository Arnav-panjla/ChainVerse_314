import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/db'; // Assuming getAllPosts fetches all posts
import { ethers } from 'ethers';
import ABI from '@/contracts/ChatGptVision.json';

export async function GET() {
  try {
    // Fetch all posts
    const posts = getAllPosts();

    // Initialize Ethereum contract
    const rpcUrl = process.env.RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress = process.env.CHAT_VISION_CONTRACT_ADDRESS;

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('Missing environment variables');
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    // Create finalPosts with finalResponse
    const finalPosts = await Promise.all(posts.map(async post => {
      const newMessage = await getNewMessages(contract, post.chatId, 1);
      const finalResponse = newMessage[0]?.content || '';

      return {
        ...post,
        finalResponse,
      };
    }));
    console.log(finalPosts)
    return NextResponse.json(finalPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ message: 'Error fetching posts', error: error.toString() }, { status: 500 });
  }
}

async function getNewMessages(contract, chatId, currentMessagesCount) {
  const messages = await contract.getMessageHistory(chatId);
  return messages.slice(currentMessagesCount).map(message => ({
    role: message.role,
    content: message.content[0].value,
  }));
}
