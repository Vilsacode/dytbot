import {client as discord} from './discord'

discord.once("ready", () => {
  console.log("Discord bot is ready! 🤖");
});