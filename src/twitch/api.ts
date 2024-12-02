import axios from 'axios'
import { config } from '../config'
import { accessToken } from './authent'

interface ConditionType {
  broadcaster_user_id?: string
}

export const getChannelId = async (channelName: string) => {
  const response = await axios.get(
    'https://api.twitch.tv/helix/users',
    {
      headers: {
        'Client-ID': config.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        login: channelName
      }
    }
  )

  return response.data.data[0]?.id
}

export const manageSubscription = async (type: string, condition: ConditionType) => {
  const response = await axios.get(
    'https://api.twitch.tv/helix/eventsub/subscriptions',
    {
      headers: {
        'Client-ID': config.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      }
    }
  )

  const existingSubscription = response.data.data.find(
    (sub: any) => sub.type === type && JSON.stringify(sub.condition) === JSON.stringify(condition)
  )

  if (existingSubscription) {
    console.log(`Une souscription existante a été trouvé (ID: ${existingSubscription.id}). Suppression...`)
    await deleteSubscription(existingSubscription.id)
  }

  
  const createResponse = await axios.post(
    'https://api.twitch.tv/helix/eventsub/subscriptions',
    {
      type,
      version: '1',
      condition,
      transport: {
        method: 'webhook',
        callback: config.TWITCH_CALLBACK_URL,
        secret: config.TWITCH_WEBHOOK_SECRET
      }
    },
    {
      headers: {
        'Client-ID': config.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'

      }
    }
  )

  console.log('Webhook souscrit : ', createResponse.data)
}

export const deleteSubscription = async (id: string) => {
  const response = await axios.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${id}`, {
    headers: {
      'Client-ID': config.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${accessToken}`
    }
  })

  console.log('Souscription supprimée : ', response.status)
}

export const sendMessage = async (message: string) => {
  const response = await axios.post('https://api.twitch.tv/helix/chat/messages', {
    broadcaster_id: config.TWITCH_CHAT_CHANNEL_USER_ID,
    sender_id: config.TWITCH_BOT_USER_ID,
    message
  }, {
    headers: {
      Authorization: `Bearer ${config.TWITCH_WS_OAUTH_TOKEN}`,
      'Client-ID': config.TWITCH_CLIENT_ID,
      'Content-Type': 'application/json'
    }
  })

  if (response.status !== 200 ) {
    console.error('Echec de l\'envoi du message')
    console.error(response.data)
  } else {
    console.log(`Message envoyé : ${message}`)
  }
}

export const registerEventSubListeners = async () => {
  const response = await axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
    type: 'channel.chat.message',
    version: '1',
    condition: {
      broadcaster_user_id: config.TWITCH_CHAT_CHANNEL_USER_ID,
      user_id: config.TWITCH_BOT_USER_ID
    },
    transport: {
      method: 'websocket',
      session_id: config.TWITCH_WS_SESSION_ID
    }
  }, {
    headers: {
      Authorization: `Bearer ${config.TWITCH_WS_OAUTH_TOKEN}`,
      'Client-ID': config.TWITCH_CLIENT_ID,
      'Content-Type': 'application/json'
    }
  })

  if (response.status !== 202) {
    console.error('Echec de l\'inscription à EventSub')
    console.error(response.data)
  } else {
    console.log('Inscrit à channel.chat.message')
  }
}
