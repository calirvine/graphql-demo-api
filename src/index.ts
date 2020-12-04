import { start } from './app'
import { config } from 'dotenv'

config()

const PORT = process.env.PORT ? parseInt(process.env.PORT) : undefined

start(PORT)
