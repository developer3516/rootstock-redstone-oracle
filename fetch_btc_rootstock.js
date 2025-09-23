// fetch_btc_rootstock.js
const { ethers } = require("ethers");

// Rootstock public RPC endpoint (Mainnet)
const provider = new ethers.JsonRpcProvider("https://public-node.rsk.co");

// RedStone BTC feed contract deployed on Rootstock mainnet
const feedAddress = "0x197225B3B017eb9b72Ac356D6B3c267d0c04c57c";

// Chainlink-compatible ABI fragments exposed by the feed contract
const abi = [
  "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
  "function decimals() external view returns (uint8)"
];

const contract = new ethers.Contract(feedAddress, abi, provider);

async function main() {
  try {
    console.log("Checking Rootstock BTC feed at:", feedAddress);

    const [roundData, decimals] = await Promise.all([
      contract.latestRoundData(),
      contract.decimals()
    ]);

    console.log(
      "Current BTC price:",
      ethers.formatUnits(roundData.answer, decimals)
    );
    console.log(
      "Last updated:",
      new Date(Number(roundData.updatedAt) * 1000).toISOString()
    );
  } catch (error) {
    console.error("Error fetching Rootstock BTC price:", error);
  }
}

main();
