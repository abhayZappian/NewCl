import * as React from 'react';
import PresetHeader from '../../../layout/MainLayout/Header/presetHeader/index';
import { Box } from '@mui/system';
import FooterTable from './Components/table';

const Index = () => {
    return (
        <>
            <PresetHeader />
            <Box
                sx={{
                    width: '100%',
                    mt: 2,
                    backgroundColor: '#fff'
                }}
            >
                <FooterTable />
            </Box>
        </>
    );
};
export default Index;
