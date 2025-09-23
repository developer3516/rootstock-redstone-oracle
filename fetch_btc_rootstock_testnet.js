// fetch_btc_rootstock_testnet.js
const { ethers } = require("ethers");

// Rootstock Testnet public RPC endpoint
const provider = new ethers.JsonRpcProvider("https://public-node.testnet.rsk.co");

// RedStone BTC feed contract deployed on Rootstock Testnet
const feedAddress = "0x85C4F855Bc0609D2584405819EdAEa3aDAbfE97D";

// The feed exposes a Chainlink-style interface
const abi = [
  "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
  "function decimals() external view returns (uint8)"
];

const contract = new ethers.Contract(feedAddress, abi, provider);

async function main() {
  try {
    console.log("Checking Rootstock Testnet BTC feed at:", feedAddress);

    const [roundData, decimals] = await Promise.all([
      contract.latestRoundData(),
      contract.decimals()
    ]);

    console.log(
      "Current BTC testnet price:",
      ethers.formatUnits(roundData.answer, decimals)
    );
    console.log(
      "Last updated:",
      new Date(Number(roundData.updatedAt) * 1000).toISOString()
    );
  } catch (error) {
    console.error("Error fetching Rootstock Testnet BTC price:", error);
  }
}

main();
