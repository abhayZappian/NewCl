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
import { useState } from 'react';
import { useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, CircularProgress, IconButton, Pagination, TextField, Tooltip, styled, tooltipClasses } from '@mui/material';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import NetworkDrawer from './drawer';
import { Box, Stack } from '@mui/system';
import ConfirmationDialog from '../../../../ui-component/conformationModel/index';
import AddIcon from '@mui/icons-material/Add';
import { getPoolDetails, handleActionPool } from 'services/presets/pool';
import { useDispatch, useSelector } from 'react-redux';
import { selectPoolTable } from 'store/selectors';
import { setPoolTable } from 'store/action/journeyCanvas';
import CircularLoader from 'ui-component/CircularLoader';

const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11
    }
}));
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

export default function FooterTable() {
    const [openActive, setOpenActive] = useState({
        delete: false,
        active: false,
        inactive: false,
        drawer: false
    });
    const [pool, setPool] = useState({ name: '', id: '' });
    const [rowData, setRowData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState([]);
    const [poolDetails, setPoolDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const poolTable = useSelector(selectPoolTable || []);

    useEffect(() => {
        if (poolTable.length === 0) {
            getPoolData();
        } else {
            setData(poolTable);
            setIsLoading(false);
        }
    }, []);

    const getPoolData = async () => {
        setIsLoading(true);
        const data = await getPoolDetails();
        setData(data?.data?.results);
        dispatch(setPoolTable(data?.data?.results));
        setPoolDetails(data?.data?.results);
        setIsLoading(false);
    };

    const handleAction = async (id, actionType, message) => {
        const res = await handleActionPool(id, actionType, message);
        getPoolData();
    };

    const action = (id, action) => {
        switch (true) {
            case action === '0':
                if (id) {
                    handleAction(pool.id, '0', 'Footer Active Successfully !!!');
                }
                break;
            case action === '1':
                if (id) {
                    handleAction(pool.id, '1', 'Footer In-Active Successfully !!!');
                }
                break;
            default:
                if (id) {
                    handleAction(pool.id, '2', 'Footer Deleted Successfully !!!');
                }
        }
        setOpenActive(false);
    };

    const handleEdit = (data) => {
        setRowData(data);
        setOpenActive({ drawer: true });
    };
    const openDrawer = () => {
        setRowData({});
        setOpenActive({ drawer: true });
    };
    const onsubmit = () => {
        setTimeout(getPoolData, 300);
    };

    const itemsPerPage = 10;
    const handleSearch = (searchTerm) => {
        const filteredData = poolDetails?.filter((item) => item?.poolName?.toLowerCase().includes(searchTerm.toLowerCase()));
        dispatch(setPoolTable(filteredData));
        setCurrentPage(1);
    };
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = poolTable?.slice(startIndex, endIndex);

    return (
        <>
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
            >
                <TextField
                    type="text"
                    placeholder="Search "
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyUp={(e) => handleSearch(e.target.value)}
                    variant="outlined"
                    size="small"
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    <Button
                        variant="contained"
                        endIcon={<AddIcon />}
                        sx={{ backgroundColor: '#FF831F', textTransform: 'capitalize' }}
                        onClick={openDrawer}
                    >
                        Add
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0px 40px',
                    border: '1px solid #DADADA',
                    alignItems: 'center'
                }}
            >
                {isLoading ? (
                     <Box
                     sx={{
                         height: '100%',
                         display: 'flex',
                         justifyContent: 'center',
                         alignItems: 'center'
                     }}
                 >
                     <CircularLoader/>
                 </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" style={{ ...headerCellStyle }}>
                                        Pool Name
                                        <span style={dividerStyle}></span>
                                    </TableCell>
                                    <TableCell style={{ ...headerCellStyle }}>
                                        Pool Type
                                        <span style={dividerStyle}></span>
                                    </TableCell>{' '}
                                    <TableCell style={{ ...headerCellStyle }}>
                                        Pool ID
                                        <span style={dividerStyle}></span>
                                    </TableCell>
                                    <TableCell style={{ ...headerCellStyle }}>
                                        Created By
                                        <span style={dividerStyle}></span>
                                    </TableCell>
                                    <TableCell style={{ ...headerCellStyle }}>
                                        Created At
                                        <span style={dividerStyle}></span>
                                    </TableCell>
                                    <TableCell style={{ ...headerCellStyle }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {itemsToDisplay && itemsToDisplay.length > 0 ? (
                                    itemsToDisplay?.map((row, index) => (
                                        <CustomTableRow key={row.id} index={index}>
                                            <TableCell>{row.poolName}</TableCell>
                                            <TableCell>{row.poolType}</TableCell>
                                            <TableCell>{row._id}</TableCell>

                                            <TableCell>{row.createdByName}</TableCell>
                                            <TableCell>{row.createdAt}</TableCell>
                                            <TableCell sx={{ padding: '0px' }}>
                                                <LightTooltip title="Edit">
                                                    <IconButton style={{ color: '#4E99F5' }} aria-label="edit">
                                                        <EditIcon
                                                            onClick={() => {
                                                                handleEdit(row);
                                                            }}
                                                        />
                                                    </IconButton>
                                                </LightTooltip>
                                                {row.active === 'Active' ? (
                                                    <>
                                                        <LightTooltip title="Delete">
                                                            <IconButton style={{ color: '#cccccc' }} aria-label="delete">
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </LightTooltip>
                                                    </>
                                                ) : (
                                                    <>
                                                        <LightTooltip title="Delete">
                                                            <IconButton
                                                                onClick={() => {
                                                                    setPool({
                                                                        name: row.poolName,
                                                                        id: row._id
                                                                    });
                                                                    setOpenActive({ delete: true });
                                                                }}
                                                                style={{ color: '#404347' }}
                                                                aria-label="delete"
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </LightTooltip>
                                                    </>
                                                )}

                                                {row.active === 'Active' ? (
                                                    <LightTooltip title="Active">
                                                        <IconButton
                                                            onClick={() => {
                                                                setPool({
                                                                    name: row.poolName,
                                                                    id: row._id
                                                                });
                                                                setOpenActive({ active: true });
                                                            }}
                                                            style={{ color: 'green' }}
                                                            aria-label="active"
                                                        >
                                                            <PowerIcon />
                                                        </IconButton>
                                                    </LightTooltip>
                                                ) : (
                                                    <LightTooltip title="In-Active">
                                                        <IconButton
                                                            onClick={() => {
                                                                setPool({
                                                                    name: row.poolName,
                                                                    id: row._id
                                                                });
                                                                setOpenActive({ inactive: true });
                                                            }}
                                                            style={{ color: 'red' }}
                                                            aria-label="active"
                                                        >
                                                            <PowerOffIcon />
                                                        </IconButton>
                                                    </LightTooltip>
                                                )}
                                            </TableCell>
                                        </CustomTableRow>
                                    ))
                                ) : (
                                    <TableRow sx={{ height: '56.5vh' }}>
                                        <TableCell sx={{ border: 'none' }} colSpan={9} align="center">
                                            {/* No data found */}
                                            <span
                                                style={{
                                                    padding: '10px',
                                                    border: '2px solid #444',
                                                    backgroundColor: 'lightgoldenrodyellow'
                                                }}
                                            >
                                                No data was found
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
            <Stack sx={{ pb: 2 }} spacing={2} mt={2}>
                <Stack spacing={2} mt={2}>
                    <Pagination
                        count={Math.ceil(data.length / itemsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                        variant="outlined"
                        shape="rounded"
                        color="primary"
                    />
                </Stack>
            </Stack>
            <NetworkDrawer
                getDataRender={getPoolData}
                onClose={onsubmit}
                defaultValues={rowData}
                openActive={openActive.drawer}
                setOpenActive={setOpenActive}
                setDefaultValues={setRowData}
            />
            <ConfirmationDialog
                open={openActive.delete}
                handleClose={action}
                title={`${pool.name}`}
                content="Are you sure you want to Delete this pool?"
                onConfirm={() => action(pool.id, '2')}
                confirmText="Delete"
            />
            <ConfirmationDialog
                open={openActive.active}
                handleClose={action}
                title={`${pool.name}`}
                content="Are you sure you want to In-active this pool?"
                onConfirm={() => action(pool.id, '0')}
                confirmText="In-Active"
            />
            <ConfirmationDialog
                open={openActive.inactive}
                handleClose={action}
                title={`${pool.name}`}
                content="Are you sure you want to active this pool?"
                onConfirm={() => action(pool.id, '1')}
                confirmText="Active"
            />
        </>
    );
}
