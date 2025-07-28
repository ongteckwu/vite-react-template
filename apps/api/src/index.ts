import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { trpcServer } from '@hono/trpc-server'
import { MikroORM } from '@mikro-orm/postgresql'
import { createAppRouter } from '@repo/trpc'
import { createContext } from './trpc/context'
import { User, mikroOrmConfig } from '@repo/db'
import { env } from '@repo/config'

const app = new Hono()

// Initialize MikroORM
let orm: MikroORM
const appRouter = createAppRouter(User)

async function initializeORM() {
  try {
    orm = await MikroORM.init(mikroOrmConfig)
    const generator = orm.getSchemaGenerator()
    
    // Create database schema (tables) if they don't exist
    await generator.updateSchema()
    
    console.log('✅ Database connected and schema updated')
  } catch (error) {
    console.error('❌ Failed to initialize MikroORM:', error)
    process.exit(1)
  }
}

// Enable CORS for all routes
app.use('*', cors())

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', service: 'backend' })
})

// tRPC endpoint with MikroORM integration
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: ({ resHeaders }, c) => {
      const em = orm.em.fork()
      return createContext({ c, resHeaders, em })
    },
  })
)

// Default route
app.get('/', (c) => {
  return c.json({ 
    message: 'Welcome to the API',
    endpoints: {
      health: '/health',
      trpc: '/trpc',
    },
  })
})

const port = env.PORT

// Start server
async function startServer() {
  await initializeORM()
  
  console.log(`🚀 Server is running on http://localhost:${port}`)
  
  serve({
    fetch: app.fetch,
    port,
  })
}

startServer()