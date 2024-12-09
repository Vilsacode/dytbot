import {client as discord} from './discord'
import { sendImage, sendMessage } from './discord/action';
import { config } from './config';
import { startServer } from './server';
import { start } from './twitch/ws'
import { generateLevelUpCard, generateStreamLiveCard, generateYoutubeVideoCard } from './canvas';

import './database/migration'
import { loadImage } from 'canvas';
discord.once("ready", async () => {
  const startingMessage = "DYTBot is ready! 🤖"
  console.log(startingMessage);
  if (config.DISCORD_CHANNEL_BOT) {
    sendMessage(config.DISCORD_CHANNEL_BOT, startingMessage)

    const avatar =  await loadImage('./assets/avatar.png')
    sendImage(config.DISCORD_CHANNEL_BOT, await generateLevelUpCard(10, 'vilsafur', avatar))
    sendImage(config.DISCORD_CHANNEL_BOT, await generateStreamLiveCard('DYTBot'))
    sendImage(config.DISCORD_CHANNEL_BOT, await generateYoutubeVideoCard('DYTBot'))
  }
});

startServer().catch(err => console.error(err))

start()
