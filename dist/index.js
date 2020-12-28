"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var cli_1 = __importDefault(require("./cli"));
var discord_js_1 = __importDefault(require("discord.js"));
var mongodb_1 = require("mongodb");
// connect to db
var db;
var guilds;
var mongo = new mongodb_1.MongoClient(process.env.DB_URI, { useUnifiedTopology: true });
mongo.connect(function (err, client) {
    if (!!err) {
        console.log('Error connecting to db');
    }
    ;
    console.log('Connected to db');
    db = client.db('discord');
    guilds = db.collection('guilds');
});
// connect to discord
var client = new discord_js_1.default.Client();
var token = process.env.TOKEN;
;
;
var removePermissions = [
    'SEND_MESSAGES',
    'CONNECT',
    'STREAM',
    'SPEAK',
];
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
var lockdownHandler = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var roles, sentMessage, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4 /*yield*/, cantLockdown(msg.guild)];
            case 1:
                if (_a.sent()) {
                    return [2 /*return*/, msg.channel.send({ embed: responseEmbed('Lockdown currently active, please unlock the server before starting a new lockdown.') })];
                }
                ;
                return [4 /*yield*/, updateGuild(msg.guild)];
            case 2:
                _a.sent();
                return [4 /*yield*/, parseRolesFromMsg(msg)];
            case 3:
                roles = _a.sent();
                roles === null || roles === void 0 ? void 0 : roles.forEach(function (role) { return __awaiter(void 0, void 0, void 0, function () {
                    var err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, updateRole(role)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, lockRole(role)];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                err_2 = _a.sent();
                                console.error(err_2);
                                return [3 /*break*/, 4];
                            case 4:
                                ;
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, msg.channel.send({
                        embed: lockdownEmbed(roles)
                    })];
            case 4:
                sentMessage = _a.sent();
                return [4 /*yield*/, updateActiveMessage(sentMessage)];
            case 5:
                _a.sent();
                return [4 /*yield*/, sentMessage.react('🔓')];
            case 6:
                _a.sent();
                return [3 /*break*/, 8];
            case 7:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 8];
            case 8:
                ;
                return [2 /*return*/];
        }
    });
}); };
function cantLockdown(guild) {
    return __awaiter(this, void 0, void 0, function () {
        var guildDoc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getGuild(guild === null || guild === void 0 ? void 0 : guild.id)];
                case 1:
                    guildDoc = _a.sent();
                    return [2 /*return*/, !!(guildDoc === null || guildDoc === void 0 ? void 0 : guildDoc.activeMessage)];
            }
        });
    });
}
;
function updateGuild(guild) {
    if (guild == null)
        return;
    return guilds.updateOne({ guildId: guild.id }, {
        $set: { guildId: guild.id, roles: [] },
        $setOnInsert: { activeMessage: '' }
    }, { upsert: true });
}
;
function parseRolesFromMsg(msg) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var targetRoles, roles;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    targetRoles = cli_1.default.parse(msg.content).role;
                    return [4 /*yield*/, ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.roles.fetch())];
                case 1:
                    roles = (_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.cache;
                    return [2 /*return*/, roles === null || roles === void 0 ? void 0 : roles.filter(function (role) {
                            return targetRoles.includes(role.name);
                        })];
            }
        });
    });
}
;
function updateRole(role) {
    return guilds.findOneAndUpdate({ guildId: role.guild.id }, { $addToSet: {
            roles: {
                roleId: role.id,
                name: role.name,
                permissions: role.permissions.toArray()
            }
        } });
}
;
function lockRole(role) {
    var updatedPerms = role.permissions.toArray()
        .filter(function (permission) { return !removePermissions.includes(permission); });
    role.setPermissions(new discord_js_1.default.Permissions(updatedPerms));
}
;
function updateActiveMessage(msg) {
    var _a;
    return guilds.updateOne({ guildId: (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id }, {
        $set: { activeMessage: msg.id }
    });
}
;
var lockdownEmbed = function (roles) {
    var roleString = roles === null || roles === void 0 ? void 0 : roles.reduce(function (acc, curr) {
        return acc += curr.name + ", ";
    }, '');
    return {
        title: 'Lockdown Enabled',
        color: '#FFBC00',
        description: "This server is now locked. During this time: `" + (roleString === null || roleString === void 0 ? void 0 : roleString.trim()) + "` will be unable to send messages or connect to voice channels.",
        fields: [
            {
                name: '\u200B',
                value: 'React with 🔓 to unlock the server.'
            }
        ],
        footer: {
            text: "lockdown bot \u2022 " + new Date().toLocaleString(),
            icon_url: 'https://i.imgur.com/AFN0zRy.png',
        }
    };
};
client.on('raw', function (packet) { return __awaiter(void 0, void 0, void 0, function () {
    var guild_1, guildDoc, userReaction, channel, err_3;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 10, , 11]);
                if (!['MESSAGE_REACTION_ADD'].includes(packet.t))
                    return [2 /*return*/];
                if (packet.d.user_id == ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id))
                    return [2 /*return*/];
                return [4 /*yield*/, client.guilds.fetch(packet.d.guild_id)];
            case 1:
                guild_1 = _c.sent();
                return [4 /*yield*/, getGuild(guild_1.id)];
            case 2:
                guildDoc = _c.sent();
                if (!(packet.d.message_id == (guildDoc === null || guildDoc === void 0 ? void 0 : guildDoc.activeMessage))) return [3 /*break*/, 9];
                return [4 /*yield*/, guild_1.members.fetch(packet.d.user_id)];
            case 3:
                userReaction = _c.sent();
                if (!(userReaction === null || userReaction === void 0 ? void 0 : userReaction.roles.highest.permissions.has('ADMINISTRATOR'))) return [3 /*break*/, 8];
                if (!(packet.d.emoji.name == '🔓')) return [3 /*break*/, 7];
                (_b = guildDoc === null || guildDoc === void 0 ? void 0 : guildDoc.roles) === null || _b === void 0 ? void 0 : _b.forEach(function (_a) {
                    var roleId = _a.roleId, permissions = _a.permissions;
                    return __awaiter(void 0, void 0, void 0, function () {
                        var role;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (guild_1 === null || guild_1 === void 0 ? void 0 : guild_1.roles.fetch(roleId))];
                                case 1:
                                    role = _b.sent();
                                    return [4 /*yield*/, (role === null || role === void 0 ? void 0 : role.setPermissions(new discord_js_1.default.Permissions(permissions)))];
                                case 2:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                return [4 /*yield*/, client.channels.fetch(packet.d.channel_id)];
            case 4:
                channel = _c.sent();
                return [4 /*yield*/, channel.send({ embed: unlockEmbed(guildDoc === null || guildDoc === void 0 ? void 0 : guildDoc.roles) })];
            case 5:
                _c.sent();
                return [4 /*yield*/, clearActiveMessage(guild_1.id)];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7:
                ;
                _c.label = 8;
            case 8:
                ;
                _c.label = 9;
            case 9:
                ;
                return [3 /*break*/, 11];
            case 10:
                err_3 = _c.sent();
                console.error(err_3);
                return [3 /*break*/, 11];
            case 11:
                ;
                return [2 /*return*/];
        }
    });
}); });
function getGuild(id) {
    return guilds.findOne({ guildId: id });
}
;
var unlockEmbed = function (roles) {
    var roleString = roles === null || roles === void 0 ? void 0 : roles.reduce(function (acc, curr) {
        return acc += curr.name + ", ";
    }, '');
    return {
        title: 'Lockdown Disabled',
        color: '#017C1B',
        description: "This server is now unlocked. `" + (roleString === null || roleString === void 0 ? void 0 : roleString.trim()) + "` is now able to send messages or connect to voice channels.",
        footer: {
            text: "lockdown bot \u2022 " + new Date().toLocaleString(),
            icon_url: 'https://i.imgur.com/AFN0zRy.png',
        }
    };
};
function clearActiveMessage(guildId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, guilds.updateOne({ guildId: guildId }, { $set: { activeMessage: '' } })];
        });
    });
}
;
var pongEmbed = function () {
    return {
        title: 'pong!',
        color: '#017C1B',
        footer: {
            text: "lockdown bot \u2022 " + new Date().toLocaleString(),
            icon_url: 'https://i.imgur.com/AFN0zRy.png',
        }
    };
};
var responseEmbed = function (message) {
    return {
        color: '#FFBC00',
        description: message,
        footer: {
            text: "lockdown bot \u2022 " + new Date().toLocaleString(),
            icon_url: 'https://i.imgur.com/AFN0zRy.png',
        }
    };
};
client.login(token);
