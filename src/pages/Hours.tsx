// Hours Page for Family Bookkeeping React App

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
import { FamilyMember, Hour } from '../types';
import apiService from '../services/api';

interface HoursProps {
  familyMembers: FamilyMember[];
}

const Hours: React.FC<HoursProps> = ({ familyMembers }) => {
  const [hours, setHours] = useState<Hour[]>([]);
  const [open, setOpen] = useState(false);
  const [editingHour, setEditingHour] = useState<Hour | null>(null);
  const [formData, setFormData] = useState({
    family_member: '',
    description: '',
    hours: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHours();
  }, []);

  const loadHours = async () => {
    try {
      const data = await apiService.getHours();
      setHours(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load hours');
    }
  };

  const handleOpen = (hour?: Hour) => {
    if (hour) {
      setEditingHour(hour);
      setFormData({
        family_member: hour.family_member.toString(),
        description: hour.description,
        hours: hour.hours.toString(),
      });
    } else {
      setEditingHour(null);
      setFormData({ family_member: '', description: '', hours: '' });
    }
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingHour(null);
    setFormData({ family_member: '', description: '', hours: '' });
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.family_member || !formData.description || !formData.hours) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const hourData = {
        family_member: parseInt(formData.family_member),
        description: formData.description,
        hours: parseFloat(formData.hours),
      };

      if (editingHour) {
        // Update logic would go here
        console.log('Update hour:', hourData);
      } else {
        await apiService.createHour(hourData);
      }
      
      loadHours();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save hour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Hours
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Hours
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <List>
        {hours.map((hour) => {
          const member = familyMembers.find(m => m.id === hour.family_member);
          return (
            <ListItem key={hour.id} divider>
              <ListItemText
                primary={hour.description}
                secondary={
                  <Box>
                    <Chip label={member?.name || 'Unknown'} size="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {hour.hours} hours - {new Date(hour.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleOpen(hour)}
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
          {editingHour ? 'Edit Hours' : 'Add Hours'}
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
            label="Hours"
            name="hours"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.hours}
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

export default Hours;
