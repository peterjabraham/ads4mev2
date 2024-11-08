import React from 'react';
import { Box } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh' 
            }}>
                Loading...
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            backgroundColor: 'background.default'
        }}>
            {children}
        </Box>
    );
};

export default MainLayout;