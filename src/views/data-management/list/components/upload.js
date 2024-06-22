import React from 'react';
import { Box, Button, Drawer, IconButton, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import axiosInstance from 'helpers/apiService';
import apiEndPoints from 'helpers/APIEndPoints';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';

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
const Upload = ({ defaultValues, isGDrawerOpen, setIsGDrawerOpen, getDataRender }) => {
    const [selectedFileName, setSelectedFileName] = useState('');
    const serializedObject = localStorage?.getItem('userInfo');
    const { name: createdByName, id: createdBy } = JSON.parse(serializedObject);
    const [disableButton, setdisableButton] = useState(false);

    const uploadList = async (values) => {
        const emailsArray = values.emailList.split(',').map((email) => email.trim());
        try {
            const data = new FormData();
            data.append('emails', emailsArray);
            data.append('uploaded_by', createdBy);
            data.append('uploaded_by_name', createdByName);
            data.append('csvFile', values.csvFile);
            const res = await axiosInstance.post(`${apiEndPoints.updateDataToList}/${defaultValues?.listid}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            enqueueSnackbar(`${res?.data?.msg}`, {
                variant: 'success'
            });
            setIsGDrawerOpen(false);
            formik.resetForm();
            setSelectedFileName('');
            setTimeout(() => {
                getDataRender();
            }, 300);
        } catch (error) {
            enqueueSnackbar(`${error?.response?.data?.msg}`, {
                variant: 'error'
            });
        }
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
        <Drawer anchor="right" open={isGDrawerOpen}>
            <Box sx={{ m: 1, width: '350px', margin: '24px' }} noValidate autoComplete="off">
                <Box>
                    <Typography sx={{ fontWeight: '600', fontSize: '1.2rem', marginBottom: '40px' }}>Upload File</Typography>
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setIsGDrawerOpen(false);
                                    setSelectedFileName('');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button variant="contained" type="submit">
                                Submit
                            </Button>
                        </Box>
                        <Box sx={{ mt: 6 }}>
                            <Typography>
                                ***Use following header in file: email, md5, firstname, lastname, sourceurl, ip, location, date, time,
                                address1, address2, city, state, country, zipcode, type, carrier, homephone, mobile, workphone, dob, gender.
                            </Typography>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Drawer>
    );
};
export default Upload;
