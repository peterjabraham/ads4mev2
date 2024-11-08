import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

interface LoadingAnimationProps {
  size?: number;
  color?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  size = 40, 
  color = '#1976d2' 
}) => {
  return (
    <Box 
      className="flex justify-center items-center"
      style={{ width: size, height: size }}
    >
      <motion.div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: `3px solid ${color}`,
          borderTopColor: 'transparent',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </Box>
  );
}; 