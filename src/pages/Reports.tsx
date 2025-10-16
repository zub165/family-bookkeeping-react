// Reports Page for Family Bookkeeping React App

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Upload as UploadIcon,
  Assessment as ReportIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { FamilyMember, TaxReport } from '../types';
import apiService from '../services/api';

interface ReportsProps {
  familyMembers: FamilyMember[];
}

const Reports: React.FC<ReportsProps> = ({ familyMembers }) => {
  const [taxReport, setTaxReport] = useState<TaxReport | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (format: 'excel' | 'csv') => {
    try {
      setLoading(true);
      const blob = await apiService.exportData(format, selectedYear);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `family_transactions_${selectedYear}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!familyMembers.length) {
      setError('Please add family members first');
      return;
    }

    // For now, use the first family member
    const familyMemberId = familyMembers[0].id;
    
    apiService.importData(file, familyMemberId)
      .then((result) => {
        console.log('Import result:', result);
        // Handle success
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Import failed');
      });
  };

  const generateTaxReport = async () => {
    try {
      setLoading(true);
      const report = await apiService.getTaxReport(selectedYear);
      setTaxReport(report);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate tax report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports & Export
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Export/Import Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Export/Import Data
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value as number)}
                >
                  <MenuItem value={2023}>2023</MenuItem>
                  <MenuItem value={2024}>2024</MenuItem>
                  <MenuItem value={2025}>2025</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('excel')}
                disabled={loading}
                fullWidth
              >
                Export Excel
              </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={() => handleExport('csv')}
                disabled={loading}
                fullWidth
              >
                Export CSV
              </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                disabled={loading}
                fullWidth
              >
                Import Data
                <input
                  type="file"
                  hidden
                  accept=".xlsx,.csv"
                  onChange={handleImport}
                />
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tax Report */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              AI Tax Analysis
            </Typography>
            <Button
              variant="contained"
              startIcon={<ReportIcon />}
              onClick={generateTaxReport}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Tax Report'}
            </Button>
          </Box>

          {taxReport && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" color="primary">
                    Total Deductible: ${taxReport.total_deductible.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" color="secondary">
                    Forms Needed: {taxReport.forms_needed.join(', ')}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Categories
              </Typography>
              <List>
                {Object.entries(taxReport.categories).map(([category, data]) => (
                  <ListItem key={category}>
                    <ListItemText
                      primary={category}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Total: ${data.total.toFixed(2)} ({data.count} transactions)
                          </Typography>
                          {data.deductible > 0 && (
                            <Chip
                              label={`$${data.deductible.toFixed(2)} deductible`}
                              size="small"
                              color="success"
                              sx={{ mt: 1 }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                AI Recommendations
              </Typography>
              <List>
                {taxReport.recommendations.map((recommendation, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={recommendation} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports;
