import * as React from 'react';
import { Box } from '@mui/system';
import BounceTreatmentTable from './components/table';
import GlobalSettingHeader from 'layout/MainLayout/Header/gobalSettingHeader';

const Index = () => {
    return (
        <>
            <GlobalSettingHeader />
            <Box
                sx={{
                    width: '100%',
                    mt: 2,
                    backgroundColor: '#fff'
                }}
            >
                <BounceTreatmentTable />
            </Box>
        </>
    );
};
export default Index;
