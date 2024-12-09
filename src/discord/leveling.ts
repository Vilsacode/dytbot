// Chaque message donne un montant d'XP (ex : entre 5 et 15 XP) aléatoire pour éviter le spam inutile.
// Ajouter un cooldown (30 secondes) pour empêcher les spams excessifs.
// Réagir à un message (emoji).
// Participer à des événements ou jeux sur le serveur.

import { Message, OmitPartialGroupDMChannel } from "discord.js"
import { getRandomArbitrary } from "../utils"
import { addXP, get, levelUP } from "../database/repository/userRepository"
import { User } from "../database/entity/user"
import { sendImage } from "./action"
import { config } from "../config"
import { generateLevelUpCard } from "../canvas"
import { loadImage } from "canvas"

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


  console.log(`XP nécessaire à la monté de niveau : ${xpNeeded(user.level)}`)
  console.log(`XP de l'utilisateur : ${user.xp}`)
  if (xpNeeded(user.level) < user.xp) {
    console.log(`Monté au niveau ${user.level + 1}`)
    levelUP(member.id)
    const avatar = await loadImage(member.avatarURL({extension: 'png'}) ?? './assets/avatar.png')
    sendImage(config.DISCORD_CHANNEL_ANNONCE, await generateLevelUpCard(user.level + 1, member.username, avatar))
  }
}
