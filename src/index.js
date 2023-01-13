"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coingeckoClient = void 0;
const web3_js_1 = require("@solana/web3.js");
const coingecko_api_v3_1 = require("coingecko-api-v3");
const ts_retry_1 = require("ts-retry");
const constants_1 = require("./constants");
const discord_1 = require("./discord");
const settings_1 = require("./settings");
const utils_1 = require("./utils");
const wallets = ["7Niuuw1pEZZ8tfTbyG9XadBQieG5ezaNr2LaXcvmTxei","5dZmmmiBkHX7qNtdkZZL2S9UcmXL87SGoXAzjvqN96Fc", "E2cEgaHzd1VpzWkdtVt6Qh3D5dZsbv4n1BuWT1KX7rJj", "HhuJCViqUewRNXrhwNuXCC7gqp2o1cUhx9a3nqEGkkqt", "FKGU5DtaXjawG9BNpmiBCC1d5ComsnJbnHn2yZTj7tFc", "fr7YFkGeJNGMxVJAhQgp9gZivKSNPcQU4roBK4boKGB", "BP9a7nk1GJFAeLDJL1BxnXDRxzJviHT66w6Qcznz3t1X", "H3AkHZHfcqGCcJpBn3FJWe52LcLxFMJQoZvZ6XyApFWf", "FJbXMr7UGi9P1V1qZvFQ6fyHHS41idJPPyn98afdCJhD", "HGEj9nJHdAWJKMHGGHRnhvb3i1XakELSRTn5B4otmAhU", "fdBSnqQJTaWKTachvyaYkSM3zubxbFbk8Ek68XA1HwU", "EAHJNfFDtivTMzKMNXzwAF9RTAeTd4aEYVwLjCiQWY1E", "GCnCesT48KscB92StroDGi5EoAL1Vuq8Jr9cS9RSEtRg", "DwnVBkzD8tSe6jcS71FwLaopB9MJfcxBWPSvbSGSTMXR", "6Bryq6EeYnVv2Un5vK5vLohvxrhSK4tkMdQ6kU42vHnU", "Fv4SsHSzdYa4LH6A7znS7vg45GPhP9ZxsF41FWFGDqPc", "G7No8SCSoBeccFk6ZLEPmoPcFGbe6hbJisinLTk8633o", "6SFShytsPZ61KuauRbBppAcs6WwuNXmEHpFxBUp68EKP", "EGNA3eBeJpnfVswkn3PaXLiTarne1aMiNF4FxZRSErnr", "fdBSnqQJTaWKTachvyaYkSM3zubxbFbk8Ek68XA1HwU", "2V94ZrVkUXQiY1vSoZKdqmDN8Ab81W5vMe6SgWDyYMNE", "HKz7s3Uj9x5XxVL58XX3DYDyGNRJmWKH6UZQRojoccFH", "7B4qYwRgfZivYfuFErVoFRqqw5K1NvfPJcx2cX9QxUym", "AjGC5fRZmGAkDJEeqb4i6D4oVQ13vn8sHJkXhDn8eRKJ", "CpFeRs2swAgM2THbUUuR1dujBSuhSg3AAXgRvnjAvDPu", "Cngze9zz4nRuzDcCahEprRdtTvH7mFG3fb1Ys8bU4H5v", "8SxSRkjrKFgRReupstfMzHCo4rHZKYMwdjPTQTWsde3w"];
const walletsName = { "test":"7Niuuw1pEZZ8tfTbyG9XadBQieG5ezaNr2LaXcvmTxei","solsniper": "5dZmmmiBkHX7qNtdkZZL2S9UcmXL87SGoXAzjvqN96Fc", "solplayboy": "E2cEgaHzd1VpzWkdtVt6Qh3D5dZsbv4n1BuWT1KX7rJj", "solhub": "HhuJCViqUewRNXrhwNuXCC7gqp2o1cUhx9a3nqEGkkqt", "solbigbrain": "FKGU5DtaXjawG9BNpmiBCC1d5ComsnJbnHn2yZTj7tFc", "solanagoddess": "fr7YFkGeJNGMxVJAhQgp9gZivKSNPcQU4roBK4boKGB", "skellymode sol wallet": "BP9a7nk1GJFAeLDJL1BxnXDRxzJviHT66w6Qcznz3t1X", "nate rivers": "H3AkHZHfcqGCcJpBn3FJWe52LcLxFMJQoZvZ6XyApFWf", "jpeggler": "FJbXMr7UGi9P1V1qZvFQ6fyHHS41idJPPyn98afdCJhD", "hge solwallet": "HGEj9nJHdAWJKMHGGHRnhvb3i1XakELSRTn5B4otmAhU", "fast wallet": "fdBSnqQJTaWKTachvyaYkSM3zubxbFbk8Ek68XA1HwU", "cozy": "EAHJNfFDtivTMzKMNXzwAF9RTAeTd4aEYVwLjCiQWY1E", "angilo": "GCnCesT48KscB92StroDGi5EoAL1Vuq8Jr9cS9RSEtRg", "hge second wallet": "DwnVBkzD8tSe6jcS71FwLaopB9MJfcxBWPSvbSGSTMXR", "generalsol": "6Bryq6EeYnVv2Un5vK5vLohvxrhSK4tkMdQ6kU42vHnU", "solbuckets": "Fv4SsHSzdYa4LH6A7znS7vg45GPhP9ZxsF41FWFGDqPc", "solsniper 2 wallet": "G7No8SCSoBeccFk6ZLEPmoPcFGbe6hbJisinLTk8633o", "0xfunction": "6SFShytsPZ61KuauRbBppAcs6WwuNXmEHpFxBUp68EKP", "pratty.sol#4": "EGNA3eBeJpnfVswkn3PaXLiTarne1aMiNF4FxZRSErnr", "fastdagod": "fdBSnqQJTaWKTachvyaYkSM3zubxbFbk8Ek68XA1HwU", "stoner420": "2V94ZrVkUXQiY1vSoZKdqmDN8Ab81W5vMe6SgWDyYMNE", "sp00nicus": "HKz7s3Uj9x5XxVL58XX3DYDyGNRJmWKH6UZQRojoccFH", "jawn wick": "7B4qYwRgfZivYfuFErVoFRqqw5K1NvfPJcx2cX9QxUym", "cozy 2": "AjGC5fRZmGAkDJEeqb4i6D4oVQ13vn8sHJkXhDn8eRKJ ", "th": "CpFeRs2swAgM2THbUUuR1dujBSuhSg3AAXgRvnjAvDPu", "solstice": "Cngze9zz4nRuzDcCahEprRdtTvH7mFG3fb1Ys8bU4H5v", "cozy 3": "8SxSRkjrKFgRReupstfMzHCo4rHZKYMwdjPTQTWsde3w" };
let nameOfWallet = "no name found";
exports.coingeckoClient = new coingecko_api_v3_1.CoinGeckoClient({
    autoRetry: true,
});
/**
 * Retrieve a processed block from the solana cluster
 * @param slot Slot where block is located
 * @returns Fetched block
 */
