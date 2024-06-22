import React from 'react';
import { Box, Typography } from '@mui/material';

const Index = () => {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="90vh">
            <Typography variant="h1" gutterBottom sx={{ fontFamily: ' Arial, sans-serif' }}>
                UNSUBSCRIBED
            </Typography>
            <Typography variant="h3" sx={{ fontFamily: ' Arial, sans-serif' }}>
                {' '}
                You have successfully unsubscribed from our newsletter
            </Typography>
        </Box>
    );
};

export default Index;
