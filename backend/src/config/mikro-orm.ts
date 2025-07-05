import { defineConfig } from '@mikro-orm/postgresql'
import { User } from '../entities/User'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  entities: [User],
  dbName: process.env.DB_NAME || 'template_db',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  debug: process.env.NODE_ENV === 'development',
  allowGlobalContext: true, // for simplicity in this template
})