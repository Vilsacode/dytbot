import { Request } from "express";

interface EventFunc {
  (req: Request, event: any): Promise<void>
}

interface EventsFuncList {
  [name: string]: EventFunc
}

const stream_online: EventFunc = async (req: Request, event) => {
  console.log(`${event.broadcaster_user_name} est en live`)
}

export const eventsFuncList: EventsFuncList = {
  'live': stream_online
}
