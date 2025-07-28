import { trpc } from '../lib/trpc'

// Re-export all tRPC hooks for easy access
export const useHello = trpc.hello.useQuery
export const useHealth = trpc.health.useQuery

// User hooks
export const useUsers = trpc.user.list.useQuery
export const useUser = trpc.user.getById.useQuery
export const useCreateUser = trpc.user.create.useMutation
export const useUpdateUser = trpc.user.update.useMutation
export const useDeleteUser = trpc.user.delete.useMutation