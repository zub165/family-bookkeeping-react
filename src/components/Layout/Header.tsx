// Header Component for Family Bookkeeping React App

import React from 'react';
import { Typography, IconButton, Box, Menu, MenuItem, Avatar } from '@mui/material';
import {
  AccountBalance as BookIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { User } from '../../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <BookIcon sx={{ mr: 2 }} />
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Family Bookkeeping
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" sx={{ mr: 2 }}>
          {user ? `${user.first_name} ${user.last_name}` : 'Guest'}
        </Typography>
        <IconButton
          size="large"
          aria-label="account menu"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          color="inherit"
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
            {(user?.first_name?.charAt(0) || 'G').toUpperCase()}
          </Avatar>
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            {user ? 'Logout' : 'Clear Session'}
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;
