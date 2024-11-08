import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { LoadingAnimation } from './LoadingAnimation';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = 'Generating your ad...' 
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <Box className="bg-white rounded-lg p-8 flex flex-col items-center">
            <LoadingAnimation size={60} />
            <Typography variant="h6" className="mt-4">
              {message}
            </Typography>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 