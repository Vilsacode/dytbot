import { Request } from "express";
import { sendImage } from "../discord/action";
import { config } from "../config";
import { generateStreamLiveCard } from "../canvas";

interface EventFunc {
  (req: Request, event: any): Promise<void>
}

interface EventsFuncList {
  [name: string]: EventFunc
}

const stream_online: EventFunc = async (req: Request, event) => {
  console.log(`${event.broadcaster_user_name} est en live`)
  sendImage(config.DISCORD_CHANNEL_BOT, await generateStreamLiveCard(), `@everyone : Rejoint nous sur twitch : https://www.twitch.tv/${config.TWITCH_CHANNEL_NAME}`)
}

export const eventsFuncList: EventsFuncList = {
  'live': stream_online
}
