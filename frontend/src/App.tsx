import './index.css'
import { useHealth } from './hooks/api'
import { UserList } from './components/UserList'

function App() {
  const { data: health, isLoading: healthLoading } = useHealth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Vite + React + Hono + tRPC
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Full-stack TypeScript template with PostgreSQL
          </p>
          
          {/* API Status */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow px-6 py-3 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                healthLoading ? 'bg-yellow-500' : 
                health?.status === 'ok' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm font-medium">
                API Status: {healthLoading ? 'Checking...' : health?.status || 'Error'}
              </span>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <UserList />

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">
              🚀 Backend Stack
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Hono v4.8.3</li>
              <li>• tRPC v11.4.3</li>
              <li>• MikroORM v6.4.15</li>
              <li>• PostgreSQL</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">
              💻 Frontend Stack
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Vite v6.3.1</li>
              <li>• React v19.0.0</li>
              <li>• Tailwind CSS v4</li>
              <li>• React Query v5</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">
              🧪 Testing & Tools
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Vitest v3.2.4</li>
              <li>• TypeScript v5.7</li>
              <li>• Docker Compose</li>
              <li>• Hot Reload</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App