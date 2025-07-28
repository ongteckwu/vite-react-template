import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import type { Context } from 'hono'
import type { EntityManager } from '@mikro-orm/postgresql'

export interface CreateContextOptions {
  c: Context
  resHeaders: Headers
  em?: EntityManager
}

export const createContext = ({ c, resHeaders, em }: CreateContextOptions) => {
  return {
    c,
    resHeaders,
    em,
  }
}

export type TRPCContext = Awaited<ReturnType<typeof createContext>>