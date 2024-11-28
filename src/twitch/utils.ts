import crypto from 'crypto'
import { config } from '../config'
import { Request } from 'express'

export const verifySignature = (req: Request) => {
  const messageId = req.headers['twitch-eventsub-message-id'] as string
  const timestamp = req.headers['twitch-eventsub-message-timestamp'] as string
  const message = messageId + timestamp + JSON.stringify(req.body)
  const signature = crypto.createHmac('sha256', config.TWITCH_WEBHOOK_SECRET).update(message).digest('hex')

  return `sha256=${signature}` === req.headers['twitch-eventsub-message-signature']
}