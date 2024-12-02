import WebSocket from 'ws'
import { config } from '../config';
import { getOAuthToken } from './authent';
import { getUserIds } from './utils';
import { registerEventSubListeners, sendMessage } from './api';

const commands = {
  'discord': config.DISCORD_INVITE_URL,
  'github': config.GITHUB_URL,
  'youtube': config.YOUTUBE_URL,
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
      config.TWITCH_WS_SESSION_ID = data.payload.session.id
      registerEventSubListeners()
      break;
      case 'notification':
      console.log(`Message de Souscription type ${data.metadata.subscription_type} reçu`)
      if (data.metadata.subscription_type === 'channel.chat.message') {
        console.log(`MSG #${data.payload.event.broadcaster_user_login} <${data.payload.event.chatter_user_login}> ${data.payload.event.message.text}`)
      }

      if ((data.payload.event.message.text as string).startsWith('!')) {
        const command = (data.payload.event.message.text as string).slice(1)
        console.log(`Commande ${command} reçu`)
        if (commands[command as keyof typeof commands] && commands[command as keyof typeof commands]) {
          sendMessage(commands[command as keyof typeof commands] ?? 'Lien non implémenté')
        }
      }
      break;
  
    default:
      break;
  }
}

export const start = async () => {
  await getOAuthToken();

  await getUserIds()

  console.log(`Bot User Id: ${config.TWITCH_BOT_USER_ID}`)
  console.log(`Chat Channel User Id: ${config.TWITCH_CHAT_CHANNEL_USER_ID}`)

  startWebSocketClient()
}