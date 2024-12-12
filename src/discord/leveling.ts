// Chaque message donne un montant d'XP (ex : entre 5 et 15 XP) aléatoire pour éviter le spam inutile.
// Ajouter un cooldown (30 secondes) pour empêcher les spams excessifs.
// Réagir à un message (emoji).
// Participer à des événements ou jeux sur le serveur.

// Nouveau Challenger => lvl 1-5
// Héros de l'Arène => 6-10
// Forgeron de Stratagèmes => 11-15
// Spectateur Élite => 16-20

import { Message, OmitPartialGroupDMChannel } from "discord.js"
import { getRandomArbitrary } from "../utils"
import { addXP, get, levelUP, switchRole } from "../database/repository/userRepository"
import { User } from "../database/entity/user"
import { assignRole, sendImage } from "./action"
import { config } from "../config"
import { generateLevelUpCard } from "../canvas"
import { loadImage } from "canvas"

const roles = {
  1 : {
    name: 'Nouveau Challenger',
    id: '1308056467567411260'
  },
  6 :  {
    name: 'Héros de l\'Arène',
    id: '1308056993428406315'
  },
  11 :  {
    name: 'Forgeron de Stratagèmes',
    id: '1308057542156619898'
  },
  16 :  {
    name: 'Spectateur Élite',
    id: '1308058014179131443'
  },
}

const xpNeeded = (level: number) => {
  return 50 * level + 50 * (level - 1)
}

export const addXpForMessage = async (interaction: OmitPartialGroupDMChannel<Message<boolean>>) => {
  const xp = Math.floor(getRandomArbitrary(5, 15))
  console.log(`XP à ajouter : ${xp}`)
  const member = interaction.author
  if (!member) {
    throw new Error(`No member in interaction (${interaction.type})`);    
  }
  addXP(member.id, xp)
  const user = get(member.id) as User

  const neededXp = xpNeeded(user.level)
  console.log(`XP nécessaire à la monté de niveau : ${neededXp}`)
  console.log(`XP de l'utilisateur : ${user.xp}`)
  if (neededXp < user.xp) {
    const newLevel = user.level + 1
    console.log(`Monté au niveau ${newLevel}`)
    levelUP(member.id)
    const avatar = await loadImage(member.avatarURL({extension: 'png'}) ?? './assets/avatar.png')
    sendImage(config.DISCORD_CHANNEL_ANNONCE, await generateLevelUpCard(newLevel, member.username, avatar))

    // Vérification du changement de role
    if (newLevel in roles) {
      switchRole(user.userID, roles[newLevel as 1 | 6 | 11 | 16].name)
      assignRole(user.userID, roles[newLevel as 1 | 6 | 11 | 16].id)
    }
  }
}
