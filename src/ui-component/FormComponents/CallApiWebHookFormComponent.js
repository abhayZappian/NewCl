import React, { useState } from 'react';
import { Typography, Box, Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Autocomplete from '@mui/material/Autocomplete';
import axiosInstance from 'helpers/apiService';
import apiEndPoints from 'helpers/APIEndPoints';
import { useEffect } from 'react';
import { setDrawerOpen, setFormData, setWebHook } from 'store/action/journeyCanvas';
import { enqueueSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { selectGetFormData, selectWebHook } from 'store/selectors';
const validationSchema = Yup.object({
    callApi: Yup.array().min(1, 'Call API list is required').required('Call API list is required')
});

export const CallApiWebHookFormComponent = () => {
    const intialFormData = useSelector(selectGetFormData) || {};
    const webHookData = useSelector(selectWebHook) || [];
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const getData = async () => {
        const { data } = await axiosInstance.get(apiEndPoints.getCallApi);
        setData(data);
        dispatch(setWebHook(data));
    };
    useEffect(() => {
        if (webHookData.length === 0) {
            getData();
        } else {
            setData(webHookData);
        }
    }, []);

    const [selectedOptions, setSelectedOptions] = useState(intialFormData.callApi || []);

    const formik = useFormik({
        initialValues: {
            callApi: intialFormData.callApi || []
        },
        validationSchema,
        onSubmit: (values) => {
            const data = {
                callApi: selectedOptions
            };
            // console.log(data);
            dispatch(setFormData(data));
            enqueueSnackbar('Form Submit Successfully !!!', {
                variant: 'success'
            });
            dispatch(setDrawerOpen(false));
        }
    });

    return (
        <div>
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
                    <Typography variant="h4">Call Api Form</Typography>
                </div>
                {console.log(selectedOptions)}
                <div>
                    <Autocomplete
                        sx={{ marginTop: 1 }}
                        multiple
                        id="callApi"
                        name="callApi"
                        options={data}
                        value={selectedOptions}
                        onChange={(e, newValue) => {
                            console.log(newValue, 'valuw....................');
                            setSelectedOptions(newValue);
                            formik.setFieldValue('callApi', newValue);
                        }}
                        getOptionLabel={(option) => `${option.label}`}
                        renderInput={(params) => <TextField {...params} label="Call API List" variant="standard" />}
                    />
                    {formik.touched.callApi && formik.errors.callApi ? (
                        <Typography variant="body2" color="error">
                            {formik.errors.callApi}
                        </Typography>
                    ) : null}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button sx={{ mt: 3 }} type="submit" variant="contained" color="primary" onClick={formik.handleSubmit}>
                        Submit
                    </Button>
                    <Button
                        sx={{ mt: 3 }}
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            formik.resetForm();
                            setSelectedOptions([]);
                            dispatch(setFormData('callApi', []));
                            formik.setFieldValue('callApi', []);
                            formik.resetForm();
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </Box>
        </div>
    );
};
