import dotenv from "dotenv";

dotenv.config();

const { 
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  DISCORD_CHANNEL_ANNONCE,
  DISCORD_CHANNEL_BOT,
  DISCORD_GUILD_ID
} = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  ROLES: {
    nouveau_challenger: 1308056467567411260,
    hero_arene: 1308056993428406315,
    forgeron: 1308057542156619898,
    spectateur_elite: 1308058014179131443,
  },
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  DISCORD_CHANNEL_ANNONCE,
  DISCORD_CHANNEL_BOT,
  DISCORD_GUILD_ID
};
