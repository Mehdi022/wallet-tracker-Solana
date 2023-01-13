import {
    AccountInfo,
    BlockResponse,
    ConfirmedTransactionMeta,
    Context,
    LAMPORTS_PER_SOL,
    PublicKey,
    TokenBalance,
    TransactionResponse,
} from '@solana/web3.js'
import { CoinGeckoClient } from 'coingecko-api-v3'
import { retryAsync } from 'ts-retry'
import {
    BURN,
    BUY,
    DE_LISTING,
    LISTING,
    PROGRAM_ACCOUNTS,
    PROGRAM_ACCOUNT_URLS,
    SELL,
} from './constants'
import { postWallet, postSaleToDiscord,postListingToDiscord } from './discord'
import { connection, logger} from './settings'
import { NFTMetaType, dataNFT } from './types'
import { getMetaData } from './utils'
const fetch = require("node-fetch");
const fs = require('fs');

const wallets: string[] = ["E29Q3rqQg3KXMtiDMUoajAkW6sU5Juc4SVk3j3MdRh9b","BXXHGpFtfyjNRFiPeEC8aRc11TijdiFo6HrxPbhUNjBA","5dZmmmiBkHX7qNtdkZZL2S9UcmXL87SGoXAzjvqN96Fc","E2cEgaHzd1VpzWkdtVt6Qh3D5dZsbv4n1BuWT1KX7rJj","HhuJCViqUewRNXrhwNuXCC7gqp2o1cUhx9a3nqEGkkqt","FKGU5DtaXjawG9BNpmiBCC1d5ComsnJbnHn2yZTj7tFc","fr7YFkGeJNGMxVJAhQgp9gZivKSNPcQU4roBK4boKGB","BP9a7nk1GJFAeLDJL1BxnXDRxzJviHT66w6Qcznz3t1X","H3AkHZHfcqGCcJpBn3FJWe52LcLxFMJQoZvZ6XyApFWf","FJbXMr7UGi9P1V1qZvFQ6fyHHS41idJPPyn98afdCJhD","HGEj9nJHdAWJKMHGGHRnhvb3i1XakELSRTn5B4otmAhU","fdBSnqQJTaWKTachvyaYkSM3zubxbFbk8Ek68XA1HwU","EAHJNfFDtivTMzKMNXzwAF9RTAeTd4aEYVwLjCiQWY1E","GCnCesT48KscB92StroDGi5EoAL1Vuq8Jr9cS9RSEtRg","DwnVBkzD8tSe6jcS71FwLaopB9MJfcxBWPSvbSGSTMXR","6Bryq6EeYnVv2Un5vK5vLohvxrhSK4tkMdQ6kU42vHnU","Fv4SsHSzdYa4LH6A7znS7vg45GPhP9ZxsF41FWFGDqPc","G7No8SCSoBeccFk6ZLEPmoPcFGbe6hbJisinLTk8633o","6SFShytsPZ61KuauRbBppAcs6WwuNXmEHpFxBUp68EKP","EGNA3eBeJpnfVswkn3PaXLiTarne1aMiNF4FxZRSErnr","fdBSnqQJTaWKTachvyaYkSM3zubxbFbk8Ek68XA1HwU","2V94ZrVkUXQiY1vSoZKdqmDN8Ab81W5vMe6SgWDyYMNE","HKz7s3Uj9x5XxVL58XX3DYDyGNRJmWKH6UZQRojoccFH","7B4qYwRgfZivYfuFErVoFRqqw5K1NvfPJcx2cX9QxUym","AjGC5fRZmGAkDJEeqb4i6D4oVQ13vn8sHJkXhDn8eRKJ","CpFeRs2swAgM2THbUUuR1dujBSuhSg3AAXgRvnjAvDPu","Cngze9zz4nRuzDcCahEprRdtTvH7mFG3fb1Ys8bU4H5v","8SxSRkjrKFgRReupstfMzHCo4rHZKYMwdjPTQTWsde3w"];
const walletsName: { [name: string]: string } = {"jagoe capital":"E29Q3rqQg3KXMtiDMUoajAkW6sU5Juc4SVk3j3MdRh9b","frankDeGods":"BXXHGpFtfyjNRFiPeEC8aRc11TijdiFo6HrxPbhUNjBA","solsniper":"5dZmmmiBkHX7qNtdkZZL2S9UcmXL87SGoXAzjvqN96Fc","solplayboy":"E2cEgaHzd1VpzWkdtVt6Qh3D5dZsbv4n1BuWT1KX7rJj","solhub":"HhuJCViqUewRNXrhwNuXCC7gqp2o1cUhx9a3nqEGkkqt","solbigbrain":"FKGU5DtaXjawG9BNpmiBCC1d5ComsnJbnHn2yZTj7tFc","solanagoddess":"fr7YFkGeJNGMxVJAhQgp9gZivKSNPcQU4roBK4boKGB","skellymode sol wallet":"BP9a7nk1GJFAeLDJL1BxnXDRxzJviHT66w6Qcznz3t1X","nate rivers":"H3AkHZHfcqGCcJpBn3FJWe52LcLxFMJQoZvZ6XyApFWf","jpeggler":"FJbXMr7UGi9P1V1qZvFQ6fyHHS41idJPPyn98afdCJhD","hge solwallet":"HGEj9nJHdAWJKMHGGHRnhvb3i1XakELSRTn5B4otmAhU","fast wallet":"fdBSnqQJTaWKTachvyaYkSM3zubxbFbk8Ek68XA1HwU","cozy":"EAHJNfFDtivTMzKMNXzwAF9RTAeTd4aEYVwLjCiQWY1E","angilo":"GCnCesT48KscB92StroDGi5EoAL1Vuq8Jr9cS9RSEtRg","hge second wallet":"DwnVBkzD8tSe6jcS71FwLaopB9MJfcxBWPSvbSGSTMXR","generalsol":"6Bryq6EeYnVv2Un5vK5vLohvxrhSK4tkMdQ6kU42vHnU","solbuckets":"Fv4SsHSzdYa4LH6A7znS7vg45GPhP9ZxsF41FWFGDqPc","solsniper 2 wallet":"G7No8SCSoBeccFk6ZLEPmoPcFGbe6hbJisinLTk8633o","0xfunction":"6SFShytsPZ61KuauRbBppAcs6WwuNXmEHpFxBUp68EKP","pratty.sol#4":"EGNA3eBeJpnfVswkn3PaXLiTarne1aMiNF4FxZRSErnr","fastdagod":"fdBSnqQJTaWKTachvyaYkSM3zubxbFbk8Ek68XA1HwU","stoner420":"2V94ZrVkUXQiY1vSoZKdqmDN8Ab81W5vMe6SgWDyYMNE","sp00nicus":"HKz7s3Uj9x5XxVL58XX3DYDyGNRJmWKH6UZQRojoccFH","jawn wick":"7B4qYwRgfZivYfuFErVoFRqqw5K1NvfPJcx2cX9QxUym","cozy 2":"AjGC5fRZmGAkDJEeqb4i6D4oVQ13vn8sHJkXhDn8eRKJ ","th":"CpFeRs2swAgM2THbUUuR1dujBSuhSg3AAXgRvnjAvDPu","solstice":"Cngze9zz4nRuzDcCahEprRdtTvH7mFG3fb1Ys8bU4H5v","cozy 3":"8SxSRkjrKFgRReupstfMzHCo4rHZKYMwdjPTQTWsde3w"};
let nameOfWallet = "no name found";
export const coingeckoClient = new CoinGeckoClient({
    autoRetry: true,
})

