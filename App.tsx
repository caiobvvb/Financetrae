import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import CreditCards from './pages/CreditCards';
import Reports from './pages/Reports';
import Categories from './pages/Categories';
import Budgets from './pages/Budgets';
import Calendar from './pages/Calendar';
import ProtectedRoute from './components/ProtectedRoute';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Health from './pages/Health';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Simple Theme Toggler for demo purposes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
        {/* Toggle Theme Button Fixed */}
        <button 
            onClick={() => setDarkMode(!darkMode)}
            className="fixed bottom-4 right-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
            title="Toggle Theme"
        >
             <span className="material-icons-outlined text-gray-800 dark:text-white">
                {darkMode ? 'light_mode' : 'dark_mode'}
             </span>
        </button>

      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/health" element={<Health />} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
          <Route path="/credit-cards" element={<ProtectedRoute><CreditCards /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
