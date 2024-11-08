'use client';

import { Box, Button, Typography } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <Box 
      className="min-h-screen flex flex-col items-center"
      sx={{ 
        padding: '60px',
        backgroundColor: '#000000',
        height: '100vh',
        width: '100%',
      }}
    >
      <Box className="text-center max-w-[600px] flex flex-col items-center mt-[100px]">
        <Typography variant="h5" className="mb-[32px]" sx={{ color: '#ffffff', textAlign: 'center' }}>
          Welcome to 
          <br />
          The Headline Lab
          <br />
        </Typography>

        <Typography variant="body1" className="mb-[36px] px-4" sx={{ color: '#ffffff', textAlign: 'center' }}>
          Generate high-converting ad copy using AI. 
          <br />
          Perfect for marketers, business owners, and advertising professionals.
          <Box className="mt-8 mb-32" sx={{ color: '#ffffff', textAlign: 'center' }}>
            ✓ Generate multiple ad variations
            <br />
            ✓ Save your favorite headlines
            <br />
            ✓ Learn from high-performing ads
            <br />
            ✓ Export selected headlines
          </Box>
        </Typography>
      </Box>

      <Box sx={{ 
        position: 'absolute',
        left: '50%',
        top: '300px',
        transform: 'translateX(-50%)'
      }}>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={signInWithGoogle}
          sx={{ 
            textTransform: 'none',
            height: '48px',
            width: 'auto',
            padding: '0 32px',
            backgroundColor: '#1a73e8',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#1557b0',
            }
          }}
        >
          Sign in with Google
        </Button>
      </Box>
    </Box>
  );
} 
