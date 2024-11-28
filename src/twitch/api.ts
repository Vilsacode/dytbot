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