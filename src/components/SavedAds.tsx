'use client';
import React from 'react';
import { SavedAd } from '@/types';
import { 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Tooltip,
} from '@mui/material';
import { 
  FolderOpen as FileCabinetIcon,
  Delete as DeleteIcon,
  DeleteSweep as DeleteAllIcon,
} from '@mui/icons-material';
import { useFormStore } from '@/stores/formStore';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

export const SavedAds: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const { savedAds, removeSavedAd, clearAllSavedAds, loadUserAds } = useFormStore();
  const { user } = useAuth();

  React.useEffect(() => {
    if (open && user?.uid) {
      loadUserAds(user.uid).catch((error: Error) => {
        console.error('Error loading user ads:', error);
      });
    }
  }, [open, user?.uid, loadUserAds]);

  const handleDeleteAll = (): void => {
    clearAllSavedAds();
    setShowDeleteConfirm(false);
    toast.success('All saved ads have been deleted');
  };

  const handleDeleteAd = async (id: string): Promise<void> => {
    if (!user?.uid) {
      toast.error('Please sign in to delete ads');
      return;
    }

    try {
      await removeSavedAd(id, user.uid);
      toast.success('Ad removed from saved ads');
    } catch (error) {
      console.error('Error removing ad:', error);
      toast.error('Failed to remove ad');
    }
  };

  return (
    <>
      <Tooltip title="Ad Archive - View and manage your saved ad campaigns">
        <IconButton 
          onClick={() => setOpen(true)}
          size="small"
          sx={{ 
            padding: '4px',
            '& svg': { 
              fontSize: '1.25rem',
              color: savedAds.length > 0 ? '#4caf50' : '#9e9e9e'
            }
          }}
        >
          <FileCabinetIcon />
        </IconButton>
      </Tooltip>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        aria-modal="true"
        disablePortal
        PaperProps={{
          sx: {
            backgroundColor: '#000000',
            color: '#ffffff'
          }
        }}
      >
        <DialogTitle sx={{ color: '#ffffff' }}>
          <span>Saved Ads ({savedAds.length})</span>
        </DialogTitle>
        <DialogContent>
          {savedAds.length === 0 ? (
            <Typography color="textSecondary" className="text-center py-4">
              No saved ads yet. Click the save icon to save the current ad set.
            </Typography>
          ) : (
            <>
              <Box className="space-y-[15px]">
                {savedAds.map((ad: SavedAd) => (
                  <Paper 
                    key={ad.id} 
                    className="p-8"
                    sx={{ 
                      marginBottom: '15px',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      '&:not(:last-child)': {
                        marginBottom: '15px'
                      }
                    }}
                  >
                    <Box className="flex justify-between items-start">
                      <Box className="flex-grow">
                        <Typography variant="h6">{ad.headline}</Typography>
                        <Typography variant="body1">{ad.primaryText}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Campaign: {ad.campaignName} | Date: {ad.campaignDate}
                        </Typography>
                      </Box>
                      <IconButton 
                        onClick={() => handleDeleteAd(ad.id)}
                        sx={{ color: '#ff1744' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Box>
              {savedAds.length > 1 && (
                <Button
                  startIcon={<DeleteAllIcon />}
                  onClick={() => setShowDeleteConfirm(true)}
                  sx={{ color: '#ff1744', marginTop: 2 }}
                >
                  Delete All Ads
                </Button>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: '#ffffff' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#000000',
            color: '#ffffff'
          }
        }}
      >
        <DialogTitle>Confirm Delete All</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete all saved ads? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)} sx={{ color: '#ffffff' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteAll} sx={{ color: '#ff1744' }}>
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SavedAds;