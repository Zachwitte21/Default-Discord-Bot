import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import startDbListener from './dbListener';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
  startDbListener(client, '1304648354437009503')
});

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI as string);
client.login(process.env.DISCORD_TOKEN);