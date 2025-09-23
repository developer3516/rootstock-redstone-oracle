// deploy_rootstock_price_reader.js
// Deploys RootstockPriceConsumer contract on Rootstock testnet and reads the feed once deployed.

const fs = require("fs");
const path = require("path");
const solc = require("solc");
const { ethers } = require("ethers");

const DEFAULT_RPC_URL = "https://public-node.testnet.rsk.co";
const DEFAULT_FEED_ADDRESS = "0x85C4F855Bc0609D2584405819EdAEa3aDAbfE97D";

function compileContract() {
  const sourcePath = path.join(__dirname, "RootstockPriceConsumer.sol");
  const source = fs.readFileSync(sourcePath, "utf8");

  const input = {
    language: "Solidity",
    sources: {
      "RootstockPriceConsumer.sol": {
        content: source
      }
    },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode.object"]
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  const contractOutput =
    output.contracts?.["RootstockPriceConsumer.sol"]?.RootstockPriceConsumer;

  if (!contractOutput || !contractOutput.evm?.bytecode?.object) {
    throw new Error("Compilation failed: missing contract bytecode");
  }

  return {
    abi: contractOutput.abi,
    bytecode: contractOutput.evm.bytecode.object
  };
}

async function main() {
  const rpcUrl = process.env.ROOTSTOCK_TESTNET_RPC_URL || DEFAULT_RPC_URL;
  const feedAddress =
    process.env.ROOTSTOCK_TESTNET_FEED_ADDRESS || DEFAULT_FEED_ADDRESS;
  const privateKey = process.env.ROOTSTOCK_TESTNET_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error(
      "Missing ROOTSTOCK_TESTNET_PRIVATE_KEY env var containing a funded testnet key"
    );
  }

  const { abi, bytecode } = compileContract();

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Deploying RootstockPriceConsumer with feed:", feedAddress);
  console.log("Using deployer:", wallet.address);

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy(feedAddress);
  await contract.waitForDeployment();

  const deployedAddress = await contract.getAddress();
  console.log("Contract deployed at:", deployedAddress);

  const result = await contract.getLatestPrice();
  const { price, decimals, updatedAt } = result;

  console.log("Fetched price from deployed contract:");
  console.log("  price:", price.toString());
  console.log("  decimals:", decimals);
  console.log(
    "  updatedAt:",
    new Date(Number(updatedAt) * 1000).toISOString()
  );

  if (decimals > 0) {
    console.log(
      "  formatted:",
      ethers.formatUnits(price, Number(decimals))
    );
  }
}

main().catch((error) => {
  console.error("Deployment script failed:", error);
  process.exitCode = 1;
});
