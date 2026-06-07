import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { LogOut, Calendar, CheckSquare, User, Menu, X, Award } from 'lucide-react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import UploadExcel from './pages/UploadExcel';
import ViewQR from './pages/ViewQR';
import LiveDashboard from './pages/LiveDashboard';
import StudentForm from './pages/StudentForm';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    if (token && name && email) {
      setUser({ token, name, email });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setUser(null);
    setMobileMenuOpen(false);
  };

  // Hide header for student attendance form
  const isStudentPage = location.pathname.startsWith('/attend/');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {!isStudentPage && (
        <header className="glass sticky top-0 z-40 border-b border-slate-200/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo */}
              <Link to={user ? "/dashboard" : "/login"} className="flex items-center space-x-2.5 group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform duration-200">
                  <CheckSquare className="h-5.5 w-5.5" />
                </div>
                <span className="font-extrabold text-xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  SmartQR <span className="font-medium text-emerald-600">Attendance</span>
                </span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex space-x-6 items-center">
                {user ? (
                  <>
                    <Link to="/dashboard" className="text-slate-600 hover:text-emerald-600 font-semibold text-sm transition-colors duration-200">
                      Dashboard
                    </Link>
                    <Link to="/events/new" className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 shadow-sm hover:shadow transition-all duration-200 flex items-center space-x-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>Create Event</span>
                    </Link>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div className="flex items-center space-x-2 text-slate-700">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <User className="h-4 w-4 text-slate-600" />
                      </div>
                      <span className="text-sm font-semibold max-w-[120px] truncate">{user.name}</span>
                    </div>
                    <button onClick={handleLogout} className="text-slate-500 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors duration-200" title="Logout">
                      <LogOut className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-slate-600 hover:text-emerald-600 font-semibold text-sm transition-colors duration-200">
                      Login
                    </Link>
                    <Link to="/register" className="bg-slate-900 text-white px-4.5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all duration-200 shadow-sm">
                      Register
                    </Link>
                  </>
                )}
              </nav>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg">
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Dropdown Nav */}
          {mobileMenuOpen && (
            <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur px-4 pt-2 pb-4 space-y-2.5">
              {user ? (
                <>
                  <div className="flex items-center space-x-2.5 px-3 py-2 border-b border-slate-100">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm">
                    Dashboard
                  </Link>
                  <Link to="/events/new" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg bg-emerald-600 text-white font-medium text-sm text-center">
                    Create Event
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 font-medium text-sm">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block text-center px-3 py-2 rounded-lg bg-slate-900 text-white font-medium text-sm">
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </header>
      )}

      {/* Main Body */}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={(userData) => setUser(userData)} />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/events/new" element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          } />
          <Route path="/events/:id/upload" element={
            <ProtectedRoute>
              <UploadExcel />
            </ProtectedRoute>
          } />
          <Route path="/events/:id/qr/:token" element={
            <ProtectedRoute>
              <ViewQR />
            </ProtectedRoute>
          } />
          <Route path="/events/:id/live" element={
            <ProtectedRoute>
              <LiveDashboard />
            </ProtectedRoute>
          } />

          <Route path="/attend/:token" element={<StudentForm />} />
          
          {/* Default Redirection */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </main>

      {!isStudentPage && (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-center text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p>&copy; {new Date().getFullYear()} SmartQR Attendance System. All rights reserved.</p>
            <p className="flex items-center space-x-1">
              <span>Made for Colleges & Seminars</span>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
