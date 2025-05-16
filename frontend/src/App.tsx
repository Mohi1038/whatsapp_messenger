import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EditCampaignForm from './components/EditCampaignForm';

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
    <div className="min-h-screen bg-gradient-to-br from-whatsapp-dark via-whatsapp-secondary to-whatsapp-primary">
      <nav className="bg-whatsapp-dark shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-white" />
              <span className="text-xl font-semibold text-white">BulkMessenger</span>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  localStorage.removeItem('user');
                }}
                className="text-sm text-white hover:text-whatsapp-light transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {!isAuthenticated ? (
            <Route path="*" element={<Login onLogin={handleLogin} />} />
            ) : (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/navigate" element={<EditCampaignForm />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;