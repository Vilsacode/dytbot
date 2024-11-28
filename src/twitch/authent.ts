import axios from 'axios'
import { config } from '../config'

export let accessToken: string | null = null

export const getAccessToken = async () => {
  const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: config.TWITCH_CLIENT_ID,
      client_secret: config.TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials'
    }
  })

  accessToken = response.data.access_token
}