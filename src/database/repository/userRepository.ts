import { db } from '..'
import { User } from '../entity/user'

export const add = (userID: string) => {
  db.prepare('INSERT INTO users (userID) VALUES (?)').run(userID)
}

export const get = (userID: string) => {
  return db.prepare('SELECT * FROM users WHERE userID = ?').get(userID) as User | undefined
}

export const addXP = (userID: string, xp: number) => {
  const user = get(userID)
  if (!user) {
    throw new Error(`User (${userID}) not found`);
  }

  const newXP = user.xp + xp
  db.prepare('UPDATE users SET xp = ? WHERE userID = ? ').run(newXP, userID)
}