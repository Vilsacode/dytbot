import fs from 'fs'
import http from 'http'
import https from 'https'
import express from 'express'
import bodyParser from 'body-parser'
import { config } from './config'
import { getChannelId, manageSubscription } from './twitch/api'
import { getAccessToken } from './twitch/authent'
import { verifySignature } from './twitch/utils'
import { eventsFuncList } from './twitch/events'

const app = express()
app.use(bodyParser.json())

app.post('/twitch/webhook', async (req, res) => {
  if(!verifySignature(req)) {
    console.log('Signature Invalide')
    res.status(403).send('Invalid signature')
    return
  }

  console.log('Signature vérifié')

  const messageType = req.headers['twitch-eventsub-message-type']

  if (messageType === 'webhook_callback_verification') {
    console.log('Vérification du callback')
    res.send(req.body.challenge)
    return
  }
  
  if (messageType === 'notification') {
    const event = req.body.event
    console.log(`Evenement reçu: ${event.type}`)
    if (Object.keys(eventsFuncList).find(e => e === event.type)) {
      await eventsFuncList[event.type](req, event)
    }
    res.sendStatus(200)
    return
  }

  res.sendStatus(200)
})

export const startServer = async () => {
  await getAccessToken()
  const channelId = await getChannelId(config.TWITCH_CHANNEL_NAME)

  await manageSubscription('stream.online', { broadcaster_user_id: channelId })

  const httpServer = http.createServer(app);

  if (config.APP_ENV === 'prod') {
    // Certificate
    const privateKey = fs.readFileSync(`${config.CERT_PATH}/privkey.pem`, 'utf8');
    const certificate = fs.readFileSync(`${config.CERT_PATH}/cert.pem`, 'utf8');
    const ca = fs.readFileSync(`${config.CERT_PATH}/chain.pem`, 'utf8');
  
    const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca
    };

    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443, () => {
      console.log('HTTPS Server running on port 443');
    });
  }

  httpServer.listen(config.TWITCH_PORT, () => {
    console.log(`Server est en écoute sur le port : ${config.TWITCH_PORT}`)
  });
}