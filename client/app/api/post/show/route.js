import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/db'; // Assuming getAllPosts fetches all posts
import { ethers } from 'ethers';
import ABI from '@/contracts/ChatGptVision.json';
import { getChatImageUrlByName } from '@lib/db';

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
    // console.log('this is the final response string ---> ',finalPosts);

    const processedData = finalPosts.map(item => ({
      ...item,
      parsedResponses: parseFinalResponse(item.finalResponse)
    }));

    // console.log(processedData);

    const processedDataWithImages = await mapParsedResponsesWithImages(processedData);
    const finalData = processedDataWithImages.map(({ finalResponse, ...rest }) => rest);

    console.log(finalData);

    return NextResponse.json(finalData);

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

async function mapParsedResponsesWithImages(data) {
  // Loop over each chat item
  for (let item of data) {
    if (item.parsedResponses && Array.isArray(item.parsedResponses)) {
      // Loop over each parsed response and fetch the image URL for the character name
      for (let response of item.parsedResponses) {
        const imageUrl = getChatImageUrlByName(response.name)?.charImageUrl;
        response.imageUrl = imageUrl || 'default_image_url'; // Use default if not found
      }
    }
  }
  return data;
}


function parseFinalResponse(finalResponse) {
  return finalResponse
    .trim()
    .split('----') // Split the string by "----"
    .filter(response => response.trim()) // Filter out empty strings
    .map(item => {
      const [name, ...responseParts] = item.split(':-'); // Split by ":-"
      return {
        name: name ? name.trim() : 'Unknown', // Get the name and trim spaces
        response: responseParts.join(':-').trim() // Join remaining parts as the response
      };
    });
}