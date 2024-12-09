import Canvas, { Image } from 'canvas'

export const generateStreamLiveCard = async (titre: string) => {
  const canvas = Canvas.createCanvas(700, 400)
  const context = canvas.getContext('2d')

  const background = await Canvas.loadImage('./assets/fond_annonces.jpg')
  const logo = await Canvas.loadImage('./assets/logo_twitch.png')
  
  const avatar_size = 150

  backgroundImage(context, background, canvas.width, canvas.height)
  context.drawImage(logo, 30, 30, avatar_size, avatar_size)

  context.font = "40px 'Fira Code', serif"
  context.fillStyle = '#D401CC'
  context.textAlign = 'end'
  context.fillText(`Nouveau live en cours`, canvas.width - 20, (canvas.height / 2) + 50)

  context.font = "60px 'Fira Code', serif"
  context.fillStyle = '#FFFFFF'
  context.textAlign = 'end'
  context.fillText(`#${titre}`, canvas.width - 50, canvas.height-30)

  return canvas
}

export const generateYoutubeVideoCard = async (titre: string) => {
  const canvas = Canvas.createCanvas(700, 400)
  const context = canvas.getContext('2d')

  const background = await Canvas.loadImage('./assets/fond_annonces.jpg')
  const logo = await Canvas.loadImage('./assets/logo_youtube.png')

  backgroundImage(context, background, canvas.width, canvas.height)
  context.drawImage(logo, 30, 30, 143, 100)

  context.font = "40px 'Fira Code', serif"
  context.fillStyle = '#D401CC'
  context.textAlign = 'end' 
  context.fillText(`Nouvelle vidéo disponible`, canvas.width - 20, (canvas.height / 2) + 50)

  context.font = "60px 'Fira Code', serif"
  context.fillStyle = '#FFFFFF'
  context.textAlign = 'end'
  context.fillText(`#${titre}`, canvas.width - 50, canvas.height-30)

  return canvas
}

export const generateLevelUpCard = async (level: number, username: string, avatar: Image) => {
  const canvas = Canvas.createCanvas(700, 400)
  const context = canvas.getContext('2d') 

  const avatar_size = 100

  const background = await Canvas.loadImage('./assets/fond_level_up.jpg')
  backgroundImage(context, background, canvas.width, canvas.height)
  context.drawImage(avatar, 120, 10, avatar_size, avatar_size)

  context.font = "60px 'Fira Code', serif"
  context.fillStyle = '#FF66FF'
  context.textAlign = 'center'
  context.fillText(level.toString(), canvas.width / 1.89, canvas.height / 2.05)
  context.fillStyle = '#FFFFFF'
  context.fillText(`Level UP`, (canvas.width / 1.95), (canvas.height / 2.15) + 150)
  
  context.font = "40px 'Fira Code', serif"
  context.textAlign = 'end'
  context.fillText(username, canvas.width - 30, (avatar_size / 2) + 10)

  return canvas
}

const backgroundImage = (context: Canvas.CanvasRenderingContext2D, background: Image, width: number, height: number) => {
  let x = 0
  let y = 0
  let radius = 40
  context.save();
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  context.clip();
  context.drawImage(background, 0, 0, width, height)
  context.restore();
}