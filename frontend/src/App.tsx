import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Hello World
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to your clean Vite + React + Tailwind CSS v4 template
        </p>
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">
              🚀 Ready to Build
            </h2>
            <p className="text-gray-600 text-sm">
              Start editing this component in <code className="bg-gray-100 px-2 py-1 rounded">src/App.tsx</code>
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
