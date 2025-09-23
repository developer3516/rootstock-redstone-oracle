// fetch_price.js
const { ethers } = require("ethers");

// --- 1. Provider ---
const provider = new ethers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/6f0264589e6a45dd8ea773fb5a851703"
);

// --- 2. RedStone Push Model contract address for eBTC/WBTC ---
const feedAddress = "0xe5867B1d421f0b52697F16e2ac437e87d66D5fbF";

// --- 3. Minimal ABI for Chainlink-compatible feeds ---
const abi = [
  "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
  "function decimals() external view returns (uint8)"
];

// --- 4. Create contract instance ---
const contract = new ethers.Contract(feedAddress, abi, provider);

async function check() {
  try {
    console.log("Checking RedStone feed at:", feedAddress);

    const [roundData, decimals] = await Promise.all([
      contract.latestRoundData(),
      contract.decimals()
    ]);

    console.log(
      "Current eBTC/WBTC:",
      ethers.formatUnits(roundData.answer, decimals)
    );
    console.log(
      "Last updated:",
      new Date(Number(roundData.updatedAt) * 1000).toISOString()
    );
  } catch (err) {
    console.error("Error fetching feed:", err);
  }
}

check();
