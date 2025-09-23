# Rootstock Price Tools

Utilities for fetching RedStone BTC prices on Ethereum mainnet and the Rootstock networks, plus a sample Solidity consumer that can be deployed to Rootstock testnet.

## Repo Structure

- `fetch_price.js` – reads the eBTC/WBTC feed on Ethereum mainnet via Infura.
- `fetch_btc_rootstock.js` – reads the BTC feed from Rootstock mainnet.
- `fetch_btc_rootstock_testnet.js` – reads the BTC feed from Rootstock testnet.
- `RootstockPriceConsumer.sol` – minimal on-chain consumer for Chainlink-style feeds.
- `deploy_rootstock_price_reader.js` – compiles and deploys the consumer to Rootstock testnet and queries it once deployed.
- `read_price_from_consumer.js` – reuses an existing consumer deployment to fetch the current price.

## Prerequisites

- Node.js 18+ (ethers v6 requires recent Node releases).
- A funded Rootstock testnet account for deploying the consumer contract.

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file (it is gitignored) with the following variables:

```
ROOTSTOCK_TESTNET_PRIVATE_KEY=0xYOUR_TESTNET_PRIVATE_KEY
ROOTSTOCK_TESTNET_RPC_URL=https://public-node.testnet.rsk.co
ROOTSTOCK_TESTNET_FEED_ADDRESS=0x85C4F855Bc0609D2584405819EdAEa3aDAbfE97D
```

Optionally set `ROOTSTOCK_PRICE_CONSUMER_ADDRESS` if you have already deployed `RootstockPriceConsumer` and want `read_price_from_consumer.js` to point at it by default.

Export the variables in your shell session or use a tool like [dotenv-cli](https://github.com/entropitor/dotenv-cli) when running commands.

## Usage

Fetch prices directly from the feeds:

```bash
npm run fetch:mainnet            # Ethereum eBTC/WBTC price (Infura)
npm run fetch:rootstock          # Rootstock mainnet BTC price
npm run fetch:rootstock:testnet  # Rootstock testnet BTC price
```

Deploy the on-chain consumer to Rootstock testnet and read the feed through it:

```bash
npm run deploy:testnet
```

Query an existing consumer contract without redeploying:

```bash
npm run read:testnet
```

## Suggested Repository Name

`rootstock-price-tools`

Use this when creating the GitHub repository to match the package metadata.

## Publishing Checklist

1. Remove or rotate any real private keys before pushing.
2. Commit the source files (the `.env` file stays untracked).
3. Create the GitHub repository (for example `rootstock-price-tools`) and push the project.

## License

MIT
