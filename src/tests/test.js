"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const __1 = require("..");
const constants_1 = require("../constants");
const discord_1 = require("../discord");
const settings_1 = require("../settings");
const utils_1 = require("../utils");
const runTest = async () => {
    try {
        const signature = '';
        const wallet = new web3_js_1.PublicKey('');
        const txn = (await settings_1.connection.getTransaction(signature));
        const { preBalances, postBalances } = txn.meta;
        const preTokenBalances = txn.meta
            ?.preTokenBalances;
        const postTokenBalances = txn.meta
            ?.postTokenBalances;
        const price = Math.abs(preBalances[0] - postBalances[0]) / web3_js_1.LAMPORTS_PER_SOL;
        let mintToken = postTokenBalances[0]?.mint;
        if (mintToken) {
            let tradeDirection = '';
            const solanaPrice = await __1.coingeckoClient.simplePrice({
                vs_currencies: 'usd',
                ids: 'solana',
            });
            const accountKeys = txn.transaction.message.accountKeys;
            const programAccount = accountKeys.at(-1)?.toString();
            const priceUSD = solanaPrice.solana.usd * price;
            for (const [key, value] of Object.entries(constants_1.PROGRAM_ACCOUNTS)) {
                if (value.includes(programAccount)) {
                    let programAccountUrl = constants_1.PROGRAM_ACCOUNT_URLS[key] || '';
                    const walletString = wallet.toString();
                    if (key === 'MortuaryInc') {
                        tradeDirection = constants_1.BURN;
                        mintToken = preTokenBalances[1].mint;
                    }
                    else if (key === 'MagicEden') {
                        programAccountUrl += `/${mintToken}`;
                        tradeDirection =
                            preTokenBalances[0].owner === walletString
                                ? constants_1.SELL
                                : constants_1.BUY;
                    }
                    else {
                        programAccountUrl += `/?token=${mintToken}`;
                        tradeDirection =
                            postTokenBalances[0].owner === walletString
                                ? constants_1.BUY
                                : constants_1.SELL;
                    }
                    if (price < 0.009) {
                        tradeDirection =
                            preTokenBalances[0].owner === walletString
                                ? constants_1.LISTING
                                : constants_1.DE_LISTING;
                    }
                    const metadata = await (0, utils_1.getMetaData)(mintToken);
                    const nftMeta = {
                        name: metadata.name,
                        tradeDirection,
                        price: price,
                        priceUSD: priceUSD,
                        image: metadata.image,
                        transactionDate: txn.blockTime,
                        marketPlaceURL: programAccountUrl,
                    };
                    (0, discord_1.postSaleToDiscord)(nftMeta, signature, "no name found");
                }
            }
        }
        else {
            settings_1.logger.info('Not an NFT transaction');
        }
    }
    catch (e) {
        settings_1.logger.error(e);
    }
};
if (require.main) {
    void runTest();
}
