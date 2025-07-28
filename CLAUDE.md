# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a full-stack TypeScript monorepo template with the following structure:

### Applications (`/apps`)
- **Web** (`/apps/web`): Vite + React 19 + Tailwind CSS 4 + tRPC client
- **API** (`/apps/api`): Hono + tRPC server + MikroORM + PostgreSQL

### Shared Packages (`/packages`)
- **tRPC** (`/packages/trpc`): Shared tRPC router definitions and types
- **Database** (`/packages/db`): MikroORM entities, config, and database utilities
- **Config** (`/packages/config`): Shared environment and configuration utilities

### Key Technologies

- **Frontend**: React 19, Vite 6.3, Tailwind CSS 4, TanStack Query 5, tRPC React Query
- **Backend**: Hono 4.8, tRPC 11.4, MikroORM 6.4, PostgreSQL 16, Bun runtime
- **Testing**: Vitest 3.2 for both frontend and backend
- **Database**: PostgreSQL with MikroORM for entity/schema management
- **Monorepo**: Bun workspaces with TypeScript project references

### Monorepo Structure

The application uses tRPC for end-to-end type safety between frontend and backend:
- Shared tRPC router definitions in `@repo/trpc` package
- Database entities and config in `@repo/db` package  
- Environment configuration in `@repo/config` package
- Apps import shared packages via workspace references (`@repo/*`)

## Development Commands

### Monorepo Commands (Root Level)
```bash
# Install all dependencies across monorepo
bun install

# Build all apps and packages
bun run build

# Run tests across all packages
bun run test

# Run linting across all packages
bun run lint

# Clean all node_modules and dist folders
bun run clean
```

### Docker Development (Recommended)
```bash
# Start all services (PostgreSQL, API, Web, Adminer)
docker-compose -f docker-compose.dev.yml up

# API runs on localhost:3001
# Web runs on localhost:5173  
# Adminer (DB admin) runs on localhost:8080
```

### Local Development (Web App)
```bash
cd apps/web
bun install
bun run dev          # Start dev server
bun run build        # Build for production
bun run lint         # Run ESLint
bun run test         # Run Vitest tests
bun run test:ui      # Run Vitest with UI
```

### Local Development (API)
```bash
cd apps/api
bun install
bun run dev          # Start with hot reload
bun run build        # Build for production
bun run start        # Run production build
bun run test         # Run Vitest tests
bun run test:ui      # Run Vitest with UI
bun run mikro-orm    # Run MikroORM CLI commands
```

### Database Management
- MikroORM config: `packages/db/src/config/mikro-orm.ts`
- Entities: `packages/db/src/entities/`
- Schema updates happen automatically on API startup in development
- Use Adminer at localhost:8080 for database inspection (when using Docker)

## Project Structure Patterns

### tRPC Integration
- Shared router factory in `packages/trpc/src/router.ts`
- API instantiates router in `apps/api/src/index.ts`
- Web app hooks in `apps/web/src/hooks/api.ts`
- Type-safe client setup in `apps/web/src/lib/trpc.ts`

### Database Patterns
- Entity definitions in `packages/db/src/entities/`
- MikroORM config in `packages/db/src/config/mikro-orm.ts`
- Context provides forked EntityManager: `apps/api/src/trpc/context.ts`
- Auto-schema updates in development via `apps/api/src/index.ts`

### Component Structure
- React components in `apps/web/src/components/`
- Uses Tailwind CSS 4 with Vite plugin
- Testing setup with React Testing Library and Vitest

### Workspace Dependencies
- Apps use `@repo/*` packages via workspace references
- Shared packages export TypeScript definitions
- Build order managed by TypeScript project references

## Environment Configuration

Environment variables are managed through:
- `.env.example` in root (template)
- `apps/web/.env` for web app-specific vars
- `packages/config/src/env.ts` for shared configuration
- Docker Compose environment sections for containerized development

Default ports:
- Web App: 5173
- API: 3001  
- PostgreSQL: 5432
- Adminer: 8080