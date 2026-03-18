import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './utils/ThemeContext';
import { ToastProvider } from './utils/toast';
import Sidebar from './components/common/Sidebar';
import DashboardPage from './pages/DashboardPage';
import DashboardConfigPage from './pages/DashboardConfigPage';
import OrdersPage from './pages/OrdersPage';
import './styles/global.css';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="app-layout">
            {sidebarOpen && <div className="sb-overlay" onClick={() => setSidebarOpen(false)} />}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="main-content">
              <Routes>
                <Route path="/"          element={<DashboardPage       onMenu={() => setSidebarOpen(true)} />} />
                <Route path="/configure" element={<DashboardConfigPage onMenu={() => setSidebarOpen(true)} />} />
                <Route path="/orders"    element={<OrdersPage          onMenu={() => setSidebarOpen(true)} />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}