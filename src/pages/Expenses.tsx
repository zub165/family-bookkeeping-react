// Expenses Page for Family Bookkeeping React App

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { FamilyMember, Expense } from '../types';
import apiService from '../services/api';

interface ExpensesProps {
  familyMembers: FamilyMember[];
}

const Expenses: React.FC<ExpensesProps> = ({ familyMembers }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [open, setOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    family_member: '',
    description: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await apiService.getExpenses();
      setExpenses(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load expenses');
    }
  };

  const handleOpen = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        family_member: expense.family_member.toString(),
        description: expense.description,
        amount: expense.amount.toString(),
      });
    } else {
      setEditingExpense(null);
      setFormData({ family_member: '', description: '', amount: '' });
    }
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingExpense(null);
    setFormData({ family_member: '', description: '', amount: '' });
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.family_member || !formData.description || !formData.amount) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const expenseData = {
        family_member: parseInt(formData.family_member),
        description: formData.description,
        amount: parseFloat(formData.amount),
      };

      if (editingExpense) {
        // Update logic would go here
        console.log('Update expense:', expenseData);
      } else {
        await apiService.createExpense(expenseData);
      }
      
      loadExpenses();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Expenses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Expense
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <List>
        {expenses.map((expense) => {
          const member = familyMembers.find(m => m.id === expense.family_member);
          return (
            <ListItem key={expense.id} divider>
              <ListItemText
                primary={expense.description}
                secondary={
                  <Box>
                    <Chip label={member?.name || 'Unknown'} size="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      ${expense.amount} - {new Date(expense.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleOpen(expense)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingExpense ? 'Edit Expense' : 'Add Expense'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Family Member</InputLabel>
            <Select
              name="family_member"
              value={formData.family_member}
              onChange={handleChange}
              disabled={loading}
            >
              {familyMembers.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Amount"
            name="amount"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.amount}
            onChange={handleChange}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Expenses;
