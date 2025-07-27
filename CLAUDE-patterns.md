# CLAUDE Code Patterns

## Frontend Architecture

### React Component Structure
- **Functional components** with TypeScript
- **Hooks-based** state management (useState)
- **Component organization**: Single responsibility, props typing
- **File naming**: PascalCase for components (e.g., `UserList.tsx`)

### State Management Patterns
- **React Query (TanStack)** for server state via tRPC hooks
- **Local state** with useState for form inputs and UI state
- **Custom hooks** in `hooks/api.ts` for tRPC procedure exports

### Styling Conventions
- **Tailwind CSS v4** for styling
- **Responsive design** with mobile-first approach
- **Component-scoped** utility classes
- **Color scheme**: Indigo primary, gray neutrals

### tRPC Integration
```typescript
// Pattern: Custom hook exports
export const useUsers = trpc.user.list.useQuery
export const useCreateUser = trpc.user.create.useMutation

// Pattern: Mutation with refetch
await createUser.mutateAsync({ name, email })
refetch()
```

## Backend Architecture

### Server Setup (Hono + tRPC)
- **Hono framework** for HTTP server
- **CORS enabled** for all routes
- **Health check** endpoint at `/health`
- **tRPC router** mounted at `/trpc/*`

### Database Patterns (MikroORM)
- **Entity-first** approach with decorators
- **Repository pattern** via EntityManager
- **Schema updates** on startup with `updateSchema()`
- **Fork pattern**: `orm.em.fork()` for request isolation

### tRPC Router Structure
```typescript
// Pattern: Nested routers
export const appRouter = router({
  user: userRouter,
  health: publicProcedure.query(...)
})

// Pattern: Input validation with Zod
.input(z.object({
  name: z.string().min(1),
  email: z.string().email(),
}))
```

### Error Handling
- **Explicit error throws** with descriptive messages
- **Database existence checks** before operations
- **Validation** at procedure input level

## Testing Patterns

### Vitest Configuration
- **Separate configs** for frontend/backend
- **jsdom environment** for React testing
- **Testing Library** for component testing
- **UI mode** available with `test:ui` script

## Development Workflow

### Environment Setup
- **Docker Compose** for development/production
- **Hot reload** enabled for both frontend/backend
- **Bun runtime** for backend, Vite for frontend
- **Port allocation**: Frontend (5173), Backend (3001)

### TypeScript Configuration
- **Strict mode** enabled
- **Path mapping** for imports
- **Separate tsconfig** files per package
- **Type safety** enforced across tRPC boundary