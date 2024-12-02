import crypto from 'crypto'
import { config } from '../config'
import { Request } from 'express'
import axios from 'axios'

export const verifySignature = (req: Request) => {
  const messageId = req.headers['twitch-eventsub-message-id'] as string
  const timestamp = req.headers['twitch-eventsub-message-timestamp'] as string
  const message = messageId + timestamp + JSON.stringify(req.body)
  const signature = crypto.createHmac('sha256', config.TWITCH_WEBHOOK_SECRET).update(message).digest('hex')

  return `sha256=${signature}` === req.headers['twitch-eventsub-message-signature']
}

export const getUserIds = async () => {
  const response = await axios.get('https://api.twitch.tv/helix/users', {
    headers: {
      Authorization: `Bearer ${config.TWITCH_WS_OAUTH_TOKEN}`,
      'Client-ID': config.TWITCH_CLIENT_ID
    },
    params: {
      login: [
        config.TWITCH_BOT_NAME,
        config.TWITCH_CHANNEL_NAME
      ]
    }
  })

  const botUser = response.data.data.find((user: any) => user.login === config.TWITCH_BOT_NAME)
  const channelUser = response.data.data.find((user: any) => user.login === config.TWITCH_CHANNEL_NAME)

  if (!botUser) {
    console.error('Impossible de trouver l\'utilisateur du bot')
  }
  if (!channelUser) {
    console.error('Impossible de trouver l\'utilisateur du channel')
  }
  if(!botUser || !channelUser) {
    process.exit(1)
  }
  
  config.TWITCH_BOT_USER_ID = botUser.id,
  config.TWITCH_CHAT_CHANNEL_USER_ID = channelUser.id
}