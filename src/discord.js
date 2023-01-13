"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSaleToDiscord = exports.postWallet = void 0;
const axios_1 = __importDefault(require("axios"));
const settings_1 = require("./settings");
const postWallet = (walletName) => {
    settings_1.logger.info('Posting wallet info to discord');
    axios_1.default.post(settings_1.DISCORD_WEBHOOK_URL, {
        embeds: [
            {
                title: `WALLET : ${walletName}`,
                description: `account changed statue detected on ${walletName}`,
            },
        ],
    });
};
exports.postWallet = postWallet;
const postSaleToDiscord = (nftMeta, signature, walletName) => {
    settings_1.logger.info('Posting sale info to discord');
    const { tradeDirection, name, marketPlaceURL, price, priceUSD, transactionDate, image, } = nftMeta;
    axios_1.default.post(settings_1.DISCORD_WEBHOOK_URL, {
        embeds: [
            {
                title: `NFT ${tradeDirection}                       Wallet : ${walletName}`,
                description: `[${name}](${marketPlaceURL})`,
                fields: [
                    {
                        name: 'Price',
                        value: `${price} SOL (\`$${priceUSD}\`)`,
                        inline: false,
                    },
                    {
                        name: 'Date',
                        value: `<t:${transactionDate}>`,
                        inline: false,
                    },
                    {
                        name: 'Explorer',
                        value: `[SolScan](https://solscan.io/tx/${signature})`,
                    },
                ],
                image: {
                    url: `${image}`,
                },
            },
        ],
    });
};
exports.postSaleToDiscord = postSaleToDiscord;
