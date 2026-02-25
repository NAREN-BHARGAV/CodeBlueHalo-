import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Dashboard } from '@/pages/Dashboard';
import { About } from '@/pages/About';
import { Sensors } from '@/pages/Sensors';
import { Alerts } from '@/pages/Alerts';
import { Settings } from '@/pages/Settings';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Analysis } from '@/pages/Analysis';
import { PersonLogs } from '@/pages/PersonLogs';
import { Toaster } from 'sonner';

import { Profile } from '@/pages/Profile';

// Helper component to hide sidebar/navbar on specific routes
function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideLayout = ['/', '/login'].includes(location.pathname);

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px] pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/person-logs" element={<PersonLogs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/sensors" element={<Sensors />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
      <Toaster position="bottom-right" theme="dark" />
    </Router>
  );
}

export default App;
