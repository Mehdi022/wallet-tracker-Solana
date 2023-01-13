# Wallet-Tracker-Solana

## Features

*   Monitors wallets for NFT token transactions involving Solana NFT marketplaces
*   Monitors wallets for NFT token burns
*   Posts transaction details directly to your discord webhook URL
*   Error handling
*   Logging

## Environment Variables

add the following environment variables to your .env file

`SOLANA_CLUSTER_ENDPOINT` - "devnet" | "testnet" | "mainnet-beta"

`SUPABASE_URL` - URL to your supabase backend

`SUPABASE_KEY` - API key to access supabase backend

`DISCORD_WEBHOOK_URL` - Webhook url so that bot may post messages

## Run Locally

Clone the project

```bash
  git clone https://github.com/Stonks-Luma-Liberty/GuiltySpark.git
```

Go to the project directory

```bash
  cd GuiltySpark
```

### With Docker

Use docker-compose to start the bot

```bash
docker-compose up -d --build
```

### Without Docker

Install dependencies

```bash
  yarn install
```

Start the bot

```bash
  yarn start
```
