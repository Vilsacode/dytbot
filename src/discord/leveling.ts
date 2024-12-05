// Chaque message donne un montant d'XP (ex : entre 5 et 15 XP) aléatoire pour éviter le spam inutile.
// Ajouter un cooldown (30 secondes) pour empêcher les spams excessifs.
// Réagir à un message (emoji).
// Participer à des événements ou jeux sur le serveur.

import { CacheType, Interaction, Message, OmitPartialGroupDMChannel } from "discord.js"
import { getRandomArbitrary } from "../utils"
import { addXP } from "../database/repository/userRepository"

const xpNeeded = (level: number) => {
  return 50 * (level ** 2) + 50 * (level - 1)
}

export const addXpForMessage = (interaction: OmitPartialGroupDMChannel<Message<boolean>>) => {
  const xp = Math.floor(getRandomArbitrary(5, 15))
  console.log(`XP à ajouter : ${xp}`)
  const member = interaction.author
  if (!member) {
    throw new Error(`No member in interaction (${interaction.type})`);    
  }
  addXP(member.id, xp)
}