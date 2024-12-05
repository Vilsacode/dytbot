import { Request } from "express";
import { sendMessage } from "../discord/action";
import { config } from "../config";

interface EventFunc {
  (req: Request, event: any): Promise<void>
}

interface EventsFuncList {
  [name: string]: EventFunc
}

const stream_online: EventFunc = async (req: Request, event) => {
  console.log(`${event.broadcaster_user_name} est en live`)
  sendMessage(config.DISCORD_CHANNEL_ANNONCE, `@everyone le live commence : https://www.twitch.tv/${config.TWITCH_CHANNEL_NAME}`)
}

export const eventsFuncList: EventsFuncList = {
  'live': stream_online
}
