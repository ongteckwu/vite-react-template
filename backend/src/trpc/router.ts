import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import type { TRPCContext } from './context'
import { User } from '../entities/User'

const t = initTRPC.context<TRPCContext>().create()

export const router = t.router
export const publicProcedure = t.procedure

const userRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.em) throw new Error('Database not initialized')
    
    const users = await ctx.em.find(User, {})
    return users
  }),
  
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.em) throw new Error('Database not initialized')
      
      const user = await ctx.em.findOne(User, { id: input.id })
      if (!user) throw new Error('User not found')
      
      return user
    }),
  
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.em) throw new Error('Database not initialized')
      
      const user = new User(input.name, input.email)
      await ctx.em.persistAndFlush(user)
      
      return user
    }),
  
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.em) throw new Error('Database not initialized')
      
      const user = await ctx.em.findOne(User, { id: input.id })
      if (!user) throw new Error('User not found')
      
      if (input.name) user.name = input.name
      if (input.email) user.email = input.email
      
      await ctx.em.flush()
      
      return user
    }),
  
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.em) throw new Error('Database not initialized')
      
      const user = await ctx.em.findOne(User, { id: input.id })
      if (!user) throw new Error('User not found')
      
      await ctx.em.removeAndFlush(user)
      
      return { success: true }
    }),
})

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? 'World'}!`,
      }
    }),
  
  health: publicProcedure.query(() => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }),
  
  user: userRouter,
})

export type AppRouter = typeof appRouter