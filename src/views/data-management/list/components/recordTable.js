import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, Drawer, styled } from '@mui/material';
import axiosInstance from 'helpers/apiService';
import { Box } from '@mui/system';
import apiEndPoints from 'helpers/APIEndPoints';

const CustomTableRow = styled(TableRow)(({ index }) => ({
    backgroundColor: index % 2 === 0 ? '#F7F8FC' : 'white'
}));

const headerCellStyle = {
    borderBottom: '2px solid #7C86BD',
    textAlign: 'left',
    position: 'relative'
};

const dividerStyle = {
    content: '""',
    position: 'absolute',
    top: '10px',
    bottom: '0',
    left: '100%',
    borderLeft: '2px solid #DADADA',
    height: '40px'
};

const RecordTable = ({ openDialog, setOpenDialog, defaultValues }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(`${apiEndPoints.getRecordsById}/${defaultValues?.listid}`);
            setData(data?.result);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getData();
    }, [defaultValues]);

    return (
        <Drawer
            anchor="right"
            open={openDialog}
            onClose={() => {
                setData();
            }}
            PaperProps={{
                sx: { width: '60%' }
            }}
            ModalProps={{
                BackdropProps: {
                    sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                    onClick: (event) => {
                        // Prevent closing the drawer when clicking inside it
                        event.stopPropagation();
                    },
                },
            }}
        >
            <Box
                sx={{
                    backgroundColor: '#FEFEFE',
                    borderRadius: '5px',
                    boxShadow: '0px 0px 10px #EAEAEE',
                    padding: '0.7rem 2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            ></Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0px 40px',
                    border: '1px solid #DADADA',
                    alignItems: 'center'
                }}
            >
                {data?.length === 0 || data?.length === undefined ? (
                    <>
                        <h1>No Records Found</h1>
                    </>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" style={{ ...headerCellStyle, height: '50px' }}>
                                        Email
                                        <span style={dividerStyle}></span>
                                    </TableCell>
                                    <TableCell style={{ ...headerCellStyle }}>
                                        First Name
                                        <span style={dividerStyle}></span>
                                    </TableCell>
                                    <TableCell style={{ ...headerCellStyle }}>Last Name</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.map((row, index) => (
                                    <CustomTableRow key={row.network_id} index={index}>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.firstname}</TableCell>
                                        <TableCell>{row.lastname}</TableCell>
                                    </CustomTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    mt: 4,
                    mr: 3
                }}
            >
                <Button
                    variant="outlined"
                    onClick={() => {
                        setOpenDialog(false);
                    }}
                >
                    Close
                </Button>
            </Box>
        </Drawer>
    );
};

export default RecordTable;
