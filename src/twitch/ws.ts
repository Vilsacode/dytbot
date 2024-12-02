import WebSocket from 'ws'
import { config } from '../config';
import axios from 'axios';

let websocketSessionId: string;
let BOT_USER_ID: string = "";
let CHAT_CHANNEL_USER_ID: string = "";
const scopes = ['user:read:chat', 'user:write:chat']

const getOAuthToken = async () => {
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

const getUserIds = async () => {
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

  BOT_USER_ID = botUser.id
  CHAT_CHANNEL_USER_ID = channelUser.id
}

const startWebSocketClient = () => {
  const websocketClient = new WebSocket(config.TWITCH_EVENTSUB_WEBSOCKET_URL)

  websocketClient.on('error', console.error)

  websocketClient.on('open', () => {
    console.log(`Connexion WebSocket ouverte à ${config.TWITCH_EVENTSUB_WEBSOCKET_URL}`)
  })

  websocketClient.on('message', (data: any) => {
    handleWebSocketMessage(JSON.parse(data.toString()))
  })

  return websocketClient
}

const handleWebSocketMessage = (data: any) => {
  console.log(`Message de type ${data.metadata.message_type} reçu`)
  switch (data.metadata.message_type) {
    case 'session_welcome':
      websocketSessionId = data.payload.session.id
      registerEventSubListeners()
      break;
      case 'notification':
      console.log(`Message de Souscription type ${data.metadata.subscription_type} reçu`)
      if (data.metadata.subscription_type === 'channel.chat.message') {
        console.log(`MSG #${data.payload.event.broadcaster_user_login} <${data.payload.event.chatter_user_login}> ${data.payload.event.message.text}`)
      }

      if (data.payload.event.message.text.trim() === 'Hello') {
        sendMessage('Hi')
      }
      break;
  
    default:
      break;
  }
}

const sendMessage = async (message: string) => {
  const response = await axios.post('https://api.twitch.tv/helix/chat/messages', {
    broadcaster_id: CHAT_CHANNEL_USER_ID,
    sender_id: BOT_USER_ID,
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

const registerEventSubListeners = async () => {
  const response = await axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
    type: 'channel.chat.message',
    version: '1',
    condition: {
      broadcaster_user_id: CHAT_CHANNEL_USER_ID,
      user_id: BOT_USER_ID
    },
    transport: {
      method: 'websocket',
      session_id: websocketSessionId
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

export const start = async () => {
  await getOAuthToken()

  await getUserIds()

  console.log(`Bot User Id: ${BOT_USER_ID}`)
  console.log(`Chat Channel User Id: ${CHAT_CHANNEL_USER_ID}`)

  const websocketClient = startWebSocketClient()
}