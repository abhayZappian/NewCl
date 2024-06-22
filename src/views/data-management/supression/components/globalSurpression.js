import { Box, Button, Drawer, TextField, Typography } from '@mui/material';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from 'helpers/apiService';
import apiEndPoints from 'helpers/APIEndPoints';
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
});
// const validationSchema = Yup.object().shape({
//   emailList: Yup.string().matches(
//     /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\s*,\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/,
//     "Invalid email format"
//   ),
//   csvFile: Yup.mixed().test(
//     "atLeastOneField",
//     "At least one field is required",
//     function (value) {
//       const { emailList } = this.parent;
//       return !!value || !!emailList;
//     }
//   ),
// });
const GlobalSuppression = ({ isGDrawerOpen, setIsGDrawerOpen }) => {
    const [selectedFileName, setSelectedFileName] = useState('');
    const [disableButton, setdisableButton] = useState(false);


    const uploadList = async (values) => {
        const emailsArray = values.emailList.split(',').map((email) => email.trim());
        try {
            const data = new FormData();
            data.append('emails', emailsArray);
            data.append('csvFile', values.csvFile);
            const res = await axiosInstance.post(`${apiEndPoints.addGlobalSuppression}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res?.data);
            enqueueSnackbar(`${res?.data?.msg}`, {
                variant: 'success'
            });
            if (res.data.status == 'Success') {
                closeDrawer();
            }
        } catch (error) {
            enqueueSnackbar(`${error?.response?.data?.msg}`, {
                variant: 'error'
            });
        }
    };
    const closeDrawer = () => {
        setIsGDrawerOpen(false);
        formik.resetForm();
        setSelectedFileName('');
    };
    const formik = useFormik({
        initialValues: {
            emailList: '',
            csvFile: null
        },
        // validationSchema,
        onSubmit: (values) => {
            uploadList(values);
        }
    });
    const disableHandler = () => {
        setdisableButton(true);
        setTimeout(() => {
            setdisableButton(false);
        }, 100);
    };

    return (
        <>
            <Drawer anchor="right" open={isGDrawerOpen}>
                <Box sx={{ m: 1, width: '350px', margin: '24px' }} noValidate autoComplete="off">
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: '600',
                                fontSize: '1.2rem',
                                marginBottom: '40px'
                            }}
                        >
                            Add Global Suppression Data
                        </Typography>
                        <form onSubmit={formik.handleSubmit}>
                            <div>
                                <Typography sx={{ marginBottom: '20px' }}>Use new line (,) for separator</Typography>
                                <TextField
                                    multiline
                                    fullWidth
                                    id="emailList"
                                    size="small"
                                    rows={4}
                                    name="emailList"
                                    label="Email List (comma-separated)"
                                    value={formik.values.emailList}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.emailList && Boolean(formik.errors.emailList)}
                                    helperText={formik.touched.emailList && formik.errors.emailList}
                                />
                            </div>

                            <div style={{ marginTop: '25px' }}>
                                <Button
                                disabled={disableButton === true}
                                onClick={() => {
                                    disableHandler();
                                }}
                                    component="label"
                                    variant="contained"
                                    fullWidth
                                    startIcon={<CloudUploadIcon />}
                                    sx={{
                                        backgroundColor: '#E9EEFF',
                                        color: '#000',
                                        marginBottom: '10px',
                                        marginTop: '10px'
                                    }}
                                    type="file"
                                    accept=".csv"
                                    onChange={(event) => {
                                        const selectedFile = event.currentTarget.files[0];
                                        if (selectedFile && selectedFile.type !== 'text/csv') {
                                            enqueueSnackbar('Please select only .csv files.', {
                                                variant: 'error'
                                            });
                                            event.target.value = null;
                                        } else {
                                            formik.setFieldValue('csvFile', selectedFile);
                                            setSelectedFileName(selectedFile ? selectedFile.name : '');
                                        }
                                    }}
                                >
                                    {selectedFileName ? selectedFileName : 'Upload file'}
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept=".csv"
                                        onChange={(event) => {
                                            const selectedFile = event.currentTarget.files[0];
                                            if (selectedFile && selectedFile.type !== 'text/csv') {
                                                enqueueSnackbar('Please select only .csv files.', {
                                                    variant: 'error'
                                                });
                                                event.target.value = null;
                                            } else {
                                                formik.setFieldValue('csvFile', selectedFile);
                                                setSelectedFileName(selectedFile ? selectedFile.name : '');
                                            }
                                        }}
                                    />
                                </Button>

                                <Typography sx={{ display: 'inline' }}>
                                    NOTE:{' '}
                                    <Typography sx={{ display: 'inline', color: '#60E9FF' }}>
                                        {' '}
                                        Select only <Typography sx={{ display: 'inline', color: 'red' }}> (.csv) </Typography> file.
                                    </Typography>
                                </Typography>
                            </div>

                            <div>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mt: 4
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            closeDrawer();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button variant="contained" type="submit">
                                        Submit
                                    </Button>
                                </Box>
                            </div>
                            <Box sx={{ mt: 6 }}>
                                <Typography>
                                    ***Use following header in file: email.
                                    
                                </Typography>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};

export default GlobalSuppression;
