import {Contract, ethers, TransactionReceipt, Wallet} from "ethers";
import { NextResponse } from 'next/server';
import ABI from '@/contracts/ChatGpt.json';

export async function POST(request) {
  try {
    const { message } = await request.json();
    console.log('Received request:', { message });

    const rpcUrl = process.env.RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress = process.env.CHAT_CONTRACT_ADDRESS;

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('Missing environment variables');
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    // // Check if the contract has the startChat function
    // if (!contract.functions.startChat) {
    //     throw new Error('startChat function not found in the contract. Verify ABI and contract address.');
    //   }
  
    //   // Estimate gas before sending the transaction
    //   const gasEstimate = await contract.estimateGas.startChat(message);
    //   console.log('Gas estimate:', gasEstimate.toString());
  
    // Send the transaction
    const tx = await contract.startChat(message);
    console.log('Transaction sent:', tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log('Transaction receipt:', receipt);

    // Extract the chatId from the logs
    const chatId = getChatId(receipt, contract);
    console.log('Chat ID:', chatId);

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
