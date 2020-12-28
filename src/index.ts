import * as dotenv from 'dotenv';
dotenv.config();
import yargs from './cli';
import Discord, {Message, PermissionResolvable } from 'discord.js';
import {MongoClient, Collection, Db} from 'mongodb';

// connect to db
let db: Db;
let guilds: Collection<GuildContainer>;
const mongo = new MongoClient(process.env.DB_URI as string, {useUnifiedTopology: true});
mongo.connect((err, client) => {
  if (!!err) {
    console.log('Error connecting to db');
  };
  console.log('Connected to db');
  db = client.db('discord');
  guilds = db.collection<GuildContainer>('guilds');
});

// connect to discord
const client = new Discord.Client();
const token = process.env.TOKEN;

interface GuildContainer {
  guildId: string;
  activeMessage: string;
  roles: RoleContainer[];
};

interface RoleContainer {
  roleId: string;
  name: string;
  permissions: PermissionResolvable[];
};

const removePermissions: Discord.PermissionString[] = [
  'SEND_MESSAGES',
  'CONNECT',
  'STREAM',
  'SPEAK',
];

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
      if(msg.content.startsWith('!test')) {
        lockdownHandler(msg);
      };
    };
  };
  if(msg.channel.type == 'dm') {
    if(msg.content.startsWith('!ping')) {
      msg.reply({ embed: pongEmbed() });
    };
  };
  return;
});

const lockdownHandler = async (msg: Discord.Message) => {
  try {
    if (await cantLockdown(msg.guild)) {
      return msg.channel.send({embed: responseEmbed('Lockdown currently active, please unlock the server before starting a new lockdown.')});
    };
    await updateGuild(msg.guild);
    const roles = await parseRolesFromMsg(msg);
    roles?.forEach(async (role) => {
      try {
        await updateRole(role);
        await lockRole(role);
      } catch(err) {
        console.error(err);
      };
    });
    const sentMessage = await msg.channel.send({
      embed: lockdownEmbed(roles)
    });
    await updateActiveMessage(sentMessage);
    await sentMessage.react('🔓');
  } catch(err) {
    console.error(err);
  };
  return;
};

async function cantLockdown(guild: Discord.Guild | null) {
  const guildDoc = await getGuild(guild?.id);
  return !!guildDoc?.activeMessage;
};

function updateGuild(guild: Discord.Guild | null) {
  if (guild == null) return;
  return guilds.updateOne(
    {guildId: guild.id},
    {
      $set: {guildId: guild.id, roles: []},
      $setOnInsert: {activeMessage: ''}
    },
    {upsert: true}
  );
};

async function parseRolesFromMsg(msg: Discord.Message) {
  const targetRoles = yargs.parse(msg.content).role as string[];
  const roles = (await msg.guild?.roles.fetch())?.cache;
  return roles?.filter(role => {
    return targetRoles.includes(role.name);
  });
};

function updateRole(role: Discord.Role) {
  return guilds.findOneAndUpdate(
    {guildId: role.guild.id},
    {$addToSet: {
      roles: {
        roleId: role.id,
        name: role.name,
        permissions: role.permissions.toArray()
      }
    }}
  );
};

function lockRole(role: Discord.Role) {
  const updatedPerms = role.permissions.toArray()
    .filter(permission => !removePermissions.includes(permission));
  role.setPermissions(new Discord.Permissions(updatedPerms));
};

function updateActiveMessage(msg: Discord.Message) {
  return guilds.updateOne(
    {guildId: msg.guild?.id},
    {
      $set: {activeMessage: msg.id}
    }
  );
};

const lockdownEmbed = (roles?: Discord.Collection<string, Discord.Role>) => {
  const roleString = roles?.reduce((acc, curr) => {
    return acc += `${curr.name}, `;
  }, '');
  return {
    title: 'Lockdown Enabled',
    color: '#FFBC00',
    description: `This server is now locked. During this time: \`${roleString?.trim()}\` will be unable to send messages or connect to voice channels.`,
    fields: [
      {
        name: '\u200B',
        value: 'React with 🔓 to unlock the server.'
      }
    ],
    footer: {
      text: `lockdown bot • ${new Date().toLocaleString()}`,
      icon_url: 'https://i.imgur.com/AFN0zRy.png',
    }
  };
};

client.on('raw', async (packet) => {
  try {
    if (!['MESSAGE_REACTION_ADD'].includes(packet.t)) return;
    if (packet.d.user_id == client.user?.id) return;
    const guild = await client.guilds.fetch(packet.d.guild_id);
    const guildDoc = await getGuild(guild.id);
    if (packet.d.message_id == guildDoc?.activeMessage) {
      const userReaction = await guild.members.fetch(packet.d.user_id);
      if (userReaction?.roles.highest.permissions.has('ADMINISTRATOR')) {
        if (packet.d.emoji.name == '🔓') {
          guildDoc?.roles?.forEach(async ({roleId, permissions}) => {
            const role = await guild?.roles.fetch(roleId);
            await role?.setPermissions(new Discord.Permissions(permissions));
          });
          const channel = await client.channels.fetch(packet.d.channel_id) as Discord.TextChannel;
          await channel.send({embed: unlockEmbed(guildDoc?.roles)});
          await clearActiveMessage(guild.id);
        };
      };
    };
  } catch(err) {
    console.error(err);
  };
});

function getGuild(id?: string) {
  return guilds.findOne({guildId: id});
};

const unlockEmbed = (roles?: RoleContainer[]) => {
  const roleString = roles?.reduce((acc, curr) => {
    return acc += `${curr.name}, `;
  }, '');
  return {
    title: 'Lockdown Disabled',
    color: '#017C1B',
    description: `This server is now unlocked. \`${roleString?.trim()}\` is now able to send messages or connect to voice channels.`,
    footer: {
      text: `lockdown bot • ${new Date().toLocaleString()}`,
      icon_url: 'https://i.imgur.com/AFN0zRy.png',
    }
  };
};

async function clearActiveMessage(guildId: string) {
  return guilds.updateOne(
    {guildId},
    {$set: {activeMessage: ''}}
  );
};

const pongEmbed = () => {
  return {
    title: 'pong!',
    color: '#017C1B',
    footer: {
      text: `lockdown bot • ${new Date().toLocaleString()}`,
      icon_url: 'https://i.imgur.com/AFN0zRy.png',
    }
  };
};

const responseEmbed = (message: string) => {
  return {
    color: '#FFBC00',
    description: message,
    footer: {
      text: `lockdown bot • ${new Date().toLocaleString()}`,
      icon_url: 'https://i.imgur.com/AFN0zRy.png',
    }
  };
};

client.login(token);