type ProgramAccountType = {
    [key: string]: string[]
}

type ProgramAccountUrlType = {
    [key: string]: string
}

export const PROGRAM_ACCOUNTS: ProgramAccountType = {
    MagicEden: [
        'MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8',
        'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K',
    ],
    OpenSea: ['5SKmrbAxnHV2sgqyDXkGrLrokZYtWWVEEk5Soed7VLVN'],
    Solanart: ['CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz'],
    MortuaryInc: ['minc9MLymfBSEs9ho1pUaXbQQPdfnTnxUvJa8TWx85E'],
}

export const PROGRAM_ACCOUNT_URLS: ProgramAccountUrlType = {
    MagicEden: 'https://www.magiceden.io/item-details',
    OpenSea: 'https://opensea.io/assets/solana',
    Solanart: 'https://solanart.io/search',
    MortuaryInc: 'https://mortuary-inc.io',
}

export const BUY = 'BOUGHT 🛒'
export const SELL = 'SOLD 💰'
export const BURN = 'BURNED 🔥'
export const LISTING = 'LISTED 🛍️'
export const DE_LISTING = 'DE-LISTED 🏃'
