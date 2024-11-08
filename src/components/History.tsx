'use client';

import React from 'react';
import { 
  Box, 
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useHistoryStore, ToneType } from '@/stores/historyStore';
import { exportToPDF, exportToCSV, exportToText } from '@/utils/export';

export const History: React.FC = () => {
  const selectedIds = new Set<string>();
  const { 
    ads, 
    clearHistory,
    searchTerm,
    setSearchTerm,
    selectedTone,
    setSelectedTone,
  } = useHistoryStore();

  const handleExport = (format: 'pdf' | 'csv' | 'txt') => {
    const selectedAds = ads.filter(ad => selectedIds.has(ad.id));
    switch (format) {
      case 'pdf':
        exportToPDF(selectedAds);
        break;
      case 'csv':
        exportToCSV(selectedAds);
        break;
      case 'txt':
        exportToText(selectedAds);
        break;
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} mb={2} alignItems="center">
        <TextField
          size="small"
          placeholder="Search history..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Tone</InputLabel>
          <Select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value as ToneType | 'all')}
            label="Tone"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="excited">Excited</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
            <MenuItem value="authoritative">Authoritative</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {selectedIds.size > 0 && (
        <Stack direction="row" spacing={1} mt={2}>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('pdf')}
            variant="outlined"
          >
            Export PDF
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('csv')}
            variant="outlined"
          >
            Export CSV
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('txt')}
            variant="outlined"
          >
            Export TXT
          </Button>
        </Stack>
      )}

      {ads.length > 0 && (
        <Button
          onClick={() => clearHistory()}
          color="error"
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Clear History
        </Button>
      )}
    </Box>
  );
};

export default History;