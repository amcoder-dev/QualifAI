import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { LeadsProvider } from './contexts/LeadsContext';

// Components
import { Background } from './components/layout/Background';
import { Login } from './components/auth/Login';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { LeadsList } from './components/leads/LeadsList';
import { LeadDetail } from './components/leads/LeadDetail';
import { AISidekick } from './components/ai-sidekick/AISidekick';
import { Calendar } from './components/calendar/Calendar';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LeadsProvider>
        <Router>
          <Background>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <>
                      <Sidebar />
                      <Dashboard />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leads"
                element={
                  <ProtectedRoute>
                    <>
                      <Sidebar />
                      <LeadsList />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leads/:id"
                element={
                  <ProtectedRoute>
                    <>
                      <Sidebar />
                      <LeadDetail />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <>
                      <Sidebar />
                      <Calendar />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-sidekick"
                element={
                  <ProtectedRoute>
                    <>
                      <Sidebar />
                      <AISidekick />
                    </>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Background>
        </Router>
      </LeadsProvider>
    </AuthProvider>
  );
};

export default App;