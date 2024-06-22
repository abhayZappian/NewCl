import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PowerIcon from '@mui/icons-material/Power';
import DeleteIcon from '@mui/icons-material/Delete';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import { Button, IconButton, Pagination, Stack, TextField, Tooltip, tooltipClasses } from '@mui/material';
import NetworkDrawer from './drawer';
import ConfirmationDialog from '../../../../ui-component/conformationModel/index';
import { Box, styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import CircularLoader from '../../../../ui-component/CircularLoader';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddDomainDrawer from './AddDomain';
import { DomainAction, EditDomainAction, getDomainDetails } from 'services/adminConsole/esp/domain';
import axiosInstance from 'helpers/apiService';
import apiEndPoints from 'helpers/APIEndPoints';
import Icon from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';

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
const DomainTable = () => {
    const [state, setState] = useState({
        isDrawerOpen: false,
        isDomainTable: false,
        isAddDomainDrawer: false,
        openDelete: false,
        openActive: false,
        openINActive: false,
        isLoading: true,
        openActiveDomain: false,
        openDeleteDomain: false,
        openINActiveDomain: false
    });
    const [rowData, setRowData] = useState({});
    const [domainName, setDomainName] = useState({ name: '', id: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState([]);
    const [domainDetails, setDomainDetails] = useState([]);
    const [domainTableDetails, setDomainTableDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [domainID, setDomainID] = useState(null);

    const getData = async () => {
        setState({ isLoading: true });
        const { data } = await getDomainDetails();
        console.log(data.result);
        setData(data?.result);
        setDomainDetails(data?.result);
        setState({ isLoading: false });
    };

    const getDomainData = async (id) => {
        setState({ isLoading: true });
        const res = await axiosInstance.put(`${apiEndPoints.domainDetails}/${id}`);
        console.log(res);
        setDomainTableDetails(res?.data?.result);
        setState({ isLoading: false });
    };

    useEffect(() => {
        getData();
    }, []);

    const handleAction = async (id, actionType, message) => {
        await DomainAction(id, actionType, message);
        setTimeout(() => {
            getData(currentPage);
        }, 300);
    };
    const action = (id, action) => {
        switch (true) {
            case action === '0':
                if (id) {
                    handleAction(domainName.id, '0', 'Domain In-Active Successfully !!!');
                }
                break;
            case action === '1':
                if (id) {
                    handleAction(domainName.id, '1', 'Domain Active Successfully !!!');
                }
                break;
            default:
                if (id) {
                    handleAction(domainName.id, '2', 'Domain Deleted Successfully !!!');
                }
        }
        setState({ openActive: false, openINActive: false, openDelete: false });
    };

    const handleActionDomain = async (id, actionType, message) => {
        await EditDomainAction(id, actionType, message);
        setTimeout(() => {
            getDomainData(domainID);
        }, 300);
    };
    const actionDomain = (id, action) => {
        switch (true) {
            case action === '0':
                if (id) {
                    handleActionDomain(domainName.id, '0', 'Domain In-Active Successfully !!!');
                }
                break;
            case action === '1':
                if (id) {
                    handleActionDomain(domainName.id, '1', 'Domain Active Successfully !!!');
                }
                break;
            default:
                if (id) {
                    handleActionDomain(domainName.id, '2', 'Domain Deleted Successfully !!!');
                }
        }
        setState({ openActive: false, openINActive: false, openDelete: false });
    };
    const openDrawer = () => {
        setRowData({});
        setState({ isDrawerOpen: true });
    };
    const openAddDomainDrawer = (data) => {
        setRowData(data);
        setState({ isAddDomainDrawer: true });
    };

    const handleEdit = (data) => {
        setRowData(data);
        setState({ isDrawerOpen: true });
    };
    const handleEditDomain = (data) => {
        setRowData(data);
        setState({ isAddDomainDrawer: true });
    };

    const [tabs, setTabs] = useState([
        { name: 'Domain ', content: 'Table Content' },
        { name: 'Edit Domain Account', content: null }
    ]);
    const [activeTab, setActiveTab] = useState(0);
    const [buttonName, setButtonName] = useState('Dynamic');

    const openDynamicTab = (rowData) => {
        const updatedTabs = [...tabs];
        updatedTabs[1].content = rowData;
        setTabs(updatedTabs);
        setButtonName(rowData.account_name);
        setActiveTab(1);
    };
    const itemsPerPage = 10;
    const handleSearch = (searchTerm) => {
        const filteredData = domainDetails?.filter((item) => item?.account_name?.toLowerCase().includes(searchTerm.toLowerCase()));
        setData(filteredData);
        setCurrentPage(1);
    };
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = data?.slice(startIndex, endIndex);
    return (
        <>
            <Box sx={{ p: '0 20px' }}>
                <div style={{ padding: '10px' }}>
                    <Button variant={activeTab === 0 ? 'contained' : 'outlined'} onClick={() => setActiveTab(0)}>
                        {tabs[0].name}
                    </Button>
                    {activeTab === 0 ? (
                        ''
                    ) : (
                        <Button sx={{ ml: 2 }} variant={activeTab === 1 ? 'contained' : 'outlined'} onClick={() => setActiveTab(1)}>
                            domain : {buttonName}
                        </Button>
                    )}
                </div>
            </Box>
            {activeTab === 1 ? (
                ''
            ) : (
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
            )}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0px 40px',
                    border: '1px solid #DADADA',
                    alignItems: 'center'
                }}
            >
                {state.isLoading ? (
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <CircularLoader />
                    </Box>
                ) : (
                    <div>
                        {tabs.map((tab, index) => (
                            <div key={index} style={{ display: index === activeTab ? 'block' : 'none' }}>
                                {index === 0 ? ( // Render the static table for the first tab
                                    <TableContainer
                                        sx={{
                                            width: '94vw'
                                        }}
                                        component={Paper}
                                    >
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left" style={{ ...headerCellStyle, height: '50px' }}>
                                                        S.No
                                                        <span style={dividerStyle}></span>
                                                    </TableCell>
                                                    <TableCell align="left" style={{ ...headerCellStyle }}>
                                                        Account Name
                                                        <span style={dividerStyle}></span>
                                                    </TableCell>
                                                    <TableCell align="left" style={{ ...headerCellStyle }}>
                                                        Service Name
                                                        <span style={dividerStyle}></span>
                                                    </TableCell>
                                                    <TableCell style={{ ...headerCellStyle }}>
                                                        Account Email
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
                                                    <TableCell style={{ ...headerCellStyle }}>
                                                        Actions
                                                        <span style={dividerStyle}></span>
                                                    </TableCell>
                                                    <TableCell style={{ ...headerCellStyle }}>Add Domain</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {itemsToDisplay && itemsToDisplay?.length > 0 ? (
                                                    itemsToDisplay?.map((row, index) => (
                                                        <CustomTableRow key={row.account_id} index={index}>
                                                            <TableCell>{row.s_no}</TableCell>
                                                            <TableCell>{row.account_name}</TableCell>
                                                            <TableCell>{row.service_name}</TableCell>
                                                            <TableCell>{row.account_email}</TableCell>
                                                            <TableCell>{row.created_by_name}</TableCell>
                                                            <TableCell>{row.create_date}</TableCell>
                                                            <TableCell sx={{ padding: '0px' }}>
                                                                <LightTooltip title="Edit">
                                                                    <IconButton style={{ color: '#4E99F5' }} aria-label="edit">
                                                                        <EditIcon onClick={() => handleEdit(row)} />
                                                                    </IconButton>
                                                                </LightTooltip>
                                                                {row.active === 1 ? (
                                                                    <LightTooltip title="Delete">
                                                                        <IconButton style={{ color: '#cccccc' }} aria-label="delete">
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </LightTooltip>
                                                                ) : (
                                                                    <LightTooltip title="Delete">
                                                                        <IconButton
                                                                            onClick={() => {
                                                                                setDomainName({
                                                                                    name: row.account_name,
                                                                                    id: row.account_id
                                                                                });
                                                                                setState({ openDelete: true });
                                                                            }}
                                                                            style={{ color: '#404347' }}
                                                                            aria-label="delete"
                                                                        >
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </LightTooltip>
                                                                )}

                                                                {row.active === 1 ? (
                                                                    <LightTooltip title="Active">
                                                                        <IconButton
                                                                            onClick={() => {
                                                                                setDomainName({
                                                                                    name: row.account_name,
                                                                                    id: row.account_id
                                                                                });
                                                                                setState({ openActive: true });
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
                                                                                setDomainName({
                                                                                    name: row.account_name,
                                                                                    id: row.account_id
                                                                                });
                                                                                setState({ openINActive: true });
                                                                            }}
                                                                            style={{ color: 'red' }}
                                                                            aria-label="active"
                                                                        >
                                                                            <PowerOffIcon />
                                                                        </IconButton>
                                                                    </LightTooltip>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <LightTooltip title="Add">
                                                                    <IconButton
                                                                        onClick={() => openAddDomainDrawer(row)}
                                                                        style={{ color: '#4E99F5' }}
                                                                        aria-label="edit"
                                                                    >
                                                                        <Icon path={mdiPlusBox} size={1} />
                                                                    </IconButton>
                                                                </LightTooltip>
                                                                <LightTooltip title="Preview">
                                                                    <IconButton style={{ color: '#4E99F5' }} aria-label="edit">
                                                                        <VisibilityIcon
                                                                            onClick={() => {
                                                                                openDynamicTab(row);
                                                                                setDomainName({
                                                                                    name: row.account_name,
                                                                                    id: row.account_id
                                                                                });
                                                                                setDomainID(row.account_id);
                                                                                getDomainData(row?.account_id);
                                                                            }}
                                                                        />
                                                                    </IconButton>
                                                                </LightTooltip>
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
                                ) : (
                                    // Render tab content for other tabs
                                    <div>
                                        <TableContainer
                                            sx={{
                                                width: '94vw'
                                            }}
                                            component={Paper}
                                        >
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="left" style={{ ...headerCellStyle, height: '50px' }}>
                                                            S.No
                                                            <span style={dividerStyle}></span>
                                                        </TableCell>
                                                        <TableCell align="left" style={{ ...headerCellStyle }}>
                                                            Domain
                                                            <span style={dividerStyle}></span>
                                                        </TableCell>
                                                        <TableCell align="left" style={{ ...headerCellStyle }}>
                                                            Account
                                                            <span style={dividerStyle}></span>
                                                        </TableCell>
                                                        <TableCell style={{ ...headerCellStyle }}>
                                                            Blacklisted
                                                            <span style={dividerStyle}></span>
                                                        </TableCell>

                                                        <TableCell style={{ ...headerCellStyle }}>
                                                            Created By
                                                            <span style={dividerStyle}></span>
                                                        </TableCell>
                                                        <TableCell style={{ ...headerCellStyle }}>
                                                            Created Date
                                                            <span style={dividerStyle}></span>
                                                        </TableCell>
                                                        <TableCell style={{ ...headerCellStyle }}>Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {domainTableDetails && domainTableDetails?.length > 0 ? (
                                                        domainTableDetails?.map((row, index) => (
                                                            <CustomTableRow key={row.account_id} index={index}>
                                                                <TableCell>{row.s_no}</TableCell>
                                                                <TableCell>{row.domain_name}</TableCell>
                                                                <TableCell>{row.account_name}</TableCell>
                                                                <TableCell>{row.blacklisted}</TableCell>
                                                                <TableCell>{row.created_by_name}</TableCell>
                                                                <TableCell>{row.create_date}</TableCell>
                                                                <TableCell sx={{ padding: '0px' }}>
                                                                    <LightTooltip title="Edit">
                                                                        <IconButton style={{ color: '#4E99F5' }} aria-label="edit">
                                                                            <EditIcon onClick={() => handleEditDomain(row)} />
                                                                        </IconButton>
                                                                    </LightTooltip>
                                                                    {row.active === 1 ? (
                                                                        <LightTooltip title="Delete">
                                                                            <IconButton style={{ color: '#cccccc' }} aria-label="delete">
                                                                                <DeleteIcon />
                                                                            </IconButton>
                                                                        </LightTooltip>
                                                                    ) : (
                                                                        <LightTooltip title="Delete">
                                                                            <IconButton
                                                                                onClick={() => {
                                                                                    setDomainName({
                                                                                        name: row.domain_name,
                                                                                        id: row.domain_id
                                                                                    });
                                                                                    setState({ openDeleteDomain: true });
                                                                                }}
                                                                                style={{ color: '#404347' }}
                                                                                aria-label="delete"
                                                                            >
                                                                                <DeleteIcon />
                                                                            </IconButton>
                                                                        </LightTooltip>
                                                                    )}

                                                                    {row.active === 1 ? (
                                                                        <LightTooltip title="Active">
                                                                            <IconButton
                                                                                onClick={() => {
                                                                                    setDomainName({
                                                                                        name: row.domain_name,
                                                                                        id: row.domain_id
                                                                                    });
                                                                                    setState({ openActiveDomain: true });
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
                                                                                    setDomainName({
                                                                                        name: row.domain_name,
                                                                                        id: row.domain_id
                                                                                    });
                                                                                    setState({ openINActiveDomain: true });
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
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Box>
            {activeTab === 1 ? (
                ''
            ) : (
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
            )}

            <NetworkDrawer
                getDataRender={getData}
                defaultValues={rowData}
                setDefaultValues={setRowData}
                isDrawerOpen={state.isDrawerOpen}
                setIsDrawerOpen={setState}
            />
            {state?.isAddDomainDrawer && (
                <AddDomainDrawer
                    defaultValues={rowData}
                    setDefaultValues={setRowData}
                    isDrawerOpen={state.isAddDomainDrawer}
                    setIsDrawerOpen={setState}
                    getDomainData={getDomainData}
                    domainID={domainID}
                />
            )}
            <ConfirmationDialog
                open={state.openDelete}
                handleClose={action}
                title={`${domainName.name}`}
                content="Are you sure you want to Delete this domain?"
                onConfirm={() => action(domainName.id, '2')}
                confirmText="Delete"
            />
            <ConfirmationDialog
                open={state.openActive}
                handleClose={action}
                title={`${domainName.name}`}
                content="Are you sure you want to In-active this domain?"
                onConfirm={() => action(domainName.id, '0')}
                confirmText="In-Active"
            />
            <ConfirmationDialog
                open={state.openINActive}
                handleClose={action}
                title={`${domainName.name}`}
                content="Are you sure you want to Active this domain?"
                onConfirm={() => action(domainName.id, '1')}
                confirmText="Active"
            />
            <ConfirmationDialog
                open={state.openDeleteDomain}
                handleClose={actionDomain}
                title={`${domainName.name}`}
                content="Are you sure you want to Delete this domain?"
                onConfirm={() => actionDomain(domainName.id, '2')}
                confirmText="Delete"
            />
            <ConfirmationDialog
                open={state.openActiveDomain}
                handleClose={actionDomain}
                title={`${domainName.name}`}
                content="Are you sure you want to In-active this domain?"
                onConfirm={() => actionDomain(domainName.id, '0')}
                confirmText="In-Active"
            />
            <ConfirmationDialog
                open={state.openINActiveDomain}
                handleClose={actionDomain}
                title={`${domainName.name}`}
                content="Are you sure you want to Active this domain?"
                onConfirm={() => actionDomain(domainName.id, '1')}
                confirmText="Active"
            />
        </>
    );
};
export default DomainTable;
