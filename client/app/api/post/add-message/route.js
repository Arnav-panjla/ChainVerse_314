import { ethers } from 'ethers';
import { NextResponse } from 'next/server';
import ABI from '@/contracts/ChatGptVision.json';

export async function POST(request) {
  try {
    const { message, chatId } = await request.json();
    console.log('Received request:', { message, chatId });

    const rpcUrl = process.env.RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress = process.env.CHAT_VISION_CONTRACT_ADDRESS;

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('Missing environment variables');
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    // Send the message to the contract
    const tx = await contract.addMessage(message, chatId);
    console.log('Transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Transaction receipt:', receipt);

    let latestMessage = [];
    const timeout = 60 * 1000; // 60 seconds timeout
    const startTime = Date.now();

    // Polling loop to check for new messages
    while (Date.now() - startTime < timeout) {
      const newMessages = await getNewMessages(contract, chatId);
      if (newMessages.length > 0) {
        const message = newMessages[newMessages.length - 1];
        if (message.role === "assistant") {
          latestMessage = [message];
          break;
        }
      }
      // Wait for 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({ latestMessage });
  } catch (error) {
    console.error('Error in add-message:', error);
    return NextResponse.json({ message: 'Error adding message', error: error.toString() }, { status: 500 });
  }
}

async function getNewMessages(contract, chatId) {
  // Retrieve message history from the contract
  const messages = await contract.getMessageHistory(chatId);
  return messages.map(message => ({
    role: message.role,
    content: message.content[0].value,
  }));
}
