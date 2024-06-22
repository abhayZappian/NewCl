import React, { useState } from 'react';
import Box from '@mui/material/Box';
import ListTable from './components/table';
import PageHeader from 'layout/MainLayout/Header/PageHeader';

const Supression = () => {
    return (
        <>
            <PageHeader />
            <Box
                sx={{
                    width: '100%',
                    mt: 2,
                    backgroundColor: '#fff'
                }}
            >
                <ListTable />
            </Box>
        </>
    );
};

export default Supression;
