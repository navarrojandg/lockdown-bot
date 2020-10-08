import * as dotenv from 'dotenv';
dotenv.config();

import Discord, { Message, MessageReaction } from 'discord.js';
const client = new Discord.Client();
const token = process.env.TOKEN;
interface GuildContainer {
  id: string;
  activeMessage?: string;
  prevPermissions?: Discord.PermissionString[];
  postPermissions?: Discord.PermissionString[];
};
const gulidMap = new Map<string, GuildContainer>();
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
      if(msg.content.startsWith('!lockdown')) {
        // cache the active guild
        if(!!msg.guild) gulidMap.set(msg.guild.id, { id: msg.guild.id });
        lockdownHandler(msg);
      };
    };
  };
  return;
});

client.on('messageReactionAdd', (messageReaction, user) => {
  if(user.id == client.user?.id) return;
  
  let guild = messageReaction.message.guild;
  if (!!guild) {
    if(gulidMap.has(guild.id)) {
      if(messageReaction.message.id === gulidMap.get(guild.id)?.activeMessage) {
        const userReaction = guild?.member(user.id);
        if(userReaction?.roles.highest.permissions.has('ADMINISTRATOR')) {
          if(messageReaction.emoji.name == '🔓') unlockHandler(messageReaction);
        };
      };
    };
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

const removePermissions: Discord.PermissionString[] = [
  'SEND_MESSAGES',
  'CONNECT',
  'STREAM',
  'SPEAK',
];

const lockdownHandler = async (msg: Message) => {
  if(!!msg.guild) {
    let g = gulidMap.get(msg.guild.id);
    if(!!g) {
      g.prevPermissions = msg.guild.roles.everyone.permissions.toArray();
      console.log(`[${g.id}] previous permissions`, g.prevPermissions);
      g.postPermissions = g.prevPermissions.filter(perm => !removePermissions.includes(perm));
      console.log(`[${g.id}] post permissions`, g.postPermissions);
      // msg.guild.roles.everyone.setPermissions(new Discord.Permissions(g.postPermissions));
      let sentMessage = await msg.channel.send({ embed: lockdownEmbed });
      g.activeMessage = sentMessage.id;
      await sentMessage.react('🔓');
    };
  };
  return;
};

const unlockHandler = async (messageReaction: MessageReaction) => {
  if(!!messageReaction.message.guild) {
    let g = gulidMap.get(messageReaction.message.guild.id);
    if(!!g) {
      // let guildClient = await client.guilds.fetch(g.id);
      // restore the permissions
      // guildClient.roles.everyone.setPermissions(new Discord.Permissions(g.prevPermissions));
      await messageReaction.message.channel.send({ embed: unlockEmbed });
    };
  };
  return;
};

client.login(token);