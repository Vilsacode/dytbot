import Canvas from 'canvas'
import { config } from '../config'

export const generateStreamLiveCard = async () => {
  const canvas = Canvas.createCanvas(700, 250)
  const context = canvas.getContext('2d')

  const background = await Canvas.loadImage('./assets/fond_espace.jpg')
  context.drawImage(background, 0, 0, canvas.width, canvas.height)

  context.font = '28px sans-serif'
  context.fillStyle = '#d60f34'

  context.fillText(`@everyone le live commence`, 140, 80)
  context.fillText(`https://www.twitch.tv/${config.TWITCH_CHANNEL_NAME}`, 140, 180)

  return canvas
}