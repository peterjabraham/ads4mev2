'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  IconButton
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useFormStore } from '@/stores/formStore';

export const LikedAdsManager: React.FC = () => {
  const { savedAds } = useFormStore();

  return (
    <Box className="mt-8 mb-4">
      <Box className="flex items-center gap-2 mb-6">
        <Typography variant="h6" sx={{ color: '#ffffff' }}>
          Saved Ad Archive ({savedAds.length})
        </Typography>
        <Link href="/saved-ads">
          <IconButton
            size="small"
            sx={{
              color: '#ffffff',
              '&:hover': {
                color: '#4caf50'
              }
            }}
          >
            <SaveIcon sx={{ fontSize: '1.25rem' }} />
          </IconButton>
        </Link>
      </Box>
    </Box>
  );
};

export default LikedAdsManager;