import {Contract, ethers, TransactionReceipt, Wallet} from "ethers";
import { NextResponse } from 'next/server';
import ABI from '@/contracts/ChatGpt.json';

import { addChat } from '@/lib/db';
import { createTable } from '@/lib/db';

export async function POST(request) {
  try {
    const { charName } = await request.json();
    console.log('Received request:', { charName });

    const rpcUrl = process.env.RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress = process.env.CHAT_CONTRACT_ADDRESS;

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('Missing environment variables');
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    const message = `You are an ${charName} simulating the role of my friend, in a friendly, engaging, and authentic manner. lets start with a simple Hi!`

    const tx = await contract.startChat(message);
    console.log('Transaction sent:', tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log('Transaction receipt:', receipt);

    // Extract the chatId from the logs
    const chatId = getChatId(receipt, contract);
    console.log('Chat ID:', chatId);
    
    createTable();
    addChat(charName, chatId);

    return NextResponse.json({ chatId });

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
        return ethers.toNumber(parsedLog.args[1]); // Assuming the first argument is the chatId
      }
    } catch (error) {
      console.log("Could not parse log:", log);
    }
  }
  return null;
}
