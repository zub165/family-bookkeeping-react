// Main App Component for Family Bookkeeping React App

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { User, FamilyMember } from './types';
import apiService from './services/api';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (apiService.isAuthenticated()) {
        const currentUser = apiService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await loadFamilyMembers();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
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
      setUser(null);
      setFamilyMembers([]);
      setCurrentTab('dashboard');
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

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <MainLayout
          user={user}
          onLogout={handleLogout}
          currentTab={currentTab}
          onTabChange={handleTabChange}
        >
          <Routes>
            <Route path="/dashboard" element={<Dashboard familyMembers={familyMembers} onTabChange={handleTabChange} />} />
            <Route path="/family" element={<FamilyMembers familyMembers={familyMembers} onUpdate={loadFamilyMembers} />} />
            <Route path="/expenses" element={<Expenses familyMembers={familyMembers} />} />
            <Route path="/hours" element={<Hours familyMembers={familyMembers} />} />
            <Route path="/miles" element={<Miles familyMembers={familyMembers} />} />
            <Route path="/reports" element={<Reports familyMembers={familyMembers} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App;