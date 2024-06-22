import * as React from 'react';
import { Box } from '@mui/system';
import FooterTable from './Components/table';
import PresetHeader from 'layout/MainLayout/Header/presetHeader';

const Index = () => {
    return (
        <>
        <PresetHeader/>
            <Box
                sx={{
                    width: '100%',
                    mt: 0,
                    backgroundColor: '#fff'
                }}
            >
                <FooterTable />
            </Box>
        </>
    );
};
export default Index;
