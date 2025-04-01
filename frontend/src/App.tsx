import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (credentials: { email: string; password: string }) => {
    // Simulate authentication
    if (credentials.email && credentials.password) {
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify({ email: credentials.email }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-semibold text-gray-900">BulkMessenger</span>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  localStorage.removeItem('user');
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAuthenticated ? <Dashboard /> : <Login onLogin={handleLogin} />}
      </main>
    </div>
  );
}

export default App;