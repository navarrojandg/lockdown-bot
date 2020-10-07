import * as dotenv from 'dotenv';
dotenv.config();

import Discord from 'discord.js';
const client = new Discord.Client();
const token = process.env.TOKEN;
client.on('ready', () => {
  console.log(`${client.user?.tag} is live!`);
});

client.login(token);