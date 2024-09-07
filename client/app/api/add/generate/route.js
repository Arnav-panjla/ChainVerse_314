import { Contract, ethers, TransactionReceipt, Wallet } from "ethers";
import { NextResponse } from 'next/server';

// Contract ABI
const ABI = [
  "function initializeDalleCall(string memory message) public returns (uint)",
  "function lastResponse() public view returns (string)"
];

// Helper to call the contract and fetch the image URL
export async function POST(request) {
  try {
    const { charName, charNature} = await request.json();
    const description = `Generate a simple cartoonish, ${charNature} Image like that of ${charName}`;
    console.log('Received request:', { description });

    // Ensure the contract address is set in environment variables
    const rpcUrl = process.env.RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress = process.env.CHAT_DALLE_CONTRACT_ADDRESS;

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('Missing environment variables');
    }

    // Set up provider and wallet
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    // Call the contract to initialize image generation
    const transactionResponse = await contract.initializeDalleCall(description);
    const receipt = await transactionResponse.wait();
    console.log(`Image generation started with message: "${description}"`);

    // Poll for the last response until it's updated
    let lastResponse = await contract.lastResponse();
    let newResponse = lastResponse;

    // Wait for the new response
    while (newResponse === lastResponse) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      newResponse = await contract.lastResponse();
      console.log("waiting for response...")
    }

    console.log(newResponse)

    // Return the generated image URL
    return NextResponse.json({ imageUrl: newResponse });

  } catch (error) {
    console.error("Error generating image:", error);

    // Handle specific billing hard limit error
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.code === 'billing_hard_limit_reached') {
      return NextResponse.json({ imageUrl: "/assets/member1.jpg" });
    }

    // Handle other errors
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
