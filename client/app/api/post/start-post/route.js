import { ethers } from 'ethers';
import { NextResponse } from 'next/server';
import ABI from '@/contracts/ChatGptVision.json';

export async function POST(request) {
  try {
    const { chats, imageUrls } = await request.json();
    console.log('Received request:', {chats, imageUrls });

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
    console.log(newChats);

    const modifiedChats = newChats.map(chat => ({
      ...chat, 
      charMessage: `You are an ${chat.charName} simulating the role of my friend. Your task is to comment on the image in less than 50 words, in a friendly, engaging, and authentic manner.`, // Modify charName
    }));

    let names = modifiedChats.map(chat => chat.charName).join(', ');

    const initialMessage = `You need to act like the following ${names} one by one (each response seperated by \\n)simulating the role of my friend. Your task is to comment on the image in less than 50 words, in a friendly, engaging, and authentic manner.`

    const tx = await contract.startChat(initialMessage, imageUrls);
    console.log('Transaction sent:', tx.hash);

    const receipt = await tx.wait();
    console.log('Transaction receipt:', receipt);

    const chatId = getChatId(receipt, contract);
    console.log('Chat ID:', chatId);


    let allMessages = [];
    // Run the chat loop: read messages and send messages
    for (let i = 0; i < 5; i++) {
      console.log(`Iteration ${i + 1}: Sending message...`);
    
      const newMessages = await getNewMessages(contract, chatId, allMessages.length);
      console.log(`New messages received:`, newMessages);
    
      if (newMessages.length) {
        for (const message of newMessages) {
          console.log(`${message.role}: ${message.content}`);
          allMessages.push(message);
    
          if (allMessages[allMessages.length - 1]?.role === "assistant") {
            const userMessage = modifiedChats[i].charMessage; // Replace user input with chat message
            console.log(`Sending user message: "${userMessage}"`);
    
            const transactionResponse = await contract.addMessage(userMessage, chatId);
            console.log('Transaction response:', transactionResponse); // Debugging
            const receipt = await transactionResponse.wait();
            console.log(`Message sent, tx hash: ${receipt.transactionHash}`);
          }
        }
      } else {
        console.log(`No new messages received.`);
      }
    
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(allMessages);

    return NextResponse.json({ allMessages, chatId });
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