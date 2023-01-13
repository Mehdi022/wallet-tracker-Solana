import axios from 'axios'
import { DISCORD_WEBHOOK_URL, logger } from './settings'
import { NFTMetaType , dataNFT } from './types'

export const postWallet = (
    walletName : string
): void => {
    logger.info('Posting wallet info to discord')
    axios.post(DISCORD_WEBHOOK_URL as string, {
        embeds: [
            {
                title: `WALLET : ${walletName}`,
                description: `account changed statue detected on ${walletName}`,
            },
        ],
    })
}

export const postSaleToDiscord = (
    nftMeta: NFTMetaType,
    signature: string,
    walletName: string,
    stats : dataNFT
): void => {
    logger.info('Posting sale info to discord')
    const {
        tradeDirection,
        name,
        marketPlaceURL,
        price,
        priceUSD,
        transactionDate,
        image,
    } = nftMeta
    axios.post(DISCORD_WEBHOOK_URL as string, {
        embeds: [
            {
                title: `NFT ${tradeDirection}`,
                fields: [
                    {
                        name: 'NFT',
                        value: `[${name}](${marketPlaceURL})`,
                        inline: false,
                    },
                    {
                        name: 'Price',
                        value: `${price} SOL (\`$${priceUSD}\`)`,
                        inline: false,
                    },
                    {
                        name: 'Buyer',
                        value: `\`${walletName}\``,
                        inline: false,
                    },
                    {
                        "name": "PRICE RATIO",
                        "value": `SOLD ${stats.ratio} floor price :  \`${stats.floor}\` SOL`,
                    },
                    {
                        name: 'total volume',
                        value: `\`${stats.volume}\` SOL`,
                        inline: true,
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
    })
}

export const postListingToDiscord = (
    nftMeta: NFTMetaType,
    signature: string,
    walletName: string,
    stats : dataNFT
): void => {
    logger.info('Posting sale info to discord')
    const {
        tradeDirection,
        name,
        marketPlaceURL,
        price,
        priceUSD,
        transactionDate,
        image,
    } = nftMeta
    axios.post(DISCORD_WEBHOOK_URL as string, {
        embeds: [
            {
                title: `NFT ${tradeDirection}`,
                description: `\`${walletName}\` ${tradeDirection} [${name}](${marketPlaceURL})`,
                fields: [
                    {
                        name: 'listed',
                        value: `\`${stats.listed}\``,
                        inline: true,
                    },
                    {
                        name: 'floor price',
                        value: `\`${stats.floor}\` SOL`,
                        inline: true,
                    },
                    {
                        name: 'total volume',
                        value: `\`${stats.volume}\` SOL`,
                        inline: true,
                    },
                    {
                        name: 'average price',
                        value: `\`${stats.avergae}\` SOL`,
                        inline: true,
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
    })
}

export const postDiscordUndefinedListing = (
    nftMeta: NFTMetaType,
    signature: string,
    walletName: string,
    stats : dataNFT
): void => {
    logger.info('Posting sale info to discord')
    const {
        tradeDirection,
        name,
        marketPlaceURL,
        price,
        priceUSD,
        transactionDate,
        image,
    } = nftMeta
    axios.post(DISCORD_WEBHOOK_URL as string, {
        embeds: [
            {
                title: `NFT ${tradeDirection}`,
                description: `${walletName} ${tradeDirection} [${name}](${marketPlaceURL})`,
                fields: [
                    {
                        name: 'SORRY 😔',
                        value: `It seems like I couldn't find any further information.`,
                        inline: true,
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
    })
}

export const postDiscordUndefined = (
    nftMeta: NFTMetaType,
    signature: string,
    walletName: string,
    stats : dataNFT
): void => {
    logger.info('Posting sale info to discord')
    const {
        tradeDirection,
        name,
        marketPlaceURL,
        price,
        priceUSD,
        transactionDate,
        image,
    } = nftMeta
    axios.post(DISCORD_WEBHOOK_URL as string, {
        embeds: [
            {
                title: `NFT ${tradeDirection}`,
                description: `${walletName} ${tradeDirection} [${name}](${marketPlaceURL}) for \`${price}\` SOL`,
                fields: [
                    {
                        name: 'Price',
                        value: `${price} SOL (\`$${priceUSD}\`)`,
                        inline: false,
                    },
                    {
                        name: 'SORRY 😔',
                        value: `It seems like I couldn't find any further information.`,
                        inline: true,
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
    })
}