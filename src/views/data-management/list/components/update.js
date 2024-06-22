import React, { useState, useEffect } from 'react';
import { Checkbox, Drawer, FormControlLabel, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Autocomplete, Box, FormControl, FormLabel, Stack } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Icon from '@mdi/react';
import { mdiReload } from '@mdi/js';
import axiosInstance from 'helpers/apiService';
import apiEndPoints from 'helpers/APIEndPoints';
import { enqueueSnackbar } from 'notistack';

const validationSchema = Yup.object().shape({
    selectedOption: Yup.mixed().required('Please select an option'),
    date: Yup.mixed().when(['selectedOption', 'submitting'], {
        is: (selectedOption, submitting) => selectedOption === 'On' && submitting,
        then: Yup.mixed().required('This field is required when On is selected')
    }),
    day: Yup.mixed().when(['selectedOption', 'submitting'], {
        is: (selectedOption, submitting) => selectedOption === 'Before OR (More Than)' && submitting,
        then: Yup.mixed().when('selectedOption', {
            is: 'Before OR (More Than)',
            then: Yup.mixed().required('This field is required when Before OR (More Than) is selected')
        })
    }),
    emailList: Yup.mixed().when(['selectedOption', 'submitting'], {
        is: (selectedOption, submitting) => selectedOption === 'By Email Address' && submitting,
        then: Yup.mixed().required('This field is required when email is selected')
    })
});

const options = ['On', 'Before OR (More Than)', 'All', 'By Email Address'];

const Update = ({ openUDialog, setOpenUDialog, defaultValues, getDataRender }) => {
    const [receivedData, setReceivedData] = useState({});

    const RemoveData = async (values) => {
        const { selectedOption, Except, date, day } = values;
        const clicked = Except.includes('Clicker') ? '1' : '0';
        const sent = Except.includes('Sent') ? '1' : '0';
        const opened = Except.includes('Opener') ? '1' : '0';
        let value = '';
        if (selectedOption === 'On') {
            value = getConvertedDate(date);
        }
        if (selectedOption === 'Before OR (More Than)') {
            value = day;
        }
        if (values.selectedOption === 'By Email Address') {
            const emails = values.emailList.split(',').map((email) => email.trim());
            value = emails;
        }
        const data = {
            data: {
                deleteBy: selectedOption,
                value,
                clicked,
                sent,
                opened
            }
        };
        try {
            const res = await axiosInstance.delete(`${apiEndPoints.deleteListRecords}/${receivedData?.listid}`, data);
            enqueueSnackbar(`${res?.data?.message}`, { variant: 'success' });
            setTimeout(() => {
                getDataRender();
            }, 500);
            setOpenUDialog(false);
            formik.resetForm();
        } catch (error) {
            enqueueSnackbar(`${error?.response?.data?.msg}`, { variant: 'error' });
        }

    };

    const getConvertedDate = (date) => {
        const dateObject = new Date(date);
        const day = dateObject.getDate();
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObject);
        const year = dateObject.getFullYear();
        return `${day} ${month} ${year}`;
    };

    useEffect(() => {
        setReceivedData(defaultValues);
    }, [defaultValues]);

    const formik = useFormik({
        initialValues: {
            Except: '',
            selectedOption: null,
            date: '',
            day: '',
            emailList: '',
            submitting: false
        },
        validationSchema,
        onSubmit: (values) => {
            formik.setFieldValue('submitting', true);
            if (
                (values.selectedOption === 'Before OR (More Than)' && !values.day) ||
                (values.selectedOption === 'On' && !values.date) ||
                (values.selectedOption === 'By Email Address' && !values.emailList)
            ) {
                return;
            }
            RemoveData(values);
        }
    });

    return (
        <Drawer anchor="right" open={openUDialog}>
            <Box sx={{ m: 1, width: '350px', margin: '24px' }} noValidate autoComplete="off">
                <div>
                    <Typography level="h3"> Update List</Typography>
                </div>
            </Box>
            <Box sx={{ width: '100%', padding: '0px 20px' }}>
                <form onSubmit={formik.handleSubmit}>
                    <Autocomplete
                        id="selectedOption"
                        name="selectedOption"
                        options={options}
                        value={formik.values.selectedOption}
                        onChange={(_, newValue) => formik.setFieldValue('selectedOption', newValue)}
                        renderInput={(params) => (
                            <TextField
                                fullWidth
                                {...params}
                                variant="standard"
                                label="Select an option"
                                error={formik.touched.selectedOption && Boolean(formik.errors.selectedOption)}
                                helperText={formik.touched.selectedOption && formik.errors.selectedOption}
                            />
                        )}
                    />
                    {formik.values.selectedOption === 'On' && (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack spacing={2} sx={{ minWidth: 305, marginTop: 1 }}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker
                                        fullWidth
                                        variant="standard"
                                        name="date"
                                        value={dayjs(formik.values?.date)}
                                        onChange={(newValue) => formik.setFieldValue('date', newValue.$d, true)}
                                    />
                                </DemoContainer>
                            </Stack>
                        </LocalizationProvider>
                    )}
                    {formik.errors.date && <div style={{ color: 'red' }}>{formik.errors.date}</div>}
                    {formik.values.selectedOption === 'Before OR (More Than)' && (
                        <TextField
                            type="number"
                            id="day"
                            name="day"
                            label="Days"
                            variant="standard"
                            fullWidth
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.day}
                        />
                    )}
                    {formik.errors.day && <div style={{ color: 'red' }}>{formik.errors.day}</div>}
                    {formik.values.selectedOption === 'By Email Address' && (
                        <TextField
                            sx={{ mt: 2 }}
                            id="emailList"
                            name="emailList"
                            label="Email List"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={formik.values.emailList}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    )}
                    {formik.errors.emailList && <div style={{ color: 'red' }}>{formik.errors.emailList}</div>}
                    {formik.values.selectedOption === 'On' || formik.values.selectedOption === 'Before OR (More Than)' ? (
                        <FormControl sx={{ mt: 4 }} component="fieldset">
                            <FormLabel component="legend">Except</FormLabel>
                            {['Clicker', 'Sent', 'Opener'].map((option) => (
                                <FormControlLabel
                                    key={option}
                                    control={
                                        <Checkbox
                                            checked={formik.values.Except.includes(option)}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                formik.setFieldValue(
                                                    'Except',
                                                    isChecked
                                                        ? [...formik.values.Except, option]
                                                        : formik.values.Except.filter((item) => item !== option)
                                                );
                                            }}
                                        />
                                    }
                                    label={option}
                                />
                            ))}
                        </FormControl>
                    ) : (
                        <></>
                    )}
                    {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button sx={{ mt: 3 }} variant="outlined" color="primary">
              Count <Icon path={mdiReload} size={1} />
            </Button>
            <Button sx={{ mt: 3 }} variant="outlined" color="primary">
              Count
            </Button>
          </div> */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setOpenUDialog(false);
                                formik.resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button variant="contained" type="submit">
                            Submit
                        </Button>
                    </Box>
                </form>
            </Box>
        </Drawer>
    );
};

export default Update;
