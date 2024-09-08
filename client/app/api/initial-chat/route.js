import { ethers } from 'ethers';
import { NextResponse } from 'next/server';
import ABI from '@/contracts/ChatGpt.json';
import { getChatImageUrlByChatId } from '@lib/db';

export async function POST(request) {
  try {
    let { chatId } = await request.json();
    const _chatId = parseInt(chatId, 10);
    chatId = _chatId;
    console.log('Received request:', { chatId });

    const result = getChatImageUrlByChatId(chatId);
    console.log(`Image URL for chatId ${chatId}: ${result.charImageUrl}`);
    const charImageUrl = result.charImageUrl


    const rpcUrl = process.env.RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress = process.env.CHAT_CONTRACT_ADDRESS;

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('Missing environment variables');
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    const newMessages = await getNewMessages(contract, chatId);
    const prevMessages = newMessages.slice(1);
    console.log(prevMessages)

    return NextResponse.json({ prevMessages, charImageUrl });

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