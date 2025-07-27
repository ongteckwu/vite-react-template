# CLAUDE Troubleshooting Guide

## Common Development Issues

### Database Connection Problems

**Issue**: `Failed to initialize MikroORM` or connection errors
**Solutions**:
1. Ensure PostgreSQL is running: `docker-compose -f docker-compose.dev.yml up postgres`
2. Check environment variables in `.env` file
3. Verify database credentials match docker-compose settings
4. Wait for health check: postgres container needs ~10s to be ready

**Issue**: Schema update failures
**Solutions**:
1. Check entity definitions for syntax errors
2. Ensure all entities are registered in `mikro-orm.ts:8`
3. Drop and recreate database if schema is corrupted

### Frontend Build Issues

**Issue**: Vite build fails with TypeScript errors
**Solutions**:
1. Run `npm run lint` to identify ESLint issues
2. Check `tsconfig.json` for proper path mappings
3. Ensure all imports use correct file extensions
4. Verify React 19 compatibility with packages

**Issue**: tRPC type errors or hook failures
**Solutions**:
1. Restart TypeScript server in IDE
2. Check that backend router types are exported correctly
3. Ensure tRPC client is properly configured in `lib/trpc.ts`
4. Verify API URL matches backend port (3001)

### Docker Container Issues

**Issue**: Container won't start or build fails
**Solutions**:
1. Check Dockerfile syntax and layer ordering
2. Ensure all required files are copied before RUN commands
3. Verify node_modules volume mounting in docker-compose
4. Clear Docker cache: `docker system prune -a`

**Issue**: Hot reload not working
**Solutions**:
1. Ensure volume mounts are correctly configured
2. Check file watchers aren't disabled
3. Verify host filesystem permissions
4. Restart containers: `docker-compose down && docker-compose up`

## Environment Setup

### Required Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=template_db

# Server
PORT=3001
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3001
```

### Port Conflicts
- **Frontend**: 5173 (Vite dev server)
- **Backend**: 3001 (Hono server)
- **Database**: 5432 (PostgreSQL)
- **Adminer**: 8080 (Database admin)

Change ports in docker-compose.dev.yml if conflicts occur.

## Performance Issues

### Slow Database Queries
**Solutions**:
1. Add database indexes for frequently queried fields
2. Use `em.find()` with specific field selection
3. Implement pagination for large datasets
4. Enable query logging: set `debug: true` in mikro-orm config

### Bundle Size Optimization
**Solutions**:
1. Use dynamic imports for large components
2. Analyze bundle with `npm run build` and check dist/ folder
3. Remove unused dependencies
4. Enable tree shaking in Vite config

## Testing Issues

### Vitest Setup Problems
**Solutions**:
1. Ensure jsdom is installed: `@testing-library/jest-dom`
2. Check test setup file is properly imported
3. Verify TypeScript paths work in test environment
4. Mock external dependencies that don't work in test environment

### Test Database Issues
**Solutions**:
1. Use separate test database configuration
2. Reset database state between tests
3. Mock MikroORM calls for unit tests
4. Use Docker for integration test database

## Production Deployment

### Build Failures
**Solutions**:
1. Run `npm run build` locally first
2. Check production Dockerfile stages
3. Ensure all environment variables are set
4. Verify production database connection

### Memory Issues
**Solutions**:
1. Increase Docker container memory limits
2. Use NODE_OPTIONS="--max-old-space-size=4096" for large builds
3. Optimize entity loading patterns
4. Implement connection pooling for database