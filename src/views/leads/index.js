import { Autocomplete, Box, Grid, Switch, TextField } from '@mui/material';
import React, { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import EditIcon from '@mui/icons-material/Edit';
import { useFormik } from 'formik';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import api from 'helpers/apiService';
// import { DateRange } from 'react-date-range';
// import 'react-date-range/dist/styles.css'; // main css file
// import 'react-date-range/dist/theme/default.css'; // theme css file
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import FormControlLabel from '@mui/material/FormControlLabel';
import moment from 'moment';
import LoadingButton from '@mui/lab/LoadingButton'; 
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function Leads() {
    // const [showDatePicker, setShowDatePicker] = useState(false);
    const [value, setValue] = React.useState([null, null]);
    const [checked, setChecked] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const gridRef = useRef();
    const [columnDef, setColumnDef] = useState([]);
    const [gridData, setGridData] = useState(null);
    const [rowData, setRowData] = useState();
    const [lendar, setLender] = useState([]);
    const [status, setStatus] = useState([]);

    const actionButtons = (params) => {
        const { data } = params;
    };

    useEffect(() => {
        getPageData(1, 10);
    }, []);

    const getPageData = async (pageIndex, pageItems) => {
        const data = {
            index: pageIndex,
            itemsPerIndex: pageItems,
            fromDate: moment().format('DD-MM-yyyy 00:00:00'),
            toDate: moment().format('DD-MM-yyyy 23:59:59'),
            lenderIds: ['all'],
            status: ['all']
        };
        api.post('/mis/lead-report', { data })
            .then((response) => {
                setGridData(response.data.data.reverse());
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        if (gridData && gridData.length) {
            const keys = Object.keys(gridData[0]);
            const column = keys?.map((item, index) => {
                return { field: item, filter: true };
            });
            // column.push({ field: "Action", cellRenderer: actionButtons });
            setColumnDef(column);
        }
    }, [gridData]);

    useEffect(() => {
        const fetchLenderFilters = () => {
            api.get('/mis/get-lender-filters')
                .then((response) => {
                    setLender(response.data.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        const fetchStatusFilters = () => {
            api.get('/mis/get-status-filters')
                .then((response) => {
                    setStatus(response.data.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        fetchLenderFilters();
        fetchStatusFilters();
    }, []);

    const temp = [];
    const formik = useFormik({
        initialValues: {
            loanstatus: [],
            loanlender: [],
            startDate: '',
            endDate: ''
        },
        onSubmit: (values) => {
            setLoading(true);
            const data = {
                index: 1,
                itemsPerIndex: 10,
                fromDate: moment(values.startDate).format('DD-MM-yyyy 00:00:00'),
                toDate: moment(values.endDate).format('DD-MM-yyyy 23:59:59'),
                lenderIds: values.loanlender.map((item) => item.lenderId),
                status: values.loanstatus
            };

            api.post('/mis/lead-report', { data })
                .then((response) => {
                    setGridData(response.data.data);
                    // console.log(response.data.data);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                });
        }
    });

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2} p={2} display={'flex'} justifyContent={'center'} alignItems={'flex-start'}>
                    <Grid item sm={3} xs={12}>
                        <Autocomplete
                            multiple
                            // size={'small'}
                            disablePortal
                            id="loanlender"
                            options={lendar}
                            getOptionDisabled={(item) => formik.values.loanlender.find((i) => i.name === 'All') && item.name !== 'All'}
                            name="loanlender"
                            value={formik.values.loanlender}
                            onChange={(event, value) => formik.setFieldValue('loanlender', value.includes('All') ? ['All'] : value)}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="lendar"
                                    error={formik.touched.loanlender && formik.errors.loanlender}
                                    helperText={formik.touched.loanlender && formik.errors.loanlender}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <Autocomplete
                            multiple
                            // size={'small'}
                            disablePortal
                            id="loanstatus"
                            options={status}
                            name="loanstatus"
                            value={formik.values.loanstatus}
                            onChange={(event, value) => formik.setFieldValue('loanstatus', value.includes('``All``') ? ['All'] : value)}
                            getOptionDisabled={(item) => formik.values.loanstatus.find((i) => i === 'All') && item !== 'All'}
                            getOptionLabel={(option) => option}
                            defaultValue={['All']}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="status"
                                    error={formik.touched.loanstatus && formik.errors.loanstatus}
                                    helperText={formik.touched.loanstatus && formik.errors.loanstatus}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item sm={2} xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Start Date"
                                value={formik.values.startDate}
                                name="startDate"
                                // onChange={(newDate) => console.log(newDate.$d)}
                                onChange={(newDate) => formik.setFieldValue('startDate', newDate?.$d, true)}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item sm={2} xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="End Date"
                                value={formik.values.endDate}
                                name="endDate"
                                onChange={(newDate) => formik.setFieldValue('endDate', newDate?.$d, true)}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item sm={2} xs={12}>
                        {' '}
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            fullWidth
                            loading={loading}
                            loadingPosition="start"
                            style={{ padding: '12px' }}
                        >
                            View Leads
                        </LoadingButton>
                    </Grid>
                </Grid>
            </form>
            <Grid container>
                <Grid item sm={12}>
                    <div className="ag-theme-alpine" style={{ height: 730 }}>
                        {gridData && (
                            <AgGridReact rowData={gridData} columnDefs={columnDef} pagination={true} paginationPageSize={10} rowMode />
                        )}
                    </div>
                </Grid>
            </Grid>
        </>
    );
}
