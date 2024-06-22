import * as React from 'react';
import PresetHeader from '../../../layout/MainLayout/Header/presetHeader/index';
import { Box } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import HeaderTable from './Components/table';

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
                    <HeaderTable />
                </Box>
        </>
    );
};
export default Index;
