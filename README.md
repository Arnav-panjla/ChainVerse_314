# 🌐 **ChainVerse_314** - A Decentralized Social Media Adventure

![version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![build](https://img.shields.io/badge/build-passing-brightgreen.svg) ![license](https://img.shields.io/badge/license-MIT-yellow.svg)


### **ChainVerse: An app where, except for the user, everyone is AI.**
### *Let the Future of Social Interaction Unfolds.*
---

Welcome to **ChainVerse_314**, a captivating decentralized social media application that merges blockchain technology with the immersive world of AI-driven conversations. Built on the powerful foundations of Next.js and Galadriel smart contracts, this platform transports you into a realm where everyone you meet, except you, is an intelligent AI companion.

---

## 🚀 **Features that Redefine Social Engagement**

- **🤖 Real-Time Chats with Intelligent AI**: Engage in dynamic, thought-provoking conversations with a diverse cast of AI characters, each with unique personalities and perspectives.
  
- **🔐 Decentralized Data Storage**: Leveraging the Galadriel blockchain, your messages and interactions are securely stored, ensuring the privacy and integrity of your digital conversations.
  
- **🌍 Freedom to Connect with the Extraordinary**: Expand your social circle by adding any individual, real or fictional, to your friend list. Embrace the limitless possibilities of this AI-powered world.
  
- **🛤️ Dynamic Routing for Personalized Experiences**: Seamlessly navigate through the ChainVerse, chatting with different AI companions through intuitive and engaging dynamic routing.
  
- **😊 Expressive Emoji Support**: Enhance your communication with a vibrant library of emojis, allowing you to convey your emotions and reactions effortlessly.

- **🛠️ User-Deployable Smart Contracts:** Take control by deploying your own smart contracts on the Galadriel blockchain, customizing and extending the ChainVerse experience according to your needs and creativity.


---

## 🧭 **Table of Contents**

- [Features](#-features-that-redefine-social-engagement)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)
- [Contributing](#-contributing)
- [License](#license)
- [Acknowledgements](#-acknowledgements)

---

## 🛠️ **Getting Started**

Follow these instructions to set up and run the project locally.

### **Prerequisites**

Ensure the following are installed/present:

- **Node.js** (v16.x or higher)
- **Hardhat** (v8.20 latest)
- **npm** (v7.x or higher)
- **MetaMask** or any other equivalent Ethereum wallet
- **Galadriel**-[Setup Galadriel](https://docs.galadriel.com/setting-up-a-wallet)
- **Tokens**-[How to get Galadriel Tokens](https://docs.galadriel.com/faucet)


## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/ChainVerse_314.git
cd ChainVerse_314
```

## 💻 Usage

### First Time setup
To be performed only once during the first time when you start
- setup necesssary enviornment variables
    ```bash
    cd deployContracts
    cp template.env .env
    ```
    ```bash
    # Address of oracle deployed on Galadriel testnet.
    # See https://docs.galadriel.com/oracle-address
    ORACLE_ADDRESS="0x..."

    # Private key to use for deployment on Galadriel testnet
    PRIVATE_KEY_GALADRIEL="0x..."

    ```
- Deploy the necessary contracts:
    ```bash
    # Assuming /ChainVerse_314/deployContracts
    npm install
    npx hardhat compile
    npx hardhat run --network galadriel scripts/deployAll.ts
    # Comming back to root
    cd .. 
    ```
- Copy the contract addresses:
    - form prev you have result something like this
    ```bash
    GptDalle contract deployed to 0xE5Dbb3e...
    OpenAiChatGptVision contract deployed to 0x3Dfd6b...
    ChatGpt contract deployed to 0x8B039090c7...
    ```
    ```bash
    cd client
    cp template.env .env
    ```
    - paste you deployed contracts in .env file
    ```bash
    CHAIN_ID=696969
    RPC_URL="https://devnet.galadriel.com/"


    # Private key to use for deployment on Galadriel testnet
    PRIVATE_KEY="0x..."

    # GptDAlle contract address 
    CHAT_DALLE_CONTRACT_ADDRESS="0xE5Dbb3e..."

    # OpenAiChatGptVision contract address 
    CHAT_VISION_CONTRACT_ADDRESS="0x3Dfd6b..."
    
    # ChatGpt contract address 
    CHAT_CONTRACT_ADDRESS="0x8B039090c7..."
    ```


### Subsequents setup
Start the development server:

```bash
cd client
npm run dev
```

Open your browser and navigate to:

```bash
http://localhost:3000
```

## 📂 Project Structure

```bash
/contracts            # Smart contract files
/pages                # Next.js pages
  /api                # API routes
  /chat               # Chat pages
/components           # Reusable React components
/public               # Static files
/styles               # Global styles and Tailwind CSS configuration
```

## 🛠️ Technologies Used

- Frontend:
  - Next.js - This is a Next.js project bootstrapped with create-next-app, along with React framework for server-side rendering
  - Tailwind CSS - Utility-first CSS framework
  - Emoji Picker React - Emoji picker component
- Blockchain:
  - Ethers.js - Ethereum library for interacting with the blockchain
  - Solidity - Smart contract programming language
  - Hardhat - Hardhat to deploy contracts
- Backend:
  - Next.js API Routes - Serverless functions for API endpoints

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Commit your changes (git commit -m 'Add some feature').
4. Push to the branch (git push origin feature-branch).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙌 Acknowledgements

- Next.js
- Tailwind CSS
- Ethers.js
- Solidity