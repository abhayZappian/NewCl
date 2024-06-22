import * as React from 'react';
import { useState } from 'react';
import PresetHeader from '../../../layout/MainLayout/Header/presetHeader/index';
import { Box } from '@mui/system';
import { Button, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SubVerticalTable from './Components/table';
import SubVerticalDrawer from './Components/drawer.js'

const Index = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const openDrawer = () => {
        setIsDrawerOpen(true);
    };

    return (
        <>
            <PresetHeader />
            <Box
                sx={{
                    height: '95vh',
                    width: '100%'
                }}
            >
                <Box
                    sx={{
                        backgroundColor: '#FEFEFE',
                        borderRadius: '5px',
                        boxShadow: '0px 0px 10px #EAEAEE',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <TextField size="small" id="outlined-basic" label="Search" variant="outlined" sx={{ height: '2rem' }} />
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <Button
                            variant="contained"
                            endIcon={<AddIcon />}
                            sx={{ backgroundColor: '#FF831F', textTransform: 'capitalize' }}
                            onClick={openDrawer}
                        >
                            Add
                        </Button>
                        <Box
                            sx={{
                                backgroundColor: '#233784',
                                color: '#ffff',
                                width: '2.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '5px'
                            }}
                        >
                            <IconButton aria-label="delete">
                                <FilterAltOutlinedIcon fontSize="small" sx={{ color: '#ffff' }} />
                            </IconButton>
                        </Box>
                    </Box>

                    <SubVerticalDrawer isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
                </Box>

                <Box
                    sx={{
                        width: '100%',
                        mt: 2,
                        backgroundColor: '#fff'
                    }}
                >
                    <SubVerticalTable />
                </Box>
            </Box>
        </>
    );
};
export default Index;
