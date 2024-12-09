import { Client, GatewayIntentBits  } from "discord.js";
import { commands } from "./commands";
import { config } from "../config";
import { deployCommands } from "./deploy-commands";
import { addXpForMessage } from "./leveling";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.DirectMessages
  ],
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
})

client.on('messageCreate', (message) => {
  try {
    if (message.author.id !== config.DISCORD_BOT_ID) {
      console.log(`Nouveau Message`)
      addXpForMessage(message)
      console.log('XP Ajouté')
    }
  } catch (error) {
    console.error(error)
  }
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);
