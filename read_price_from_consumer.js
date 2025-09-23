// read_price_from_consumer.js
const { ethers } = require("ethers");

const DEFAULT_RPC_URL = "https://public-node.testnet.rsk.co";
const DEFAULT_CONSUMER_ADDRESS = "0xd687FC4bEf217a042a97645914FE2ebb7436d2b0";

const abi = [
  "function getLatestPrice() external view returns (int256 price, uint8 decimals, uint256 updatedAt)"
];

async function main() {
  const rpcUrl = process.env.ROOTSTOCK_TESTNET_RPC_URL || DEFAULT_RPC_URL;
  const contractAddress =
    process.env.ROOTSTOCK_PRICE_CONSUMER_ADDRESS || DEFAULT_CONSUMER_ADDRESS;

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(contractAddress, abi, provider);

  const { price, decimals, updatedAt } = await contract.getLatestPrice();

  console.log("Consumer contract:", contractAddress);
  console.log("Raw price:", price.toString());
  console.log("Decimals:", decimals);
  console.log(
    "Updated at:",
    new Date(Number(updatedAt) * 1000).toISOString()
  );
  console.log(
    "Formatted price:",
    ethers.formatUnits(price, Number(decimals))
  );
}

main().catch((error) => {
  console.error("Failed to read price:", error);
  process.exitCode = 1;
});
