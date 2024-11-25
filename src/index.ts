import {client as discord} from './discord'
import { sendMessage } from './discord/action';
import { config } from './discord/config';

discord.once("ready", () => {
  console.log("DYTBot bot is ready! 🤖");
  if (config.DISCORD_CHANNEL_BOT) {
    sendMessage(config.DISCORD_CHANNEL_BOT, "DYTBot is ready! 🤖")
  }
});
