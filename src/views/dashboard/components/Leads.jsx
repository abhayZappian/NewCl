import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import axiosInstance from 'helpers/apiService';
import { useEffect } from 'react';
import { Box, styled } from '@mui/system';
import { Pagination, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { selectCampaignJourneyList } from 'store/selectors';
import apiEndPoints from 'helpers/APIEndPoints';
import { setCampaignJourneyList } from 'store/action/journeyCanvas';

const CustomTableRow = styled(TableRow)(({ index }) => ({
    backgroundColor: index % 2 === 0 ? '#F7F8FC' : 'white',
    height: '80px'
}));
const headerCellStyle = {
    borderBottom: '2px solid #7C86BD',
    textAlign: 'left',
    position: 'relative',
    height: '80px'
};
const dividerStyle = {
    content: '""',
    position: 'absolute',
    top: '11px',
    bottom: '0',
    left: '100%',
    borderLeft: '2px solid #DADADA',
    height: '55px'
};

const Leads = () => {
    const navigation = useNavigate();
    const journeyList = useSelector(selectCampaignJourneyList);
    const [data, setdata] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [myData, setMyData] = useState([]);
    console.log(myData);

    const dispatch = useDispatch();
    const getData = async () => {
        const { data } = await axiosInstance.post(apiEndPoints.getAllJourneyStats);
        setdata(data?.data?.data);
        setMyData(data?.data?.data);
        setLoading(false);
    };
    const getJourneyName = (id) => {
        const journey = journeyList.find((journey) => journey._id === id);
        if (journey) {
            return journey.journeyName;
        } else return 'NA';
    };
    useEffect(() => {
        if (!journeyList.length) {
            axiosInstance
                .get(apiEndPoints.getCampaignJourneyList)
                .then((response) => {
                    const responseData = response.data;
                    dispatch(setCampaignJourneyList(responseData));
                    setLoading(false);
                    getData();
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        } else {
            getData();
        }
    }, []);

    const itemsPerPage = 10;

    const handleSearch = (searchTerm) => {
        const filteredData = data?.filter((item) => {
            const journeyName = getJourneyName(item.journeyId);
            return journeyName.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setMyData(filteredData);
        console.log(filteredData);
        setCurrentPage(1);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = myData?.slice(startIndex, endIndex);

    return (
        <Box>
            <Box sx={{ bgcolor: '#F7F8FC' }}>
                <Typography variant="h2" padding="20px">
                    Journey Performance Stats
                </Typography>
            </Box>
            <Box sx={{ padding: 2, pl: 5 }}>
                <TextField
                    type="text"
                    placeholder="Search "
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyUp={(e) => handleSearch(e.target.value)}
                    variant="outlined"
                    size="small"
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    // minHeight: '100vh',
                    padding: '40px',
                    border: '1px solid #DADADA',
                    alignItems: 'center'
                }}
            >
                {itemsToDisplay?.length === 0 ? (
                    <Typography sx={{ mt: 5 }} variant="h1">
                        No data available.
                    </Typography>
                ) : (
                    <>
                        {Loading ? (
                            <CircularProgress size={80} /> // Show loader while data is loading
                        ) : (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ ...headerCellStyle, height: '60px' }}>
                                                Journery Id
                                                <span style={dividerStyle}></span>
                                            </TableCell>
                                            <TableCell style={{ ...headerCellStyle }}>
                                                Journery Name
                                                <span style={dividerStyle}></span>
                                            </TableCell>
                                            <TableCell style={{ ...headerCellStyle }}>
                                                Count Bounce
                                                <span style={dividerStyle}></span>
                                            </TableCell>
                                            <TableCell style={{ ...headerCellStyle }}>
                                                Count Clicked
                                                <span style={dividerStyle}></span>
                                            </TableCell>
                                            <TableCell style={{ ...headerCellStyle }}>
                                                Count Opened
                                                <span style={dividerStyle}></span>
                                            </TableCell>
                                            <TableCell style={{ ...headerCellStyle }}>
                                                Count Sent
                                                <span style={dividerStyle}></span>
                                            </TableCell>
                                            <TableCell style={{ ...headerCellStyle }}>Count Unsub</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {itemsToDisplay?.map((row, index) => (
                                            <CustomTableRow key={row.name} index={index}>
                                                <TableCell
                                                    sx={{ cursor: 'pointer' }}
                                                    component="th"
                                                    scope="row"
                                                    onClick={() => {
                                                        navigation(`/campaignLeads/${row.journeyId}`);
                                                    }}
                                                >
                                                    {row.journeyId}
                                                </TableCell>
                                                <TableCell>{getJourneyName(row.journeyId)}</TableCell>
                                                <TableCell>{row.countBounce}</TableCell>
                                                <TableCell>{row.countClicked}</TableCell>
                                                <TableCell>{row.countOpened}</TableCell>
                                                <TableCell>{row.countSent}</TableCell>
                                                <TableCell>{row.countUnsub}</TableCell>
                                            </CustomTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </>
                )}
            </Box>
            <Box sx={{ ml: 5 }}>
                <Stack sx={{ pb: 2 }} spacing={2} mt={2}>
                    <Stack spacing={2} mt={2}>
                        <Pagination
                            count={Math.ceil(data?.length / itemsPerPage)}
                            page={currentPage}
                            onChange={(event, value) => setCurrentPage(value)}
                            variant="outlined"
                            shape="rounded"
                            color="primary"
                        />
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
};
export default Leads;
