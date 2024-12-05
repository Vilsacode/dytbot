import {client as discord} from './discord'
import { sendImage, sendMessage } from './discord/action';
import { config } from './config';
import { startServer } from './server';
import { start } from './twitch/ws'
import { generateStreamLiveCard } from './canvas';

import './database/migration'
discord.once("ready", async () => {
  const startingMessage = "DYTBot is ready! 🤖"
  console.log(startingMessage);
  if (config.DISCORD_CHANNEL_BOT) {
    sendMessage(config.DISCORD_CHANNEL_BOT, startingMessage)

    sendImage(config.DISCORD_CHANNEL_BOT, await generateStreamLiveCard(), `@everyone : Rejoint nous sur twitch : https://www.twitch.tv/${config.TWITCH_CHANNEL_NAME}`)
  }
});

// startServer().catch(err => console.error(err))

// start()
