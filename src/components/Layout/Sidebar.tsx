// Sidebar Component for Family Bookkeeping React App

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  DirectionsCar as CarIcon,
  Assessment as ReportIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'family', label: 'Family Members', icon: <PeopleIcon /> },
  { id: 'expenses', label: 'Expenses', icon: <ReceiptIcon /> },
  { id: 'hours', label: 'Hours', icon: <ScheduleIcon /> },
  { id: 'miles', label: 'Miles', icon: <CarIcon /> },
  { id: 'reports', label: 'Reports', icon: <ReportIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, currentTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPathForTab = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return '/dashboard';
      case 'family':
        return '/family';
      case 'expenses':
        return '/expenses';
      case 'hours':
        return '/hours';
      case 'miles':
        return '/miles';
      case 'reports':
        return '/reports';
      default:
        return '/dashboard';
    }
  };

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    const target = getPathForTab(tab);
    if (location.pathname !== target) {
      navigate(target);
    }
    onClose();
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Family Bookkeeping
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={currentTab === item.id}
              onClick={() => handleTabChange(item.id)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: currentTab === item.id ? 'white' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
