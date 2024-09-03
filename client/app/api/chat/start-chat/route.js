import { ethers } from 'ethers';
import { NextResponse } from 'next/server';
import ABI from '@/contracts/ChatGptVision.json';

export async function POST(request) {
  try {
    const { message, imageUrls } = await request.json();
    console.log('Received request:', { message, imageUrls });

    const rpcUrl = process.env.RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress = process.env.CHAT_VISION_CONTRACT_ADDRESS;

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('Missing environment variables');
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    const tx = await contract.startChat(message, imageUrls);
    console.log('Transaction sent:', tx.hash);

    const receipt = await tx.wait();
    console.log('Transaction receipt:', receipt);

    const chatId = getChatId(receipt, contract);
    console.log('Chat ID:', chatId);


    let latestMessage = []
    let shouldRun = true
    while (shouldRun) {
      const newMessages = await getNewMessages(contract, chatId, 0);
      if (newMessages) {
        for (let message of newMessages) {
          console.log(`${message.role}: ${message.content}`);
          if (message.role === "assistant") {
            latestMessage.push(message);
            shouldRun = false
          }
        }
      }
  // Wait for 1 second before checking for new messages again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({ chatId, latestMessage });

  } catch (error) {
    console.error('Error in start-chat:', error);
    return NextResponse.json({ message: 'Error starting chat', error: error.toString() }, { status: 500 });
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