import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, CircularProgress, Pagination, Stack, TextField } from '@mui/material';
import { Box, styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
const CustomTableRow = styled(TableRow)(({ index }) => ({
    backgroundColor: index % 2 === 0 ? '#F7F8FC' : 'white',
    
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
const SearchTable = ({ searchRecords }) => {
    const [loading, setLoading] = useState(true);
    const [propValue, setPropValue] = useState([]);
    useEffect(() => {
        setPropValue(searchRecords);
    }, [searchRecords]);
    console.log(propValue?.length);
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0px 0px',
                    border: '1px solid #DADADA',
                    alignItems: 'center'
                }}
            >
                {propValue?.length === 0 || propValue?.length === undefined ? (
                    <>
                        <h1>No Records Found</h1>
                    </>
                ) : (
                    <>
                        <TableContainer component={Paper}>
                            <Table>
                                <colgroup>
                                    <col style={{ width: '10%' }} />
                                    <col style={{ width: '10%' }} />
                                    <col style={{ width: '10%' }} />
                                    <col style={{ width: '15%' }} />
                                    <col style={{ width: '10%' }} />
                                    <col style={{ width: '10%' }} />
                                    <col style={{ width: '10%' }} />
                                    <col style={{ width: '10%' }} />
                                </colgroup>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" style={{ ...headerCellStyle, height: '50px' }}>
                                            S.No.
                                            <span style={dividerStyle}></span>
                                        </TableCell>
                                        <TableCell style={{ ...headerCellStyle }}>
                                            Person Name
                                            <span style={dividerStyle}></span>
                                        </TableCell>
                                        <TableCell style={{ ...headerCellStyle }}>
                                            Mobile
                                            <span style={dividerStyle}></span>
                                        </TableCell>
                                        <TableCell style={{ ...headerCellStyle }}>
                                            Email
                                            <span style={dividerStyle}></span>
                                        </TableCell>
                                        <TableCell style={{ ...headerCellStyle }}>
                                            City
                                            <span style={dividerStyle}></span>
                                        </TableCell>
                                        <TableCell style={{ ...headerCellStyle }}>
                                            List Name
                                            <span style={dividerStyle}></span>
                                        </TableCell>
                                        <TableCell style={{ ...headerCellStyle }}>
                                            Email Type
                                            <span style={dividerStyle}></span>
                                        </TableCell>
                                        <TableCell style={{ ...headerCellStyle }}>
                                            Source
                                            <span style={dividerStyle}></span>
                                        </TableCell>
                                        <TableCell style={{ ...headerCellStyle }}>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {propValue?.map((row, index) => (
                                        <CustomTableRow key={row.network_id} index={index}>
                                            <TableCell>{row.s_no}</TableCell>
                                            <TableCell>{row.firstname}</TableCell>
                                            <TableCell>{row.mobile}</TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{row.city}</TableCell>
                                            <TableCell>{row.list_name}</TableCell>
                                            <TableCell>{row.domain}</TableCell>
                                            <TableCell>{row.sourceurl}</TableCell>
                                            <TableCell>{row.create_date}</TableCell>
                                        </CustomTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Box>
        </>
    );
};
export default SearchTable;