"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaplexConnection = exports.connection = exports.SOLANA_CLUSTER_ENDPOINT = exports.DISCORD_WEBHOOK_URL = exports.logger = void 0;
const web3_js_1 = require("@solana/web3.js");
const dotenv_1 = __importDefault(require("dotenv"));
const winston_1 = require("winston");
const js_1 = require("@metaplex/js");
dotenv_1.default.config();
const myFormat = winston_1.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});
exports.logger = (0, winston_1.createLogger)({
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), myFormat),
    transports: [new winston_1.transports.Console({})],
});
exports.DISCORD_WEBHOOK_URL = "your own discord webhook url";
exports.SOLANA_CLUSTER_ENDPOINT = "https://api.mainnet-beta.solana.com";
exports.connection = new web3_js_1.Connection(exports.SOLANA_CLUSTER_ENDPOINT, 'confirmed');
exports.metaplexConnection = new js_1.Connection(exports.SOLANA_CLUSTER_ENDPOINT);
