import * as dotenv from 'dotenv';
dotenv.config();

import Discord, { Message, MessageReaction } from 'discord.js';
const client = new Discord.Client();
const token = process.env.TOKEN;
client.on('ready', () => {
  client.user?.setPresence({
    activity: {
      type: 'WATCHING',
      name: '!lockdown'
    }
  });
  console.log(`${client.user?.tag} is live!`);
});

client.on('message', (msg: Message) => {
  if(msg.channel.type == 'text') {
    if(msg.member?.roles.highest.permissions.has('ADMINISTRATOR')) {
      if(msg.content.startsWith('!lockdown')) lockdownHandler(msg);
    };
  };
  return;
});

client.on('messageReactionAdd', (messageReaction, user) => {
  if(user.id == client.user?.id) return; 
  const userReaction = messageReaction.message.guild?.member(user.id);
  if(userReaction?.roles.highest.permissions.has('ADMINISTRATOR')) {
    if(messageReaction.emoji.name == '🔓') unlockHandler(messageReaction);
  };
  return;
});

const lockdownEmbed = {
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

const unlockEmbed = {
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
function lockdownHandler(msg: Message) {
  msg.channel.send({ embed: lockdownEmbed })
    .then(m => {
      m.react('🔓')
    })
    .catch(console.error);
};

function unlockHandler(messageReaction: MessageReaction) {
  // const everyonePerms = messageReaction.message.guild?.roles.everyone.permissions;
  // lockdownPermissions.forEach(p => everyonePerms?.add(p));
  messageReaction.message.channel.send({ embed: unlockEmbed });
};

client.login(token);