const retrieveBlock = async (slot) => {
    return await (0, ts_retry_1.retryAsync)(async () => {
        settings_1.logger.info(`Attempting to retrieve block in slot: ${slot}`);
        return (await settings_1.connection.getBlock(slot));
    }, { delay: 300, maxTry: 3 });
};
const onAccountChangeCallBack = async (_accountInfo, context) => {
    settings_1.logger.info('Account change detected');
    const { slot } = context;
    let wallet = new web3_js_1.PublicKey(web3_js_1.PublicKey.default);
    try {
        const block = await retrieveBlock(slot);
        const { transactions } = block;
        settings_1.logger.info('Searching transactions');
        const transaction = transactions.find((item) => {
            const { accountKeys } = item.transaction.message;
            const publicKey = accountKeys.find((publicKey) => wallets.includes(publicKey.toString()));
            if (publicKey) {
                wallet = publicKey;
                for (let key in walletsName) {
                    if (walletsName[key] === publicKey.toString()) {
                        nameOfWallet = key;
                    }
                }
                return item;
            }
        })?.transaction;
        settings_1.logger.info('Transaction found');
        const signature = transaction?.signatures[0] ?? '';
        settings_1.logger.info(`Getting transaction signature: ${signature}`);
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
            const solanaPrice = await exports.coingeckoClient.simplePrice({
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
                    (0, discord_1.postSaleToDiscord)(nftMeta, signature, nameOfWallet);
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
const runBot = async () => {
    settings_1.logger.info('Starting GuiltySpark bot');
    for (let i = 0; i < wallets.length; i++) {
        let address = wallets[i];
        let name = walletsName[i];
        settings_1.logger.info(`Subscribing to account changes for ${address}`);
        settings_1.connection.onAccountChange(new web3_js_1.PublicKey(address), onAccountChangeCallBack, 'confirmed');
    }
};
if (require.main) {
    void runBot();
}
