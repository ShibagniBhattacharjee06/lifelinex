import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EmergencyMap from './components/Map/EmergencyMap';
import LanguageSelector from './components/LanguageSelector';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <LanguageSelector />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/map" element={
          <ProtectedRoute>
            <div className="h-screen w-screen">
              <EmergencyMap />
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
