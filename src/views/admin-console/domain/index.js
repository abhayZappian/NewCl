import * as React from 'react';
import DomainHeader from '../../../layout/MainLayout/Header/domainHeader/index';
import { Box } from '@mui/system';
import DomainTable from './components/table';

const Index = () => {
    return (
        <>
            <DomainHeader />
            <Box
                sx={{
                    width: '100%',
                    mt: 2,
                    backgroundColor: '#fff'
                }}
            >
                <DomainTable />
            </Box>
        </>
    );
};
export default Index;
