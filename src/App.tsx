// src/App.tsx  ⟶  completely replace with this version
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Snackbar from './components/Snackbar';
import { SnackbarProvider } from './context/SnackbarContextType';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/Loginpage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PrivateRoute from './components/PrivateRouter';
import { FiMenu } from 'react-icons/fi';

/* ────────────────────────────────────────────────────────── */
/*  A tiny mobile header (hidden on ≥md screens)              */
/* ────────────────────────────────────────────────────────── */
function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white shadow">
      <h1 className="text-lg font-bold">Job Tracker</h1>
      <button
        aria-label="Open menu"
        onClick={onMenuClick}
        className="text-2xl text-gray-700 focus:outline-none"
      >
        <FiMenu />
      </button>
    </header>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  All the routes + responsive shell                         */
/* ────────────────────────────────────────────────────────── */
function AppRoutes() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  // mobile-only drawer controller
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="flex flex-col min-h-screen w-full overflow-x-hidden bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: "url('/src/assets/background.png')" }}
    >
      {/* Sidebar
           - always visible on md+
           - slide-in drawer on mobile */}
      {!isAuthPage && (
        <>
          {/* overlay – only mobile & only when drawer is open */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 md:hidden z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <Sidebar
            isOpen={sidebarOpen}                 // let Sidebar control its translate-x
            onClose={() => setSidebarOpen(false)}
          />
        </>
      )}

      {/* Main column ------------------------------------------------ */}
      <div className="flex-1 flex flex-col">
        {/* mobile top-bar */}
        {!isAuthPage && (
          <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
        )}

        {/* main routed content */}
        <main className="flex-1 md:ml-60 p-4 md:p-8"> {/* md:ml-60 keeps content off the fixed sidebar */}
          <Routes>
            {/*  🔓 Public  */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/*  🔒 Private  */}
            <Route path="/"            element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/dashboard"   element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/applications"element={<PrivateRoute><ApplicationsPage /></PrivateRoute>} />
            <Route path="/profile"     element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <Router>
      <SnackbarProvider>
        <AppRoutes />
        <Snackbar />
      </SnackbarProvider>
    </Router>
  );
}