/**
 * Retrieve a processed block from the solana cluster
 * @param slot Slot where block is located
 * @returns Fetched block
 */
const retrieveBlock = async (slot: number): Promise<BlockResponse> => {
    return await retryAsync(
        async () => {
            logger.info(`Attempting to retrieve block in slot: ${slot}`)
            return (await connection.getBlock(slot)) as BlockResponse
        },
        { delay: 300, maxTry: 3 }
    )
}

const onAccountChangeCallBack = async (
    _accountInfo: AccountInfo<Buffer>,
    context: Context
) => {
    logger.info('Account change detected')
    const { slot } = context
    let wallet: PublicKey = new PublicKey(PublicKey.default)

    try {
        const block: BlockResponse = await retrieveBlock(slot)
        const { transactions } = block

        logger.info('Searching transactions')
        const transaction = transactions.find((item) => {
            const { accountKeys } = item.transaction.message
            const publicKey = accountKeys.find((publicKey) =>
                wallets.includes(publicKey.toString())
            )
            if (publicKey) {
                wallet = publicKey
                for(let key in walletsName){
                    if(walletsName[key]===publicKey.toString()){
                        nameOfWallet = key;
                    }
                }
                return item
            }
        })?.transaction

        logger.info('Transaction found')
        const signature = transaction?.signatures[0] ?? ''
        logger.info(`Getting transaction signature: ${signature}`)

        const txn: TransactionResponse = (await connection.getTransaction(
            signature
        )) as TransactionResponse
        const { preBalances, postBalances } =
            txn.meta as ConfirmedTransactionMeta
        const preTokenBalances = txn.meta
            ?.preTokenBalances as Array<TokenBalance>
        const postTokenBalances = txn.meta
            ?.postTokenBalances as Array<TokenBalance>

        const price =
            Math.abs(preBalances[0] - postBalances[0]) / LAMPORTS_PER_SOL
        let mintToken = postTokenBalances[0]?.mint

        if (mintToken) {
            let tradeDirection = ''
            const solanaPrice = await coingeckoClient.simplePrice({
                vs_currencies: 'usd',
                ids: 'solana',
            })
            const accountKeys = txn.transaction.message.accountKeys
            const programAccount = 'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K' as string
            const priceUSD = solanaPrice.solana.usd * price
            console.log(programAccount);

            for (const [key, value] of Object.entries(PROGRAM_ACCOUNTS)) {
                if (value.includes(programAccount)) {
                    let programAccountUrl = PROGRAM_ACCOUNT_URLS[key] || ''
                    const walletString = wallet.toString() as string

                    if (key === 'MortuaryInc') {
                        tradeDirection = BURN
                        mintToken = preTokenBalances[1].mint
                    } else if (key === 'MagicEden') {
                        programAccountUrl += `/${mintToken}`
                        tradeDirection =
                            preTokenBalances[0].owner === walletString
                                ? SELL
                                : BUY
                    } else if (key === 'Solanart'){
                        programAccountUrl += `/${mintToken}`
                        tradeDirection =
                            preTokenBalances[0].owner === walletString
                                ? SELL
                                : BUY
                    } else if (key === 'OpenSea'){
                        programAccountUrl += `/${mintToken}`
                        tradeDirection =
                            preTokenBalances[0].owner === walletString
                                ? SELL
                                : BUY
                    } else {
                        programAccountUrl += `/?token=${mintToken}`
                        tradeDirection =
                            postTokenBalances[0].owner === walletString
                                ? BUY
                                : SELL
                    }

                    if (price < 0.009) {
                        tradeDirection =
                            preTokenBalances[0].owner === walletString
                                ? LISTING
                                : DE_LISTING
                    }

                    const metadata = await getMetaData(mintToken)
                    const nftMeta: NFTMetaType = {
                        name: metadata.name,
                        tradeDirection,
                        price: price,
                        priceUSD: priceUSD,
                        image: metadata.image,
                        transactionDate: txn.blockTime as number,
                        marketPlaceURL: programAccountUrl,
                    }
                    if (price < 0.009){
                        stats1(mintToken,nftMeta, signature,nameOfWallet);
                    }
                    else {
                        stats(mintToken,nftMeta, signature,nameOfWallet);
                    }
                }
            }
        } else {
            logger.info('Not an NFT transaction')
        }
    } catch (e) {
        logger.error(e)
    }
}

