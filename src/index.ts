import {client as discord} from './discord'
import { sendImage, sendMessage } from './discord/action';
import { config } from './config';
import { startServer } from './server';
import { start } from './twitch/ws'
import { generateStreamLiveCard } from './canvas';

discord.once("ready", async () => {
  const startingMessage = "DYTBot is ready! 🤖"
  console.log(startingMessage);
  if (config.DISCORD_CHANNEL_BOT) {
    sendMessage(config.DISCORD_CHANNEL_BOT, startingMessage)

    sendImage(config.DISCORD_CHANNEL_BOT, await generateStreamLiveCard())
  }
});

// startServer().catch(err => console.error(err))

// start()
