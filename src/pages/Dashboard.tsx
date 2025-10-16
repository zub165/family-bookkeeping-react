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
} from '@mui/material';
import {
  AccountBalance as MoneyIcon,
  DirectionsCar as CarIcon,
  Schedule as TimeIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { Statistics, FamilyMember, Expense, Mile, Hour } from '../../types';
import apiService from '../../services/api';

interface DashboardProps {
  familyMembers: FamilyMember[];
  onTabChange: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ familyMembers, onTabChange }) => {
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

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
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

      {/* Family Members */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Family Members ({familyMembers.length})
            </Typography>
            <List>
              {familyMembers.map((member) => (
                <ListItem key={member.id}>
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
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentExpenses.map((expense) => (
                <ListItem key={expense.id}>
                  <ListItemText
                    primary={`Expense: ${expense.description}`}
                    secondary={`$${expense.amount} - ${new Date(expense.created_at).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
              {recentMiles.map((mile) => (
                <ListItem key={mile.id}>
                  <ListItemText
                    primary={`Mile: ${mile.description}`}
                    secondary={`${mile.miles} miles - ${new Date(mile.created_at).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
              {recentHours.map((hour) => (
                <ListItem key={hour.id}>
                  <ListItemText
                    primary={`Hour: ${hour.description}`}
                    secondary={`${hour.hours} hours - ${new Date(hour.created_at).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
