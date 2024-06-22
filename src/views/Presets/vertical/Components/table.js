import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import PowerIcon from '@mui/icons-material/Power';
import { baseURL } from 'config/envConfig';
import { useState } from 'react';
import { useEffect } from 'react';
import axiosInstance from 'helpers/apiService';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Pagination } from '@mui/material';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import VerticalDrawer from './drawer';
import { Stack } from '@mui/system';
import { enqueueSnackbar } from 'notistack';

export default function VerticalTable() {
    const [getAllVerticalNames, setAllVerticalNames] = useState([]);
    console.log(getAllVerticalNames, 'names');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [rowData, setRowData] = useState({});
    const [getDataRender, setGetDataRender] = useState(false);
    console.log(getDataRender, 'render');

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            getData();
        }, 300);
    }, [getDataRender]);

    const getData = async () => {
        const { data } = await axiosInstance.get(`${baseURL}/allVerticalDetails`);
        setAllVerticalNames(data.result);
        setMyData(data.result);
    };

    const getVerticalStatus = async (id) => {
        console.log(id, 'idd');
        const data = {
            action: '2'
        };
        const res = await axiosInstance.put(`${baseURL}/updateVerticalActiveStatus/${id}`, data);
        console.log('delete');
        enqueueSnackbar('Successfully Deleted !!!', {
            variant: 'success'
        });
    };

    const getVerticalActiveStatus = async (id) => {
        console.log(id, 'idd');
        const data = {
            action: '0'
        };
        const res = await axiosInstance.put(`${baseURL}/updateVerticalActiveStatus/${id}`, data);
        console.log('active hai');
        enqueueSnackbar('Vertical Active Successfully  !!!', {
            variant: 'success'
        });
    };

    const getVerticalInActiveStatus = async (id) => {
        console.log(id, 'idd');
        const data = {
            action: '1'
        };
        const res = await axiosInstance.put(`${baseURL}/updateVerticalActiveStatus/${id}`, data);
        console.log('in - active hai');
        enqueueSnackbar('Vertical In - Active Successfully  !!!', {
            variant: 'success'
        });
    };

    // const handleEdit = (index) => {
    //     console.log(index);
    //     setIsDrawerOpen(true);
    //     setRowData(getAllVerticalNames[index]);
    // };
    const handleEdit = (data) => {
        setRowData(data);
        setIsDrawerOpen(true);
    };
    const itemsPerPage = 8;

    const [currentPage, setCurrentPage] = useState(1);
    const [myData, setMyData] = useState([]);

    const handleChange = (event, value) => {
        setCurrentPage(value);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = myData?.slice(startIndex, endIndex);

    return (
        <>
            <Paper sx={{ width: '100%', overflow: 'hidden', mt: '-12px' }} elevation={0}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#ededed' }}>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>Name</TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>Created By</TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>Created Date</TableCell>
                                <TableCell sx={{ color: 'black', textAlign: 'center' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itemsToDisplay.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell sx={{ textAlign: 'center' }}>{row.vertical_name}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{row.creator_name}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{row.created_on}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <IconButton style={{ color: '#4e99f5' }} aria-label="edit">
                                            <EditIcon
                                                onClick={() => {
                                                    handleEdit(row);
                                                    setGetDataRender(!getDataRender);
                                                }}
                                            />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                getVerticalStatus(row.id);
                                                setGetDataRender(!getDataRender);
                                            }}
                                            style={{ color: '#404347' }}
                                            aria-label="delete"
                                        >
                                            <DeleteIcon />
                                        </IconButton>

                                        {row.active === 1 ? (
                                            <>
                                                <IconButton
                                                    onClick={() => {
                                                        getVerticalActiveStatus(row.id);
                                                        setGetDataRender(!getDataRender);
                                                    }}
                                                    style={{ color: 'green' }}
                                                    aria-label="active"
                                                >
                                                    <PowerIcon />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <>
                                                <IconButton
                                                    onClick={() => {
                                                        getVerticalInActiveStatus(row.id);
                                                        setGetDataRender(!getDataRender);
                                                    }}
                                                    style={{ color: 'red' }}
                                                    aria-label="active"
                                                >
                                                    <PowerOffIcon />
                                                </IconButton>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Stack sx={{ pb: 2 }} spacing={2} mt={2}>
                <Stack spacing={2} mt={2}>
                    <Pagination
                        count={Math.ceil(myData.length / itemsPerPage)}
                        page={currentPage}
                        onChange={handleChange}
                        variant="outlined"
                        shape="rounded"
                        color="primary"
                    />
                </Stack>
            </Stack>

            <VerticalDrawer
                getDataRender={getDataRender}
                defaultValues={rowData}
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
            />
        </>
    );
}
