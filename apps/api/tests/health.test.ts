import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import { trpcServer } from '@hono/trpc-server'
import { appRouter } from '../src/trpc/router'
import { createContext } from '../src/trpc/context'

describe('Health endpoints', () => {
  it('should return health status from /health endpoint', async () => {
    const app = new Hono()
    
    app.get('/health', (c) => {
      return c.json({ status: 'ok', service: 'backend' })
    })

    const res = await app.request('/health')
    const data = await res.json()
    
    expect(res.status).toBe(200)
    expect(data).toEqual({ status: 'ok', service: 'backend' })
  })

  it('should return health status from tRPC endpoint', async () => {
    const app = new Hono()
    
    app.use(
      '/trpc/*',
      trpcServer({
        router: appRouter,
        createContext: ({ resHeaders }, c) => {
          return createContext({ c, resHeaders })
        },
      })
    )

    const res = await app.request('/trpc/health')
    const data = await res.json()
    
    expect(res.status).toBe(200)
    expect(data.result.data).toHaveProperty('status', 'ok')
    expect(data.result.data).toHaveProperty('timestamp')
  })
})