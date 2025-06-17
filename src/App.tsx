// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';

import Sidebar        from './components/Sidebar';
import PrivateRoute   from './components/PrivateRouter';
import Snackbar       from './components/Snackbar';
import { SnackbarProvider } from './context/SnackbarContextType';

import LandingPage      from './pages/LandingPage';
import DashboardPage    from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ProfilePage      from './pages/ProfilePage';

function MobileHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-900 text-white shadow z-20">
      <h1 className="font-bold text-lg">Job&nbsp;Tracker</h1>
      <button onClick={onMenu} aria-label="Open menu" className="text-2xl text-gray-600">
        <FiMenu />
      </button>
    </header>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div
  className={`relative min-h-screen w-full overflow-x-hidden ${
    isLanding ? '' : 'bg-cover bg-no-repeat bg-center'
  }`}
  style={!isLanding ? { backgroundImage: "url('/background.png')" } : {}}
>

      {!isLanding && (
        <>
          {drawerOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-30 md:hidden"
              onClick={() => setDrawerOpen(false)}
            />
          )}
          <Sidebar isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
      )}

      <div className="flex flex-col min-h-screen">
        {!isLanding && <MobileHeader onMenu={() => setDrawerOpen(true)} />}

        <main className={`flex-1 overflow-x-hidden ${!isLanding ? 'md:ml-60 p-4 md:p-8' : ''}`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/applications" element={<PrivateRoute><ApplicationsPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}


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
