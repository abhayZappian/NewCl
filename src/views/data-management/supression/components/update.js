import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Autocomplete, Box, Stack, Drawer, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { enqueueSnackbar } from 'notistack';
import axiosInstance from 'helpers/apiService';
import apiEndPoints from 'helpers/APIEndPoints';

const validationSchema = Yup.object().shape({
  selectedOption: Yup.mixed().required("Please Select An Option"),
  date: Yup.mixed().when(["selectedOption", "submitting"], {
    is: (selectedOption, submitting) => selectedOption === "On" && submitting,
    then: Yup.mixed().required("This Field Is Required when On Is Selected"),
  }),
  day: Yup.mixed().when(["selectedOption", "submitting"], {
    is: (selectedOption, submitting) =>
      selectedOption === "Before OR (More Than)" && submitting,
    then: Yup.mixed().when("selectedOption", {
      is: "Before OR (More Than)",
      then: Yup.mixed().required(
        "This Field Is Required when Before OR (More Than) is Selected"
      ),
    }),
  }),
  emailList: Yup.mixed().when(["selectedOption", "submitting"], {
    is: (selectedOption, submitting) =>
      selectedOption === "By Email Address" && submitting,
    then: Yup.mixed().required("This Field Is Required when email is selected"),
  }),
});
const options = ['On', 'Before OR (More Than)', 'All', 'By Email Address'];

const Update = ({ openDialog, setOpenDialog, defaultValues, getDataRender }) => {
    const RemoveData = async (values) => {
        const getConvertedDate = (date) => {
            const dateObject = new Date(date);
            const day = dateObject.getDate();
            const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObject);
            const year = dateObject.getFullYear();
            return `${day} ${month} ${year}`;
        };
        let value = '';
        if (values.selectedOption === 'On') {
            value = getConvertedDate(values.date);
        }
        if (values.selectedOption === 'By Email Address') {
            const emails = values.emailList.split(',').map((email) => email.trim());
            value = emails;
        }
        if (values.selectedOption === 'Before OR (More Than)') {
            value = values.day;
        }
        const data = {
            data: {
                deleteBy: values.selectedOption,
                value
            }
        };

        try {
            const res = await axiosInstance.delete(`${apiEndPoints.deleteSuppressionListRecords}/${defaultValues?.listid}`, data);
            console.log(res);
            enqueueSnackbar(`${res?.data?.message}`, {
                variant: 'success'
            });
            setTimeout(() => {
                getDataRender();
            }, 500);
            setOpenDialog(false);
            formik.resetForm();
        } catch (error) {
            enqueueSnackbar(`${error?.res?.data?.message}`, {
              variant: "error",
            });
        }
    };

    const formik = useFormik({
        initialValues: {
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
        <Drawer anchor="right" open={openDialog}>
            <Box
                sx={{
                    m: 1,
                    width: '350px',
                    margin: '24px'
                }}
                noValidate
                autoComplete="off"
            >
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
                        onChange={(_, newValue) => {
                            formik.setFieldValue('selectedOption', newValue);
                        }}
                        renderInput={(params) => (
                            <TextField
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setOpenDialog(false);
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
