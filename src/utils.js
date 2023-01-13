"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetaData = void 0;
const js_1 = require("@metaplex/js");
const axios_1 = __importDefault(require("axios"));
const settings_1 = require("./settings");
const { metadata: { Metadata }, } = js_1.programs;
const getMetaData = async (tokenPubKey) => {
    try {
        const addr = await Metadata.getPDA(tokenPubKey);
        const resp = await Metadata.load(settings_1.metaplexConnection, addr);
        const { data } = await axios_1.default.get(resp.data.data.uri);
        return data;
    }
    catch (error) {
        settings_1.logger.error(error);
    }
};
exports.getMetaData = getMetaData;
