import { Box, Button, Container, Typography } from '@mui/material';
import React from 'react';
import Cards from './Cards';
import { useNavigate } from 'react-router-dom';

export const CampaignJourneyList = () => {
    const navigate = useNavigate();
    const navigateToReactFlow = () => {
        // 👇️ navigate to /contacts
        navigate('/react-email-flow');
    };
    return (
        <React.Fragment>
            <Box
                sx={{
                    bgcolor: '#F2F4F8',
                    width: '100%',
                    height: '647px',
                    marginTop: '-4px'
                }}
            >
                <Container fixed sx={{ bgcolor: '#F2F4F8', height: '100%', maxHeight: '500px' }}>
                    <Box
                        sx={{
                            height: '88px',
                            width: '100%',
                            bgcolor: '#F2F4F8',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <Typography
                            sx={{
                                color: '#000',
                                width: '100%',
                                leadingTrim: 'both',
                                textEdge: 'cap',
                                fontFamily: 'Inter',
                                fontSize: '24px',
                                fontStyle: 'normal',
                                fontWeight: 600,
                                lineHeight: 'normal',
                                letterSpacing: '-0.48px'
                            }}
                        >
                            Campaign Journey
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={navigateToReactFlow}
                            sx={{
                                display: 'flex',
                                height: '40px',
                                width: '110px',
                                padding: '0px 10px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px',
                                border: '1px solid #06207C',
                                borderRadius: '8px',
                                marginRight: '55px',
                                marginLeft: '-34px',
                                color: '#06207C',
                                fontSize: '15px',
                                fontStyle: 'normal',
                                fontWeight: 550,
                                lineHeight: 'normal'
                            }}
                        >
                            Create new
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            height: '500px',
                            width: '1097px',
                            bgcolor: '#F2F4F8',
                            marginTop: '50px',
                            overflow: 'scroll'
                        }}
                    >
                        <Cards />
                    </Box>
                </Container>
            </Box>
        </React.Fragment>
    );
};
