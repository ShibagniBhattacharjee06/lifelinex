import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { useContext } from 'react';
import AuthContext from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Lifestyle from './pages/Lifestyle';
import Impact from './pages/Impact';
import EmergencyMap from './components/Map/EmergencyMap';
import LanguageSelector from './components/LanguageSelector';
import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const GlobalLanguageSelector = () => {
  const location = useLocation();
  const hideOnPaths = ['/dashboard', '/profile', '/lifestyle', '/impact', '/map'];
  if (hideOnPaths.includes(location.pathname)) return null;
  return <LanguageSelector />;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <React.Suspense fallback={
          <div className="h-screen w-full flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-bold animate-pulse">Loading LifeLineX...</p>
            </div>
          </div>
        }>
          <GlobalLanguageSelector />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute>
                <div className="h-screen w-screen">
                  <EmergencyMap />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/lifestyle" element={
              <ProtectedRoute>
                <Lifestyle />
              </ProtectedRoute>
            } />
            <Route path="/impact" element={
              <ProtectedRoute>
                <Impact />
              </ProtectedRoute>
            } />
          </Routes>
        </React.Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
