import {client as discord} from './discord'
import { sendMessage } from './discord/action';
import { config } from './config';
import { startServer } from './server';
import { start } from './twitch/ws'

import './database/migration'
discord.once("ready", async () => {
  const startingMessage = "DYTBot is ready! 🤖"
  console.log(startingMessage);
  if (config.DISCORD_CHANNEL_BOT) {
    sendMessage(config.DISCORD_CHANNEL_BOT, startingMessage)
  }
});

startServer().catch(err => console.error(err))

start()
