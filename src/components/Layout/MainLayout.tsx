// Main Layout Component for Family Bookkeeping React App

import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, IconButton } from '@mui/material';
import {
  Menu as MenuIcon,
} from '@mui/icons-material';
import Header from './Header';
import Sidebar from './Sidebar';
import { User } from '../../types';

interface MainLayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  user,
  onLogout,
  currentTab,
  onTabChange,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - 240px)` },
          ml: { md: '240px' },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Header user={user} onLogout={onLogout} />
        </Toolbar>
      </AppBar>
      
      <Sidebar
        open={mobileOpen}
        onClose={handleDrawerClose}
        currentTab={currentTab}
        onTabChange={onTabChange}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 240px)` },
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
