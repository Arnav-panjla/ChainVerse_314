// Import necessary modules and functions
import { ethers } from 'ethers';
import { NextResponse } from 'next/server';
import ABI from '@/contracts/ChatGptVision.json';
import { addPost } from '@/lib/db'; // Import the addPost function
import { createPostsTable } from '@/lib/db';

export async function POST(request) {
  try {
    const { chats, imageUrls } = await request.json();
    // console.log('Received request:', {chats, imageUrls });

    const rpcUrl = process.env.RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress = process.env.CHAT_VISION_CONTRACT_ADDRESS;

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('Missing environment variables');
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    const newChats = getRandomChats(chats);
    // console.log(newChats);

    let names = newChats.map(chat => chat.charName).join(', ');
    console.log(names);

    const initialMessage = `You need to act like the following ${names} one by one (each response separated by ---- followed by the (EXACTNAME which is mentioned) and then :- ) simulating the role of my friend. Your task is to comment on the image in not more than 100 words, in a friendly, engaging, and authentic manner.`;

    const tx = await contract.startChat(initialMessage, imageUrls);
    console.log('Transaction sent:', tx.hash);

    const receipt = await tx.wait();
    console.log('Transaction receipt:', receipt);

    const chatId = getChatId(receipt, contract);
    console.log('Chat ID:', chatId);

    // Store chatId and image URLs in the posts table
    createPostsTable()

    addPost(chatId, ...imageUrls);

    console.log('Post added to the database.');

    let allMessages = [];
    let newMessage = await getNewMessages(contract, chatId, 0);
    console.log(`New messages_0 received:`, newMessage);
    allMessages.push(newMessage);

    for (let i = 0; i < 35; i++) {
      newMessage = await getNewMessages(contract, chatId, i);
      console.log(newMessage);
      if (!newMessage.content) {
        i--;
      }
      console.log(newMessage.at(-1)?.role);
      if (newMessage.at(-1)?.role === "assistant") {
        allMessages.push(newMessage);
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("waiting..");
    }
    console.log(`New messages_1 received:`, newMessage);

    const finalResponse = newMessage[1].content;
    console.log(finalResponse);

    return NextResponse.json({ finalResponse, chatId });
  } catch (error) {
    console.error('Error in add-message:', error);
    return NextResponse.json({ message: 'Error adding message', error: error.toString() }, { status: 500 });
  }
}

function getChatId(receipt, contract) {
  for (const log of receipt.logs) {
    try {
      const parsedLog = contract.interface.parseLog(log);
      if (parsedLog && parsedLog.name === "ChatCreated") {
        return ethers.toNumber(parsedLog.args[1]);
      }
    } catch (error) {
      console.log("Could not parse log:", log);
    }
  }
}

async function getNewMessages(contract, chatId, currentMessagesCount) {
  const messages = await contract.getMessageHistory(chatId);
  return messages.slice(currentMessagesCount).map(message => ({
    role: message.role,
    content: message.content[0].value,
  }));
}

function getRandomChats(chats) {
  // If the length is less than or equal to 5, return the original array
  if (chats.length <= 5) {
    return chats;
  }

  // Shuffle the array randomly
  const shuffled = chats.sort(() => 0.5 - Math.random());

  // Return only the first 5 elements
  return shuffled.slice(0, 5);
}
