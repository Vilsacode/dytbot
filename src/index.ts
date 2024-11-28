import {client as discord} from './discord'
import { sendMessage } from './discord/action';
import { config } from './config';
import { startServer } from './server';

discord.once("ready", () => {
  const startingMessage = "DYTBot is ready! 🤖"
  console.log(startingMessage);
  if (config.DISCORD_CHANNEL_BOT) {
    sendMessage(config.DISCORD_CHANNEL_BOT, startingMessage)
  }
});

startServer().catch(err => console.error(err))
