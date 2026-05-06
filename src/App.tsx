// Main App Component for Family Bookkeeping React App

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { User, FamilyMember } from './types';
import apiService from './services/api';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Hours from './pages/Hours';
import Miles from './pages/Miles';
import Reports from './pages/Reports';
import FamilyMembers from './pages/FamilyMembers';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const GUEST_USER: User = {
  id: -1,
  username: 'guest',
  email: 'guest@local',
  first_name: 'Guest',
  last_name: 'User',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const AppShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/family')) setCurrentTab('family');
    else if (path.startsWith('/expenses')) setCurrentTab('expenses');
    else if (path.startsWith('/hours')) setCurrentTab('hours');
    else if (path.startsWith('/miles')) setCurrentTab('miles');
    else if (path.startsWith('/reports')) setCurrentTab('reports');
    else setCurrentTab('dashboard');
  }, [location.pathname]);

  const checkAuth = async () => {
    try {
      if (apiService.isAuthenticated()) {
        const currentUser = apiService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await loadFamilyMembers();
        } else {
          setUser(GUEST_USER);
        }
      } else {
        setUser(GUEST_USER);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(GUEST_USER);
    } finally {
      setLoading(false);
    }
  };

  const loadFamilyMembers = async () => {
    try {
      const members = await apiService.getFamilyMembers();
      setFamilyMembers(members);
    } catch (error) {
      console.error('Failed to load family members:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setUser(GUEST_USER);
      setFamilyMembers([]);
      setCurrentTab('dashboard');
      if (location.pathname !== '/dashboard') {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout
      user={user}
      onLogout={handleLogout}
      currentTab={currentTab}
      onTabChange={handleTabChange}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard familyMembers={familyMembers} onTabChange={handleTabChange} />} />
        <Route path="/family" element={<FamilyMembers familyMembers={familyMembers} onUpdate={loadFamilyMembers} />} />
        <Route path="/expenses" element={<Expenses familyMembers={familyMembers} />} />
        <Route path="/hours" element={<Hours familyMembers={familyMembers} />} />
        <Route path="/miles" element={<Miles familyMembers={familyMembers} />} />
        <Route path="/reports" element={<Reports familyMembers={familyMembers} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MainLayout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppShell />
      </Router>
    </ThemeProvider>
  );
};

export default App;