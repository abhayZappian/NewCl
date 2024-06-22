import { Box, Button, Drawer, TextField, Typography } from '@mui/material';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstance from 'helpers/apiService';
import { baseURL } from 'config/envConfig';
import { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { render } from 'react-dom';

const validationSchema = Yup.object().shape({
    vertical_name: Yup.string().required('Vertical field is required')
});

const VerticalDrawer = ({ defaultValues, getDataRender, isDrawerOpen, setIsDrawerOpen }) => {
    console.log(defaultValues, 'editt');
    const defaultValueslength = Object.keys(defaultValues).length;
    console.log(defaultValueslength, 'ccc');

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    const [receivedData, setReceivedData] = useState({});

    console.log(receivedData?.id, 'ttt');

    useEffect(() => {
        setReceivedData(defaultValues);
        if (defaultValues !== undefined && Object.keys(defaultValues).length) {
            formik.setFieldValue('vertical_name', defaultValues?.vertical_name);
        }
    }, [defaultValues]);

    const serializedObject = localStorage?.getItem('userInfo');
    const myObject = JSON.parse(serializedObject);
    var createdByName = myObject.name;
    var createdBy = myObject.id;

    const getData = async (values) => {
        const data = {
            created_by: createdBy,
            creator_name: createdByName,
            vertical_name: values.vertical_name
        };
        const { res } = await axiosInstance.post(`${baseURL}/addVerticalName/`, data);
        enqueueSnackbar('Form Submit Successfully !!!', {
            variant: 'success'
        });
        setIsDrawerOpen(false);
    };
    const getUpdateData = async (values) => {
        const data = {
            created_by: createdBy,
            creator_name: createdByName,
            vertical_name: values.vertical_name
        };
        const { res } = await axiosInstance.put(`${baseURL}/updateVerticalName/${receivedData?.id}`, data);
        enqueueSnackbar('Form Submit Successfully !!!', {
            variant: 'success'
        });
        setIsDrawerOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            vertical_name: ''
        },
        validationSchema,
        onSubmit: (values) => {
            if (defaultValueslength === 0) {
                getData(values);
            } else {
                getUpdateData(values);
            }
        }
    });

    return (
        <>
            <Drawer sx={{ border: '2px solid red' }} anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box
                        sx={{
                            width: '350px',
                            margin: '24px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderTopLeftRadius: '0.5rem',
                                borderTopRightRadius: '0.5rem',
                                color: '#2f2f33'
                            }}
                        >
                            <Typography sx={{ fontWeight: '600', fontSize: '1.2rem' }}>Add Vertical</Typography>
                        </Box>

                        <Box
                            sx={{
                                mt: 3
                            }}
                        >
                            <form onSubmit={formik.handleSubmit}>
                                <div>
                                    <TextField
                                        variant="standard"
                                        fullWidth
                                        label="Vertical Name"
                                        name="vertical_name"
                                        value={formik.values.vertical_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.vertical_name && Boolean(formik.errors.vertical_name)}
                                        helperText={formik.touched.vertical_name && formik.errors.vertical_name}
                                    />
                                </div>
                                <Box
                                    sx={{
                                        marginTop: 3,
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Button type="submit" variant="contained" color="primary">
                                        Add
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};

export default VerticalDrawer;
