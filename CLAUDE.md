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



## Common Patterns

### File Upload Pattern
```typescript
// Standard file upload with progress tracking
const handleFileUpload = async (file: File) => {
  setLoading(true)
  try {
    // 1. Validate file type and size
    if (!file.name.endsWith('.pdf')) throw new Error('Only PDF files allowed')
    
    // 2. Read file content
    const content = await file.text()
    
    // 3. Process with loading state
    const result = await processFile(content)
    
    // 4. Update global state
    setUploadedFiles(prev => [...prev, result])
    
    // 5. Navigate on success
    navigate('/dashboard')
  } catch (error) {
    console.error('Upload failed:', error)
    // Show user-friendly error
  } finally {
    setLoading(false)
  }
}
```

### Data Conversion Pattern (ComplianceReportConverter)
```typescript
// JSON → Entity conversion for database storage
class ComplianceReportConverter {
  static async fromJSON(json: ComplianceReportJSON, em: EntityManager) {
    // 1. Create main entity
    const report = new ComplianceReport()
    report.companyName = json.document_metadata.company_name
    
    // 2. Create related entities
    const violations = json.violations.map(v => {
      const violation = new Violation()
      violation.uniqueId = v.unique_id
      violation.locations = v.locations // JSONB field
      return violation
    })
    
    // 3. Set relationships
    report.violations.set(violations)
    
    // 4. Persist in transaction
    await em.persistAndFlush(report)
    return report
  }
  
  static toJSON(report: ComplianceReport): ComplianceReportJSON {
    // Reverse conversion for API responses
  }
}
```

### Custom Hook Pattern
```typescript
// Consistent API hook pattern with loading states
export const useComplianceReport = (reportId: string) => {
  const query = trpc.compliance.getById.useQuery(
    { id: reportId },
    {
      enabled: !!reportId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    }
  )
  
  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
```

### Loading State Pattern
```typescript
// Consistent loading/error/empty states
const DataDisplay: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading, error } = useData(id)
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!data) return <EmptyState message="No data available" />
  
  return <DataContent data={data} />
}
```

### Form Handling Pattern
```typescript
// Form with validation and error handling
const ComplianceForm: React.FC = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const mutation = trpc.compliance.create.useMutation({
    onSuccess: (data) => {
      toast.success('Report created successfully')
      navigate(`/report/${data.id}`)
    },
    onError: (error) => {
      if (error.data?.zodError) {
        setErrors(error.data.zodError.fieldErrors)
      } else {
        toast.error('Failed to create report')
      }
    },
  })
  
  const handleSubmit = async (formData: FormData) => {
    setErrors({})
    await mutation.mutate(formData)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields with inline error display */}
    </form>
  )
}
```

### State Management Pattern
```typescript
// Context for complex state with actions
interface AppState {
  uploadedFiles: UploadedFile[]
  complianceReport: ComplianceReport | null
  selectedViolation: string | null
}

interface AppActions {
  setUploadedFiles: (files: UploadedFile[]) => void
  clearReport: () => void
  selectViolation: (id: string) => void
}

const AppContext = createContext<AppState & AppActions>(null!)

// Use with custom hook for type safety
export const useAppState = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppState must be within AppProvider')
  return context
}
```

### Error Boundary Pattern
```typescript
// Catch and display errors gracefully
class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error boundary caught:', error, info)
    // Send to error tracking service
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}
```

### Authentication Pattern (Future Implementation)
```typescript
// Placeholder for future auth implementation
interface AuthContext {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
}

// Protected route pattern
const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}
```

### Service Architecture Pattern
```typescript
// Service interface for clear contracts
interface IComplianceService {
  analyzeDocument(fileKey: string): Promise<ComplianceReportJSON>
  validateViolations(reportId: number): Promise<ValidationResult>
}

// Service implementation with dependency injection
export class ComplianceService implements IComplianceService {
  constructor(
    private em: EntityManager,
    private aiClient: OpenAI,
    private s3Service: S3Service
  ) {}
  
  async analyzeDocument(fileKey: string): Promise<ComplianceReportJSON> {
    // 1. Fetch document from S3
    const document = await this.s3Service.getDocument(fileKey)
    
    // 2. Extract text and structure
    const extracted = await this.extractDocumentData(document)
    
    // 3. Analyze compliance
    const violations = await this.analyzeCompliance(extracted)
    
    // 4. Generate report
    return this.generateReport(extracted, violations)
  }
  
  private async extractDocumentData(document: Buffer): Promise<ExtractedData> {
    // Implementation details
  }
  
  private async analyzeCompliance(data: ExtractedData): Promise<Violation[]> {
    // AI-powered analysis
  }
}

// Usage in tRPC router
const complianceRouter = router({
  analyze: publicProcedure
    .input(z.object({ fileKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = new ComplianceService(ctx.em, aiClient, s3Service)
      return await service.analyzeDocument(input.fileKey)
    })
})
```

