import React from 'react';
import { Box } from '@mui/material';

interface TwoColumnLayoutProps {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  leftColumn,
  rightColumn,
}) => {
  return (
    <Box 
      className="w-full"
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        '& > div': {
          minWidth: 0, // Prevent content from breaking the layout
        }
      }}
    >
      <Box>
        {leftColumn}
      </Box>
      <Box>
        {rightColumn}
      </Box>
    </Box>
  );
}; 