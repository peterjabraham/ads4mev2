'use client';

import { useStore } from '@/stores';
import type { SavedAd } from '@/stores';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Tooltip,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';

export default function SavedAdsPage() {
  const { savedAds, removeSavedAd } = useStore((state) => ({
    savedAds: state.savedAds,
    removeSavedAd: state.removeSavedAd,
  }));

  const handleDelete = (id: string) => {
    removeSavedAd(id);
  };

  return (
    <Box className="container mx-auto px-4 py-8">
      <Typography variant="h4" component="h1" className="mb-6 font-bold">
        Saved Ads ({savedAds.length})
      </Typography>

      {savedAds.length === 0 ? (
        <Paper className="p-6 text-center">
          <Typography color="textSecondary">
            No saved ads yet. Generate and save some ads to see them here.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {savedAds.map((ad: SavedAd) => (
            <Grid item xs={12} key={ad.id}>
              <Paper className="p-6">
                <Box className="flex justify-between items-start">
                  <Box className="flex-grow">
                    <Typography variant="h6" className="mb-2">
                      {ad.campaignName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="mb-4">
                      Campaign Date: {ad.campaignDate}
                    </Typography>
                    <Typography variant="subtitle1" className="mb-2 font-bold">
                      Headline:
                    </Typography>
                    <Typography className="mb-4">
                      {ad.headline}
                    </Typography>
                    <Typography variant="subtitle1" className="mb-2 font-bold">
                      Primary Text:
                    </Typography>
                    <Typography>
                      {ad.primaryText}
                    </Typography>
                  </Box>
                  <Box>
                    <Tooltip title="Delete ad">
                      <IconButton
                        onClick={() => handleDelete(ad.id)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography variant="caption" color="textSecondary" className="mt-4 block">
                  Saved on: {format(ad.timestamp, 'MMM dd, yyyy HH:mm')}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}