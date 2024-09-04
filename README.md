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
- **npm** (v7.x or higher) or **yarn**
- **MetaMask** or any other Ethereum wallet
- **Galadriel**-[Setup Galadriel](https://docs.galadriel.com/setting-up-a-wallet)
- **Tokens**-[How to get Galadriel Tokens](https://docs.galadriel.com/faucet)

### **Environment Variables**

Set up the following in a `.env.local` file:

```bash
RPC_URL=your_rpc_url_here
PRIVATE_KEY=your_private_key_here
CHAT_VISION_CONTRACT_ADDRESS=your_vision_contract_address_here
CHAT_CONTRACT_ADDRESS=your_contract_address_here

```

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/ChainVerse_314.git
cd ChainVerse_314
```

## 💻 Usage

Install dependencies:

```bash
npm install
```

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
  - Next.js - React framework for server-side rendering
  - Tailwind CSS - Utility-first CSS framework
  - Emoji Picker React - Emoji picker component
- Blockchain:
  - Ethers.js - Ethereum library for interacting with the blockchain
  - Solidity - Smart contract programming language
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