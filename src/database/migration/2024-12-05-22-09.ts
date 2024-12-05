import { db } from '..'

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    userID TEXT PRIMARY KEY,
    xp INTEGER DEFAULT 0,
    level INTERGER DEFAULT 1,
    role TEXT DEFAULT 'Nouveau Challenger'
  )
`).run()
