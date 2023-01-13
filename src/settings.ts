import { Connection } from '@solana/web3.js'
import dotenv from 'dotenv'
import { Format } from 'logform'
import { createLogger, format, Logger, transports } from 'winston'
import { Connection as MetaplexConnection } from '@metaplex/js'

dotenv.config()

const myFormat: Format = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`
})

export const logger: Logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        myFormat
    ),
    transports: [new transports.Console({})],
})

export const  DISCORD_WEBHOOK_URL  = "your own discord webhook url";
export const SOLANA_CLUSTER_ENDPOINT = "https://api.mainnet-beta.solana.com";

export const connection = new Connection(SOLANA_CLUSTER_ENDPOINT, 'confirmed')
export const metaplexConnection = new MetaplexConnection(
    SOLANA_CLUSTER_ENDPOINT
)
