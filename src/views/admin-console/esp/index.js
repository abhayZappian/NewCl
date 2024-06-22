import * as React from 'react';
import DomainHeader from '../../../layout/MainLayout/Header/domainHeader/index';
import { Box } from '@mui/system';
import EspTable from './components/table';

const Index = () => {
    return (
      <>
        <DomainHeader />
        <Box
          sx={{
            width: "100%",
            mt: 2,
            backgroundColor: "#fff",
          }}
        >
          <EspTable />
        </Box>
      </>
    );
};
export default Index;
