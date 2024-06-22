import React from 'react';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Typography } from '@mui/material';
import PageHeader from 'layout/MainLayout/Header/PageHeader';
import axiosInstance from 'helpers/apiService';
import apiEndPoints from 'helpers/APIEndPoints';
import { useState } from 'react';
import SearchTable from './components/table';
import { enqueueSnackbar } from 'notistack';
const validationSchema = Yup.object().shape({
    emailList: Yup.string()
        .required('Please Enter Email')
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\s*,\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/,
            'Invalid Email Format'
        )
});
const SearchEmail = () => {
    const [searchRecords, setSearchRecords] = useState([]);
    const formik = useFormik({
        initialValues: {
            emailList: ''
        },
        validationSchema,
        onSubmit: (values) => {
            const emails = values.emailList.split(',').map((email) => email.trim());
            addSearch({ emails });
            formik.resetForm();
        }
    });
    const addSearch = async (data) => {
        try {
            const res = await axiosInstance.post(apiEndPoints.searchRecordByEmails, data);
            setSearchRecords(res.data.result);
            console.log(res.data, 'aaa');
            // eslint-disable-next-line no-lone-blocks
            {
                res?.data?.status === 'Failed'
                    ? enqueueSnackbar(`${res.data.msg}`, {
                          variant: 'info'
                      })
                    : enqueueSnackbar(`${res.data.msg}`, {
                          variant: 'success'
                      });
            }
        } catch (error) {
            enqueueSnackbar(`${error?.response?.msg}`, {
                variant: 'error'
            });
        }
    };
    return (
        <>
            <PageHeader />
            <Box sx={{ width: '40%', padding: '20px' }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: '500' }}>Use Comma (,) For Separator</Typography>
                <form onSubmit={formik.handleSubmit}>
                    <div style={{ marginTop: '10px' }}>
                        <TextField
                            sx={{ width: '35vw' }}
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
                        {formik.errors.emailList && <div style={{ color: 'red' }}>{formik.errors.emailList}</div>}
                    </div>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '20px',
                            mt: 2
                        }}
                    >
                        <Button
                            variant="outlined"
                            sx={{
                                color: 'color',
                                textTransform: 'capitalize'
                            }}
                            type="button"
                            onClick={formik.handleReset}
                        >
                            Clear
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                color: 'color',
                                textTransform: 'capitalize'
                            }}
                        >
                            Search
                        </Button>
                    </Box>
                </form>
            </Box>
            <SearchTable searchRecords={searchRecords} />
        </>
    );
};
export default SearchEmail;