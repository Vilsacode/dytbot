import axios from 'axios'
import { config } from '../config'

export let accessToken: string | null = null
const scopes = ['user:read:chat', 'user:write:chat']

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

export const getOAuthToken = async () => {
  if (!config.TWITCH_WS_OAUTH_TOKEN) {
    console.log('Aucun token valide n\'a été trouvé.')

    
    const authURL = `https://id.twtch.tv/oauth2/authorize?client_id=${config.TWITCH_CLIENT_ID}&redirect_uri=${config.TWITCH_CALLBACK_URL}&response_type=token&scope=${scopes.join('+')}`
    console.log('Veuillez générer un token OAuth avec les permissions nécessaires en ouvrant cette URL :')
    console.log(authURL)
    console.log('\nCollez le token obtenu dans le fichier `.env` sous la forme :')
    console.log('TWITCH_WS_OAUTH_TOKEN:your_access_token')

    process.exit(1)
  }

  const validation = await validateToken()

  if (validation.valid) {
    console.log('Token OAuth validé avec succès.')
    return
  }

  console.error('Le token est invalide ou il manque des scopes requis')
  process.exit(1)
}

const validateToken = async () => {
  try {
    const response = await axios.get('https://id.twitch.tv/oauth2/validate', {
      headers: {
        Authorization: `Bearer ${config.TWITCH_WS_OAUTH_TOKEN}`
      }
    })

    console.log(`Token OAuth2 valide. Il expire dans ${response.data.expire_in} secondes.`)

    const missingScopes = scopes.filter(scope => !response.data.scopes.includes(scope))

    return {
      valid: missingScopes.length === 0,
      missingScopes
    }
  } catch (error) {
    return {
      valid: false
    }
  }
}