const runBot = async () => {
    logger.info('Starting GuiltySpark bot')

    for (let i = 0; i < wallets.length; i++){
        let address = wallets[i];
        let name = walletsName[i];
        logger.info(`Subscribing to account changes for ${address}`)
        connection.onAccountChange(
        new PublicKey(address),
        onAccountChangeCallBack,
        'confirmed'
    )
    }
}

async function stats(mintUrl : string, nftMeta: NFTMetaType , signature : string, nameOfWallet: string) {
    let linkToken = 'https://api-mainnet.magiceden.dev/v2/tokens/'
    linkToken += mintUrl;
    let linkData = 'https://api-mainnet.magiceden.dev/v2/collections/';
    let resToken = await fetch(linkToken);
    let jsonToken = await resToken.json();
    let collectionName = jsonToken.collection;
    linkData += collectionName;
    linkData += '/stats';

    let res = await fetch(linkData);
  
    let json = await res.json();

    const divided = 1000000000;
    let fp = json.floorPrice/divided;
    const avg = json.avgPrice24hr/divided;
    const totalvolume = json.volumeAll/divided;
    let difference = nftMeta.price - fp;
    let diff = ' ';
    if(difference<0){
        diff = `\`${difference}\` SOL lower than`
    } else if(difference>0){
        diff = `\`${difference}\` SOL above`
    }   else if(difference==0){
        diff = ` same price as`
    };
    let stat = {ratio: diff ,volume :totalvolume, avergae: avg, listed:json.listedCount, floor: fp};
    if(json.listedCount=== undefined){
        stat = {ratio: "No data" ,volume :0, avergae: 0, listed:"No Data", floor: 0};
    }
    postSaleToDiscord(nftMeta , signature ,nameOfWallet, stat);
}

async function stats1(mintUrl : string, nftMeta: NFTMetaType , signature : string, nameOfWallet: string) {
    let linkToken = 'https://api-mainnet.magiceden.dev/v2/tokens/'
    linkToken += mintUrl;
    let linkData = 'https://api-mainnet.magiceden.dev/v2/collections/';
    let resToken = await fetch(linkToken);
    let jsonToken = await resToken.json();
    let collectionName = jsonToken.collection;
    linkData += collectionName;
    linkData += '/stats';
    let res = await fetch(linkData);
  
    let json = await res.json();

    const divided = 1000000000;
    let fp = json.floorPrice/divided;
    const avg = json.avgPrice24hr/divided;
    const totalvolume = json.volumeAll/divided;
    let difference = nftMeta.price - fp;
    let diff = ' ';
    if(difference<0){
        diff = `\`${difference}\` SOL lower than`
    } else if(difference>0){
        diff = `\`${difference}\` SOL above`
    }   else if(difference==0){
        diff = ` same price as`
    };
    let stat = {ratio: diff ,volume :totalvolume, avergae: avg, listed:json.listedCount, floor: fp};
    if(json.listedCount=== undefined){
        stat = {ratio: "No data" ,volume :0, avergae: 0, listed:"No Data", floor: 0};
    }
    postListingToDiscord(nftMeta , signature ,nameOfWallet, stat);
}

if (require.main) {
    void runBot()
}
