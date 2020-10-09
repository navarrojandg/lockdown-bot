"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
;
var gulidMap = new Map();
client.on('ready', function () {
    var _a, _b;
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
        activity: {
            type: 'WATCHING',
            name: '!lockdown'
        }
    });
    console.log(((_b = client.user) === null || _b === void 0 ? void 0 : _b.tag) + " is live!");
});
client.on('message', function (msg) {
    var _a;
    if (msg.channel.type == 'text') {
        if ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.roles.highest.permissions.has('ADMINISTRATOR')) {
            if (msg.content.startsWith('!lockdown')) {
                // cache the active guild
                if (!!msg.guild)
                    gulidMap.set(msg.guild.id, { id: msg.guild.id });
                lockdownHandler(msg);
            }
            ;
        }
        ;
    }
    ;
    if (msg.channel.type == 'dm') {
        if (msg.content.startsWith('!ping')) {
            msg.reply({ embed: pongEmbed() });
        }
        ;
    }
    ;
    return;
});
client.on('messageReactionAdd', function (messageReaction, user) {
    var _a, _b;
    if (user.id == ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id))
        return;
    var guild = messageReaction.message.guild;
    if (!!guild) {
        if (gulidMap.has(guild.id)) {
            if (messageReaction.message.id === ((_b = gulidMap.get(guild.id)) === null || _b === void 0 ? void 0 : _b.activeMessage)) {
                var userReaction = guild === null || guild === void 0 ? void 0 : guild.member(user.id);
                if (userReaction === null || userReaction === void 0 ? void 0 : userReaction.roles.highest.permissions.has('ADMINISTRATOR')) {
                    if (messageReaction.emoji.name == '🔓')
                        unlockHandler(messageReaction);
                }
                ;
            }
            ;
        }
        ;
    }
    ;
    return;
});
var lockdownEmbed = function () {
    return {
        title: 'Lockdown Started',
        color: '#FFBC00',
        description: 'This server is now locked. During this time, `@everyone` will be unable to send messages or connect to voice channels.',
        fields: [
            {
                name: '\u200B',
                value: 'React with 🔓 to unlock the server.'
            }
        ],
        footer: {
            text: 'lockdown bot',
            icon_url: 'https://i.imgur.com/AFN0zRy.png',
        },
        timestamp: new Date()
    };
};
var unlockEmbed = function () {
    return {
        title: 'Lockdown Ended',
        color: '#017C1B',
        description: 'This server is now unlocked. `@everyone` is now able to send messages or connect to voice channels.',
        footer: {
            text: 'lockdown bot',
            icon_url: 'https://i.imgur.com/AFN0zRy.png',
        },
        timestamp: new Date()
    };
};
var pongEmbed = function () {
    return {
        title: 'pong!',
        color: '#017C1B',
        footer: {
            text: 'lockdown bot',
            icon_url: 'https://i.imgur.com/AFN0zRy.png',
        },
        timestamp: new Date()
    };
};
var removePermissions = [
    'SEND_MESSAGES',
    'CONNECT',
    'STREAM',
    'SPEAK',
];
var lockdownHandler = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var g, sentMessage, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!!!msg.guild) return [3 /*break*/, 4];
                g = gulidMap.get(msg.guild.id);
                if (!!!g) return [3 /*break*/, 3];
                g.prevPermissions = msg.guild.roles.everyone.permissions.toArray();
                console.log("[" + g.id + "] previous permissions", g.prevPermissions);
                g.postPermissions = g.prevPermissions.filter(function (perm) { return !removePermissions.includes(perm); });
                console.log("[" + g.id + "] post permissions", g.postPermissions);
                // set new permissions
                msg.guild.roles.everyone.setPermissions(new discord_js_1.default.Permissions(g.postPermissions));
                return [4 /*yield*/, msg.channel.send({ embed: lockdownEmbed() })];
            case 1:
                sentMessage = _a.sent();
                g.activeMessage = sentMessage.id;
                return [4 /*yield*/, sentMessage.react('🔓')];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                ;
                _a.label = 4;
            case 4:
                ;
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 6];
            case 6:
                ;
                return [2 /*return*/];
        }
    });
}); };
var unlockHandler = function (messageReaction) { return __awaiter(void 0, void 0, void 0, function () {
    var g, guildClient, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!!!messageReaction.message.guild) return [3 /*break*/, 4];
                g = gulidMap.get(messageReaction.message.guild.id);
                if (!!!g) return [3 /*break*/, 3];
                return [4 /*yield*/, client.guilds.fetch(g.id)];
            case 1:
                guildClient = _a.sent();
                // restore the permissions
                guildClient.roles.everyone.setPermissions(new discord_js_1.default.Permissions(g.prevPermissions));
                return [4 /*yield*/, messageReaction.message.channel.send({ embed: unlockEmbed() })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                ;
                _a.label = 4;
            case 4:
                ;
                return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                console.error(err_2);
                return [3 /*break*/, 6];
            case 6:
                ;
                return [2 /*return*/];
        }
    });
}); };
client.login(token);
