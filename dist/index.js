"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var discord_js_1 = __importDefault(require("discord.js"));
var client = new discord_js_1.default.Client();
var token = process.env.TOKEN;
client.on('ready', function () {
    var _a;
    console.log(((_a = client.user) === null || _a === void 0 ? void 0 : _a.tag) + " is live!");
});
client.login(token);
