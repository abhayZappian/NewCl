import React from 'react';
import { Typography, Box, Container } from '@mui/material';

const SamplePage = () => {
    return (
        <Container sx={{ mt: 4 }}>
            <Box>
                <Typography>Hi John Dow,</Typography>
                <Typography
                    sx={{
                        color: '#2A4BC0',
                        fontSize: '32px',
                        fontWeight: '600'
                    }}
                >
                    Welcome to Credmudra Analytics
                </Typography>
            </Box>
        </Container>
    );
};

export default SamplePage;
