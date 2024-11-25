import {client as discord} from './discord'
import { sendMessage } from './discord/action';
import { config } from './discord/config';

discord.once("ready", () => {
  const startingMessage = "DYTBot is ready! 🤖"
  console.log(startingMessage);
  if (config.DISCORD_CHANNEL_BOT) {
    sendMessage(config.DISCORD_CHANNEL_BOT, startingMessage)
  }
});
