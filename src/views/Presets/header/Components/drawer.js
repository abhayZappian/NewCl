import { Box, Button, Drawer, TextField } from '@mui/material';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { useState } from 'react';
import { Typography } from '@mui/joy';
import { addHeader, headerUpdateData } from 'services/presets/header';
import { createdByName, createdBy } from '../../../../helpers/userInfo';
const validationSchema = Yup.object().shape({
    header_name: Yup.string()
        .trim()
        .required('Header Name  required')
        .matches(/^[^\s]+(\s[^\s]+)*$/, 'Only one space is allowed between words '),
    header_message: Yup.string()
        .trim()
        .required('Header Text  required')
        .matches(/^[^\s]+(\s[^\s]+)*$/, 'Only one space is allowed between words ')
});

const HeaderDrawer = ({ defaultValues, openActive, setOpenActive, getDataRender }) => {
    const defaultValueslength = Object.keys(defaultValues).length;
    const [receivedData, setReceivedData] = useState({});
    const [isButtonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        setReceivedData(defaultValues);
        if (defaultValues !== undefined && Object.keys(defaultValues).length) {
            setFieldValues(defaultValues);
        } else {
            formik.resetForm();
        }
    }, [defaultValues]);

    const setFieldValues = (values) => {
        formik.setFieldValue('header_name', defaultValues?.header_name ? defaultValues?.header_name : '');
        formik.setFieldValue('header_message', defaultValues?.header_message ? defaultValues?.header_message : '');
        setTimeout(() => {
            formik.validateField('header_name');
            formik.validateField('header_message');
        }, 0);
    };

    const getData = async (data) => {
        try {
            const res = await addHeader(data);
            if (res) {
                setOpenActive({ drawer: false });
                getDataRender();
            }
            setButtonDisabled(false);
        } catch (error) {
            setButtonDisabled(false);
        }
    };
    const getUpdateData = async (data) => {
        try {
            const res = await headerUpdateData(receivedData?.id, data);
            if (res) {
                setOpenActive({ drawer: false });
                getDataRender();
            }
            setButtonDisabled(false);
        } catch (error) {
            setButtonDisabled(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            header_name: '',
            header_message: ''
        },

        validationSchema,
        onSubmit: (values) => {
            const data = {
                headerDetails: {
                    created_by: createdBy,
                    creator_name: createdByName,
                    header_name: values.header_name.trim(),
                    header_message: values.header_message.trim()
                }
            };

            if (defaultValueslength === 0) {
                getData(data);
                setButtonDisabled(true);
            } else {
                getUpdateData(data);
                setButtonDisabled(true);
            }
        }
    });
    return (
        <>
            <Drawer anchor="right" open={openActive}>
                <Box sx={{ m: 1, width: '350px', margin: '24px' }} noValidate autoComplete="off">
                    <div></div>
                    <div>
                        <form onSubmit={formik.handleSubmit}>
                            <Typography
                                sx={{
                                    fontWeight: '600',
                                    fontSize: '1.3rem',
                                    mt: 4
                                }}
                            >
                                Add Email Header
                            </Typography>
                            <Box>
                                <div style={{ width: '330px' }}>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        label="Header Name"
                                        name="header_name"
                                        value={formik.values.header_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.header_name && formik.errors.header_name && (
                                        <div style={{ color: 'red' }}>{formik.errors.header_name}</div>
                                    )}
                                </div>

                                <div style={{ width: '330px' }}>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        label="Header Text"
                                        name="header_message"
                                        value={formik.values.header_message}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.header_message && formik.errors.header_message && (
                                        <div style={{ color: 'red' }}>{formik.errors.header_message}</div>
                                    )}
                                </div>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setOpenActive({ drawer: false });
                                        setFieldValues(defaultValues);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button disabled={isButtonDisabled} variant="contained" type="submit">
                                    Submit
                                </Button>
                            </Box>
                        </form>
                    </div>
                </Box>
            </Drawer>
        </>
    );
};

export default HeaderDrawer;
