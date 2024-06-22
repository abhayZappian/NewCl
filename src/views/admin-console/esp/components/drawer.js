import { Autocomplete, Box, Button, Drawer, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { createdByName, createdBy } from '../../../../helpers/userInfo';
import { getESPdetails } from 'services/presets/pool';
import { height } from '@mui/system';
import { ESPAction, addEspAccount, editEspAccount, getAllEspProviderAccount } from 'services/adminConsole/esp';

const validationSchema = Yup.object().shape({
    espId: Yup.mixed().required('ESP is required'),
    accountName: Yup.string().trim().required('Account name is required'),
    userId: Yup.string().trim().required('User ID is required'),
    fromDomain: Yup.string()
        .trim()
        .required('From domain is required')
        .matches(/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/i, 'Invalid domain format'),
    replyTo: Yup.string()
        .trim()
        .required('Reply to is required')
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid email address'),
    password: Yup.string()
        .trim()
        .when('apikey', {
            is: (apikey) => !apikey || apikey.trim() === '',
            then: Yup.string().required('Password is required when API Key is empty')
        }),
    apikey: Yup.string().trim()
});

const EspDrawer = ({ defaultValues, setDefaultValues, addNetworkDataRender, isDrawerOpen, setIsDrawerOpen, getDataRender }) => {
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [EspList, setEspList] = useState([]);
    const [data, setData] = useState([]);
    const [receivedData, setReceivedData] = useState({});

    const defaultValueslength = Object.keys(defaultValues).length;

    const getESP = async () => {
        const { data } = await getESPdetails();
        setEspList(data);
    };
    const getAllEspProviderAccountDetails = async () => {
        const { data } = await getAllEspProviderAccount();
        setData(data);
    };
    useEffect(() => {
        getESP();
        getAllEspProviderAccountDetails();
    }, []);
    const updateESPDetails = async (data) => {
        try {
            // debugger
            setButtonDisabled(true);
            await editEspAccount(data, receivedData.esp_account_id);
            getDataRender();
        } catch (error) {
            setButtonDisabled(false);
        }
    };
    const formik = useFormik({
        initialValues: {
            espId: '',
            accountName: '',
            userId: '',
            password: '',
            apikey: '',
            fromDomain: '',
            replyTo: ''
        },
        validationSchema,
        onSubmit: (values) => {
            //   addEspAccount({ ...values, createdBy });
            if (defaultValueslength === 0) {
                const data = {
                    espId: values.espId,
                    accountName: values.accountName.trim(),
                    userId: values.userId.trim(),
                    password: values.password.trim(),
                    apikey: values.apikey.trim(),
                    fromDomain: values.fromDomain.trim(),
                    replyTo: values.replyTo.trim(),
                    createdByName: createdByName,
                    createdBy: createdBy
                };
                addEspAccountDetail(data);
            } else {
                const data = {
                    espId: values.espId,
                    accountName: values.accountName.trim(),
                    userId: values.userId.trim(),
                    password: values.password.trim(),
                    apikey: values.apikey.trim(),
                    fromDomain: values.fromDomain.trim(),
                    replyTo: values.replyTo.trim()
                };
                updateESPDetails(data);
                setButtonDisabled(true);
            }
        }
    });
    const addEspAccountDetail = async (data) => {
        try {
            setButtonDisabled(true);
            await addEspAccount(data);
            getDataRender();
        } catch (error) {
            setButtonDisabled(false);
        }
    };
    useEffect(() => {
        setReceivedData(defaultValues);
        if (defaultValues && Object.keys(defaultValues).length) {
            setFieldValues(defaultValues);
        } else {
            formik.resetForm();
        }
    }, [defaultValues]);
    const setFieldValues = (values) => {
        formik.setFieldValue('espId', values?.row_data ? JSON.parse(values?.row_data) : null);
        formik.setFieldValue('accountName', values?.account_name);
        formik.setFieldValue('userId', values?.user_id);
        formik.setFieldValue('password', values?.password ? values.password : '');
        formik.setFieldValue('apikey', values?.api_key ? values?.api_key : '');
        formik.setFieldValue('fromDomain', values?.from_domain);
        formik.setFieldValue('replyTo', values?.reply_to);
    };
    return (
        <Drawer anchor="right" open={isDrawerOpen}>
            <Box sx={{ m: 1, width: '350px', margin: '24px' }} noValidate autoComplete="off">
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <Typography
                            sx={{
                                fontWeight: '600',
                                fontSize: '1.3rem',
                                mt: 4
                            }}
                        >
                            {defaultValueslength === 0 ? 'Add ESP Account' : 'Update ESP Account'}
                        </Typography>

                        <div>
                            <div style={{}}>
                                <Autocomplete
                                    fullWidth
                                    disableClearable
                                    id=" espId"
                                    name=" espId"
                                    options={EspList}
                                    value={formik.values.espId || null}
                                    getOptionLabel={(option) => option.esp_name}
                                    onChange={(event, newValue) => {
                                        formik.setFieldValue('espId', newValue);
                                    }}
                                    onBlur={formik.handleBlur}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="For ESP"
                                            variant="standard"
                                            error={formik.touched.espId && Boolean(formik.errors.espId)}
                                            helperText={formik.touched.espId && formik.errors.espId}
                                        />
                                    )}
                                />
                            </div>
                            <div
                                style={{
                                    width: '350px'
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    label="ESP Account Name"
                                    name="accountName"
                                    value={formik.values.accountName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.accountName && Boolean(formik.errors.accountName)}
                                    helperText={formik.touched.accountName && formik.errors.accountName}
                                />
                            </div>
                        </div>
                        <div style={{ width: '350px' }}>
                            <TextField
                                fullWidth
                                variant="standard"
                                label="User ID"
                                name="userId"
                                value={formik.values.userId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.userId && Boolean(formik.errors.userId)}
                                helperText={formik.touched.userId && formik.errors.userId}
                            />
                        </div>
                        <div style={{ width: '350px' }}>
                            <TextField
                                fullWidth
                                variant="standard"
                                label="Password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        </div>
                        <div style={{ width: '350px' }}>
                            <TextField
                                fullWidth
                                variant="standard"
                                label="API Key"
                                name="apikey"
                                value={formik.values.apikey}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.apikey && Boolean(formik.errors.apikey)}
                                helperText={formik.touched.apikey && formik.errors.apikey}
                            />
                        </div>
                        <div style={{ width: '350px' }}>
                            <TextField
                                fullWidth
                                variant="standard"
                                label="From Domain"
                                name="fromDomain"
                                value={formik?.values?.fromDomain}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.fromDomain && Boolean(formik.errors.fromDomain)}
                                helperText={formik.touched.fromDomain && formik.errors.fromDomain}
                            />
                        </div>
                        <div style={{ width: '350px' }}>
                            <TextField
                                fullWidth
                                variant="standard"
                                label="Replay To mail"
                                name="replyTo"
                                value={formik.values.replyTo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.replyTo && Boolean(formik.errors.replyTo)}
                                helperText={formik.touched.replyTo && formik.errors.replyTo}
                            />
                        </div>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 4
                            }}
                        >
                            <Button
                                onClick={() => {
                                    setIsDrawerOpen(false);
                                    // setFieldValues(defaultValues);
                                    formik.resetForm();
                                    setDefaultValues({});
                                }}
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    // setDefaultValues({});
                                }}
                                disabled={isButtonDisabled}
                                variant="contained"
                                type="submit"
                            >
                                Submit
                            </Button>
                        </Box>
                    </form>
                </div>
            </Box>
        </Drawer>
    );
};

export default EspDrawer;
