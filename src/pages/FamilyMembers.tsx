// Family Members Page for Family Bookkeeping React App

import React, { useState } from 'react';
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
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { FamilyMember } from '../types';
import apiService from '../services/api';

interface FamilyMembersProps {
  familyMembers: FamilyMember[];
  onUpdate: () => void;
}

const FamilyMembers: React.FC<FamilyMembersProps> = ({ familyMembers, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const relations = [
    'Self',
    'Spouse',
    'Child',
    'Parent',
    'Sibling',
    'Other',
  ];

  const handleOpen = (member?: FamilyMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        relation: member.relation,
        email: member.email || '',
      });
    } else {
      setEditingMember(null);
      setFormData({ name: '', relation: '', email: '' });
    }
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMember(null);
    setFormData({ name: '', relation: '', email: '' });
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.relation) {
      setError('Name and relation are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editingMember) {
        await apiService.updateFamilyMember(editingMember.id, formData);
      } else {
        await apiService.createFamilyMember(formData);
      }
      onUpdate();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save family member');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this family member?')) {
      try {
        await apiService.deleteFamilyMember(id);
        onUpdate();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete family member');
      }
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Family Members
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Family Member
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <List>
        {familyMembers.map((member) => (
          <ListItem key={member.id} divider>
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
                  {member.email && (
                    <Chip
                      icon={<EmailIcon />}
                      label={member.email}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleOpen(member)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => handleDelete(member.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMember ? 'Edit Family Member' : 'Add Family Member'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Relation</InputLabel>
            <Select
              name="relation"
              value={formData.relation}
              onChange={handleChange}
              disabled={loading}
            >
              {relations.map((relation) => (
                <MenuItem key={relation} value={relation}>
                  {relation}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Email (Optional)"
            name="email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
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

export default FamilyMembers;
