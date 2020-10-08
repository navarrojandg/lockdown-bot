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
            if (msg.content.startsWith('!lockdown'))
                lockdownHandler(msg);
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
    var userReaction = (_b = messageReaction.message.guild) === null || _b === void 0 ? void 0 : _b.member(user.id);
    if (userReaction === null || userReaction === void 0 ? void 0 : userReaction.roles.highest.permissions.has('ADMINISTRATOR')) {
        if (messageReaction.emoji.name == '🔓')
            unlockHandler(messageReaction);
    }
    ;
    return;
});
var lockdownEmbed = {
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
var unlockEmbed = {
    title: 'Lockdown Ended',
    color: '#03FF00',
    description: 'This server is now unlocked. `@everyone` is now able to send messages or connect to voice channels.',
    footer: {
        text: 'lockdown bot',
        icon_url: 'https://i.imgur.com/AFN0zRy.png',
    },
    timestamp: new Date()
};
// const lockdownPermissions: Discord.PermissionString[] = [
//   'SEND_MESSAGES',
//   'CONNECT',
//   'STREAM'
// ];
function lockdownHandler(msg) {
    msg.channel.send({ embed: lockdownEmbed })
        .then(function (m) {
        m.react('🔓');
    })
        .catch(console.error);
}
;
function unlockHandler(messageReaction) {
    // const everyonePerms = messageReaction.message.guild?.roles.everyone.permissions;
    // lockdownPermissions.forEach(p => everyonePerms?.add(p));
    messageReaction.message.channel.send({ embed: unlockEmbed });
}
;
client.login(token);
