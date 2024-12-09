import { db } from '..'
import { User } from '../entity/user'

export const add = (userID: string) => {
  db.prepare('INSERT INTO users (userID) VALUES (?)').run(userID)
}

export const get = (userID: string) => {
  return db.prepare('SELECT * FROM users WHERE userID = ?').get(userID) as User | undefined
}

export const addXP = (userID: string, xp: number) => {
  let user = get(userID)
  let newUser = false
  if (!user) {
    console.log(`Création de l'utilisateur ${userID}`)
    add(userID)
    newUser = true
    user = get(userID) as User
  }

  const actualDate = new Date();
  const last_message_at_date = new Date(user?.last_message_at)
  last_message_at_date.setSeconds(last_message_at_date.getSeconds() + 30)

  if (last_message_at_date.getTime() > actualDate.getTime() && !newUser) {
    throw 'Moins de 30 secs après le dernier message'
  }

  const newXP = user.xp + xp
  db.prepare('UPDATE users SET xp = ?, last_message_at = ?  WHERE userID = ? ').run(newXP, Date.now(), userID)
}

export const levelUP = (userID: string) => {
  let user = get(userID)
  if (!user) {
    throw `Création de l'utilisateur ${userID}`
  }

  const newLevel = user.level + 1
  db.prepare('UPDATE users SET level = ? WHERE userID = ? ').run(newLevel, userID)
}