import Database from 'better-sqlite3'
import { config } from '../config'

export const db = new Database(config.DATABASE_PATH)