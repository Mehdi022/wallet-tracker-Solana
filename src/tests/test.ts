import {
    ConfirmedTransactionMeta,
    LAMPORTS_PER_SOL,
    PublicKey,
    TokenBalance,
    TransactionResponse,
} from '@solana/web3.js'
import { coingeckoClient } from '..'
import {
    BURN,
    BUY,
    DE_LISTING,
    LISTING,
    PROGRAM_ACCOUNTS,
    PROGRAM_ACCOUNT_URLS,
    SELL,
} from '../constants'
import { postSaleToDiscord, postListingToDiscord } from '../discord'
import { connection, logger } from '../settings'
import { NFTMetaType, dataNFT } from '../types'
import { getMetaData } from '../utils'

const runTest = async () => {
    try {
        const signature = ''
        const wallet: PublicKey = new PublicKey('')

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
            const programAccount = accountKeys.at(-1)?.toString() as string
            const priceUSD = solanaPrice.solana.usd * price

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
                        stats1(metadata.collection.name,nftMeta, signature,"no name found");
                    }
                    else {stats(metadata.collection.name,nftMeta, signature,"no name found")}
                }
            }
        } else {
            logger.info('Not an NFT transaction')
        }
    } catch (e) {
        logger.error(e)
    }
}

async function stats(name : string, nftMeta: NFTMetaType , signature : string, nameOfWallet: string) {
    let linkData = 'https://api-mainnet.magiceden.dev/v2/collections/';
    let statDataName = name.replaceAll(' ', '_');
    linkData += statDataName.toLowerCase();
    linkData += '/stats';

    let res = await fetch(linkData)
  
    let json = await res.json();
    if(json.floorPrice === undefined){
        linkData = 'https://api-mainnet.magiceden.dev/v2/collections/';
        statDataName = name.replaceAll(' ', '');
        linkData += statDataName.toLowerCase();
        linkData += '/stats';
        res = await fetch(linkData)
        json = await res.json();
    }
    const divided = 1000000000;
    let fp = json.floorPrice/divided;
    const avg = json.avgPrice24hr/divided;
    const totalvolume = json.volumeAll/divided;
    let difference = nftMeta.price - fp;
    let diff = ' ';
    if(difference<0){
        diff = `${difference} +  SOL lower than`
    } else if(difference>0){
        diff = `${difference} +  SOL above`
    }   else if(difference==0){
        diff = ` same price as`
    };
    let stat = {ratio: diff ,volume :totalvolume, avergae: avg, listed:json.listedCount, floor: fp};
    postSaleToDiscord(nftMeta , signature ,nameOfWallet, stat);
}

async function stats1(name : string, nftMeta: NFTMetaType , signature : string, nameOfWallet: string) {
    let linkData = 'https://api-mainnet.magiceden.dev/v2/collections/';
    let statDataName = name.replaceAll(' ', '_');
    linkData += statDataName.toLowerCase();
    linkData += '/stats';

    let res = await fetch(linkData)
  
    let json = await res.json();
    if(json.floorPrice === undefined){
        linkData = 'https://api-mainnet.magiceden.dev/v2/collections/';
        statDataName = name.replaceAll(' ', '');
        linkData += statDataName.toLowerCase();
        linkData += '/stats';
        res = await fetch(linkData)
        json = await res.json();
    }
    const divided = 1000000000;
    let fp = json.floorPrice/divided;
    const avg = json.avgPrice24hr/divided;
    const totalvolume = json.volumeAll/divided;
    let difference = nftMeta.price - fp;
    let diff = ' ';
    if(difference<0){
        diff = `${difference} +  SOL lower than`
    } else if(difference>0){
        diff = `${difference} +  SOL above`
    }   else if(difference==0){
        diff = ` same price as`
    };
    let stat = {ratio: diff ,volume :totalvolume, avergae: avg, listed:json.listedCount, floor: fp};
    postListingToDiscord(nftMeta , signature ,nameOfWallet, stat);
}

if (require.main) {
    void runTest()
}
