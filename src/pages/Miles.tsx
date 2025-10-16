// Miles Page for Family Bookkeeping React App

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
import { FamilyMember, Mile } from '../types';
import apiService from '../services/api';

interface MilesProps {
  familyMembers: FamilyMember[];
}

const Miles: React.FC<MilesProps> = ({ familyMembers }) => {
  const [miles, setMiles] = useState<Mile[]>([]);
  const [open, setOpen] = useState(false);
  const [editingMile, setEditingMile] = useState<Mile | null>(null);
  const [formData, setFormData] = useState({
    family_member: '',
    description: '',
    miles: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMiles();
  }, []);

  const loadMiles = async () => {
    try {
      const data = await apiService.getMiles();
      setMiles(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load miles');
    }
  };

  const handleOpen = (mile?: Mile) => {
    if (mile) {
      setEditingMile(mile);
      setFormData({
        family_member: mile.family_member.toString(),
        description: mile.description,
        miles: mile.miles.toString(),
      });
    } else {
      setEditingMile(null);
      setFormData({ family_member: '', description: '', miles: '' });
    }
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMile(null);
    setFormData({ family_member: '', description: '', miles: '' });
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.family_member || !formData.description || !formData.miles) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mileData = {
        family_member: parseInt(formData.family_member),
        description: formData.description,
        miles: parseFloat(formData.miles),
      };

      if (editingMile) {
        // Update logic would go here
        console.log('Update mile:', mileData);
      } else {
        await apiService.createMile(mileData);
      }
      
      loadMiles();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save mile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Miles
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Miles
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <List>
        {miles.map((mile) => {
          const member = familyMembers.find(m => m.id === mile.family_member);
          return (
            <ListItem key={mile.id} divider>
              <ListItemText
                primary={mile.description}
                secondary={
                  <Box>
                    <Chip label={member?.name || 'Unknown'} size="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {mile.miles} miles - {new Date(mile.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleOpen(mile)}
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
          {editingMile ? 'Edit Miles' : 'Add Miles'}
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
            label="Miles"
            name="miles"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.miles}
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

export default Miles;
