# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development (Docker - Recommended)
```bash
docker-compose -f docker-compose.dev.yml up                    # Start all services for development
docker-compose -f docker-compose.dev.yml up -d                 # Start services in detached mode
docker-compose -f docker-compose.dev.yml down                  # Stop all services
docker-compose -f docker-compose.dev.yml logs -f backend       # View backend logs
docker-compose -f docker-compose.dev.yml logs -f frontend      # View frontend logs
```

### Development (Local)
```bash
# Backend (requires PostgreSQL running)
cd backend && bun dev                # Start backend development server
cd backend && bun test               # Run backend tests
cd backend && bun test:ui            # Run backend tests with UI

# Frontend
cd frontend && bun dev               # Start frontend development server
cd frontend && bun test              # Run frontend tests
cd frontend && bun test:ui           # Run frontend tests with UI
```

### Production
```bash
# Docker Production
docker-compose -f docker-compose.prod.yml up                   # Start all services for production
docker-compose -f docker-compose.prod.yml up -d                # Start services in detached mode
docker-compose -f docker-compose.prod.yml down                 # Stop all services
docker-compose -f docker-compose.prod.yml logs -f backend      # View backend logs
docker-compose -f docker-compose.prod.yml logs -f frontend     # View frontend logs

# Local Production
cd backend && bun build             # Build backend
cd backend && bun start             # Start production server

cd frontend && bun build            # Build frontend for production
cd frontend && bun preview          # Preview production build
```

### Database
```bash
cd backend && bun mikro-orm schema:update  # Update database schema
cd backend && bun mikro-orm migration:create  # Create new migration
cd backend && bun mikro-orm migration:up     # Run migrations
```

### Linting
```bash
cd frontend && bun lint              # Run ESLint on frontend
cd backend && bun lint               # Run ESLint on backend (if configured)
```

## Architecture

This is a modern full-stack TypeScript monorepo with the following structure:

### Backend Stack
- **Hono v4.8.3** - Ultra-fast web framework built on Web Standards
- **tRPC v11.4.3** - End-to-end typesafe APIs with automatic code generation
- **MikroORM v6.4.15** - TypeScript ORM with Data Mapper pattern
- **PostgreSQL** - Robust relational database via Docker
- **Vitest v3.2.4** - Lightning-fast testing framework

### Frontend Stack
- **Vite v6.3.1** - Next-generation build tool with HMR
- **React v19.0.0** - Modern React with concurrent features
- **Tailwind CSS v4** - Utility-first CSS framework with new Vite plugin
- **React Query v5** - Powerful data synchronization for React
- **TypeScript v5.7** - Static type checking with latest features

### Key Files

#### Backend
- `backend/src/index.ts` - Hono server with tRPC integration
- `backend/src/trpc/router.ts` - tRPC router with API endpoints
- `backend/src/trpc/context.ts` - tRPC context with database access
- `backend/src/entities/User.ts` - MikroORM entity definitions
- `backend/src/config/mikro-orm.ts` - Database configuration
- `backend/vitest.config.ts` - Backend test configuration

#### Frontend
- `frontend/src/App.tsx` - Main application component with demo
- `frontend/src/main.tsx` - Application entry point with providers
- `frontend/src/lib/trpc.ts` - tRPC client configuration
- `frontend/src/hooks/api.ts` - Custom API hooks
- `frontend/src/components/UserList.tsx` - Example CRUD component
- `frontend/vitest.config.ts` - Frontend test configuration

#### Infrastructure
- `docker-compose.dev.yml` - Development Docker setup
- `docker-compose.prod.yml` - Production Docker setup
- `.env.example` - Environment variables template
- `backend/Dockerfile.dev` - Backend development container
- `backend/Dockerfile.prod` - Backend production container
- `frontend/Dockerfile.dev` - Frontend development container
- `frontend/Dockerfile.prod` - Frontend production container
- `frontend/nginx.conf` - Nginx configuration for production

### TypeScript Configuration
- **Strict mode** enabled for maximum type safety
- **ESNext modules** with modern ES2022 target
- **Decorators** enabled for MikroORM entities
- **Path mapping** for clean imports
- **Monorepo** structure with shared types

### Development Workflow

1. **Start Development**: `docker-compose -f docker-compose.dev.yml up` starts PostgreSQL, backend, and frontend
2. **Database Schema**: Automatically updated on backend start
3. **Type Safety**: Full end-to-end types from database to UI
4. **Hot Reload**: Both frontend and backend reload on changes
5. **Testing**: `bun test` in either frontend or backend directories
6. **API Testing**: Access tRPC endpoints at http://localhost:3001/trpc

### API Endpoints

#### tRPC Routes
- `health` - Health check endpoint
- `hello` - Simple greeting endpoint
- `user.list` - Get all users
- `user.getById` - Get user by ID
- `user.create` - Create new user
- `user.update` - Update existing user
- `user.delete` - Delete user

#### REST Endpoints
- `GET /health` - Direct health check
- `GET /` - API information

### Environment Variables

#### Backend
- `PORT` - Server port (default: 3001)
- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name (default: template_db)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password (default: postgres)
- `NODE_ENV` - Environment (development/production)

#### Frontend
- `VITE_API_URL` - Backend API URL (default: http://localhost:3001)

### Testing Strategy

#### Backend Tests
- **Unit Tests** - tRPC router procedures
- **Integration Tests** - Database operations
- **API Tests** - HTTP endpoints
- **Mocking** - Database operations for isolated testing

#### Frontend Tests
- **Component Tests** - React components with React Testing Library
- **Hook Tests** - Custom hooks and tRPC integration
- **Integration Tests** - Full component workflows
- **Providers** - Testing with React Query and tRPC providers

### Database Schema

#### User Entity
- `id` - Primary key (auto-increment)
- `name` - User's display name
- `email` - Unique email address
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Docker Services

#### PostgreSQL
- **Image**: postgres:16-alpine
- **Port**: 5432
- **Volumes**: Persistent data storage
- **Health Check**: Ensures database is ready

#### Adminer
- **Image**: adminer:latest
- **Port**: 8080
- **Purpose**: Database administration interface
- **Access**: http://localhost:8080

#### Backend
- **Image**: Custom Bun-based image
- **Port**: 3001
- **Volumes**: Source code mounting for hot reload
- **Depends**: PostgreSQL service

#### Frontend
- **Image**: Custom Bun-based image
- **Port**: 5173
- **Volumes**: Source code mounting for hot reload
- **Environment**: API URL configuration

### Notes

- **Package Manager**: Uses Bun for faster installs and runtime
- **Type Safety**: Full end-to-end TypeScript from database to UI
- **Modern Stack**: All dependencies use latest stable versions
- **Hot Reload**: Both frontend and backend support live reloading
- **Database**: PostgreSQL with automatic schema management
- **Testing**: Comprehensive testing setup with Vitest
- **Docker**: Full containerization for consistent development
- **Monorepo**: Shared types and utilities between frontend/backend

### Getting Started

1. **Clone and Setup**: Repository is ready to use
2. **Environment**: Copy `.env.example` to `.env` and configure
3. **Start Services**: `docker-compose -f docker-compose.dev.yml up` launches everything for development
4. **Access**: Frontend at http://localhost:5173, Backend at http://localhost:3001, Adminer at http://localhost:8080
5. **Develop**: Edit files and see changes instantly with hot reload
6. **Test**: Run tests with `bun test` in respective directories

This template provides a production-ready foundation for full-stack TypeScript applications with modern tooling and best practices.