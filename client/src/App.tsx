import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoginPage } from './pages/Login/LoginPage';
import { RegisterPage } from './pages/Register/RegisterPage';
import { HomePage } from './pages/Home/HomePage';
import { AddEventPage } from './pages/AddEvent/AddEventPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { SharePage } from './pages/Share/SharePage';
import { AdminPage } from './pages/Admin/AdminPage';

const AppRoutes = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={token ? <Navigate to="/home" replace /> : <LoginPage />} />
      <Route path="/register" element={token ? <Navigate to="/home" replace /> : <RegisterPage />} />
      <Route path="/home" element={!token ? <Navigate to="/login" replace /> : <HomePage />} />
      <Route path="/add" element={!token ? <Navigate to="/login" replace /> : <AddEventPage />} />
      <Route path="/edit/:id" element={!token ? <Navigate to="/login" replace /> : <AddEventPage />} />
      <Route path="/profile" element={!token ? <Navigate to="/login" replace /> : <ProfilePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/share/:token" element={<SharePage />} />
      <Route path="*" element={<Navigate to={token ? "/home" : "/login"} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="bg-animation">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <div className="orb orb-4" />
          </div>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
