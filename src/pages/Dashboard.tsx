// Dashboard Page for Family Bookkeeping React App

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from '@mui/material';
import {
  AccountBalance as MoneyIcon,
  DirectionsCar as CarIcon,
  Schedule as TimeIcon,
  TrendingUp as TrendingIcon,
  Add as AddIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Assessment as ReportIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Statistics, FamilyMember, Expense, Mile, Hour } from 'types';
import apiService from 'services/api';

interface DashboardProps {
  familyMembers: FamilyMember[];
  onTabChange: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ familyMembers, onTabChange }) => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [recentMiles, setRecentMiles] = useState<Mile[]>([]);
  const [recentHours, setRecentHours] = useState<Hour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, expenses, miles, hours] = await Promise.all([
        apiService.getStatistics(),
        apiService.getExpenses(),
        apiService.getMiles(),
        apiService.getHours(),
      ]);

      setStatistics(stats);
      setRecentExpenses(expenses.slice(0, 5));
      setRecentMiles(miles.slice(0, 5));
      setRecentHours(hours.slice(0, 5));
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  const statCards = [
    {
      title: 'Total Expenses',
      value: `$${statistics?.total_expenses.toFixed(2) || '0.00'}`,
      icon: <MoneyIcon />,
      color: '#f44336',
    },
    {
      title: 'Total Miles',
      value: `${statistics?.total_miles || 0} miles`,
      icon: <CarIcon />,
      color: '#4caf50',
    },
    {
      title: 'Total Hours',
      value: `${statistics?.total_hours || 0} hours`,
      icon: <TimeIcon />,
      color: '#ff9800',
    },
    {
      title: 'Tax Deductions',
      value: `$${statistics?.total_deductions.toFixed(2) || '0.00'}`,
      icon: <TrendingIcon />,
      color: '#9c27b0',
    },
  ];

  const isGuest = !apiService.isAuthenticated();

  const quickActions: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    path: string;
  }> = [
    {
      id: 'expenses',
      title: 'Add an Expense',
      description: 'Track a purchase or bill.',
      icon: <ReceiptIcon />,
      path: '/expenses',
    },
    {
      id: 'hours',
      title: 'Log Hours',
      description: 'Record work or caregiving time.',
      icon: <TimeIcon />,
      path: '/hours',
    },
    {
      id: 'miles',
      title: 'Log Miles',
      description: 'Capture travel for deductions.',
      icon: <CarIcon />,
      path: '/miles',
    },
    {
      id: 'family',
      title: 'Add Family Member',
      description: 'Create and manage members.',
      icon: <PeopleIcon />,
      path: '/family',
    },
    {
      id: 'reports',
      title: 'Generate Report',
      description: 'Export data or tax report.',
      icon: <ReportIcon />,
      path: '/reports',
    },
  ];

  const goTo = (tab: string, path: string) => {
    onTabChange(tab);
    navigate(path);
  };

  const primaryInsight =
    recentExpenses[0]?.description
      ? `Latest expense: ${recentExpenses[0].description}`
      : recentMiles[0]?.description
        ? `Latest miles: ${recentMiles[0].description}`
        : recentHours[0]?.description
          ? `Latest hours: ${recentHours[0].description}`
          : 'No recent activity yet.';

  return (
    <Box>
      <Box display="flex" alignItems="baseline" justifyContent="space-between" gap={2} flexWrap="wrap">
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {primaryInsight}
          </Typography>
        </Box>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => goTo('expenses', '/expenses')}>
            New Expense
          </Button>
          <Button variant="outlined" startIcon={<ReportIcon />} onClick={() => goTo('reports', '/reports')}>
            Reports
          </Button>
        </Box>
      </Box>

      {isGuest && (
        <Alert severity="info" sx={{ mt: 2 }}>
          You’re in guest mode. Pages and navigation work, but data will stay empty until you connect a backend and authenticate.
        </Alert>
      )}
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      bgcolor: card.color,
                      color: 'white',
                      mr: 2,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h6" component="div">
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" color="primary">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {quickActions.map((action) => (
                <Grid item xs={12} sm={6} key={action.id}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Box sx={{ color: 'primary.main' }}>{action.icon}</Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {action.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {action.description}
                      </Typography>
                      <Button size="small" variant="contained" onClick={() => goTo(action.id, action.path)}>
                        Open
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Family Members */}
        <Grid item xs={12} md={6} lg={3.5}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} mb={1}>
              <Typography variant="h6">
                Family Members ({familyMembers.length})
              </Typography>
              <Button size="small" onClick={() => goTo('family', '/family')}>
                Manage
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List dense>
              {familyMembers.length ? (
                familyMembers.slice(0, 6).map((member) => (
                  <ListItem key={member.id} disableGutters>
                    <ListItemText
                      primary={member.name}
                      secondary={
                        <Box>
                          <Chip
                            label={member.relation}
                            size="small"
                            color={member.is_registered ? 'success' : 'default'}
                            sx={{ mr: 1 }}
                          />
                          {member.is_registered && (
                            <Chip label="Registered" size="small" color="success" />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem disableGutters>
                  <ListItemText
                    primary="No family members yet."
                    secondary="Add members to start tracking expenses, hours, and miles."
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6} lg={3.5}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} mb={1}>
              <Typography variant="h6">Recent Activity</Typography>
              <Button size="small" onClick={() => goTo('dashboard', '/dashboard')}>
                Refresh
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List dense>
              {!recentExpenses.length && !recentMiles.length && !recentHours.length ? (
                <ListItem disableGutters>
                  <ListItemText
                    primary="No activity yet."
                    secondary="Use Quick Actions to create your first entries."
                  />
                </ListItem>
              ) : (
                <>
                  {recentExpenses.map((expense) => (
                    <ListItem key={`expense-${expense.id}`} disableGutters>
                      <ListItemText
                        primary={`Expense: ${expense.description}`}
                        secondary={`$${expense.amount} - ${new Date(expense.created_at).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                  {recentMiles.map((mile) => (
                    <ListItem key={`mile-${mile.id}`} disableGutters>
                      <ListItemText
                        primary={`Miles: ${mile.description}`}
                        secondary={`${mile.miles} miles - ${new Date(mile.created_at).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                  {recentHours.map((hour) => (
                    <ListItem key={`hour-${hour.id}`} disableGutters>
                      <ListItemText
                        primary={`Hours: ${hour.description}`}
                        secondary={`${hour.hours} hours - ${new Date(hour.created_at).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
