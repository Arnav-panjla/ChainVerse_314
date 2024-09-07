//DeplotAll.ts

import {ethers} from "hardhat";


async function main() {
  if (!process.env.ORACLE_ADDRESS) {
    throw new Error("ORACLE_ADDRESS env variable is not set.");
  }
  const oracleAddress: string = process.env.ORACLE_ADDRESS;
  await deployGptDalle(oracleAddress);
  await deployOpenAiChatGptVision(oracleAddress);
  await deployChatGpt(oracleAddress);

}


async function deployGptDalle(oracleAddress: string) {
  const agent = await ethers.deployContract("GptDalle", [oracleAddress], {});

  await agent.waitForDeployment();

  console.log(`GptDalle contract deployed to ${agent.target}`);
}

async function deployOpenAiChatGptVision(oracleAddress: string) {
  const agent = await ethers.deployContract("OpenAiChatGptVision", [oracleAddress], {});

  await agent.waitForDeployment();

  console.log(`OpenAiChatGptVision contract deployed to ${agent.target}`);
}

async function deployChatGpt(oracleAddress: string) {
  const agent = await ethers.deployContract("ChatGpt", [oracleAddress,""], {});

  await agent.waitForDeployment();

  console.log(`ChatGpt contract deployed to ${agent.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
