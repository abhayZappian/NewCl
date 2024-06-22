import { Box, Chip, Typography } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { baseURL } from 'config/envConfig';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { setDrawerOpen, setFormData, setListData } from 'store/action/journeyCanvas';
import { useSnackbar } from 'notistack';
import { selectGetFormData, selectListData } from 'store/selectors';
import axiosInstance from 'helpers/apiService';
import apiEndPoints from 'helpers/APIEndPoints';

const validationSchema = Yup.object().shape({
    list: Yup.mixed().required('List name is required'),
    segment: Yup.array().nullable().required('Segment is required')
});

export const IsInFormComponent = () => {
    const dispatch = useDispatch();
    const intialFormData = useSelector(selectGetFormData) || {};
    const listData = useSelector(selectListData);
    console.log(intialFormData);
    const [listOptions, setListOptions] = useState(listData);
    const [segmentOptions, setSegmentOptions] = useState([]);
    const [selectedValue, setselectedValue] = useState(intialFormData.segment || []);

    const { enqueueSnackbar } = useSnackbar();
    // dispatch(setFormData(selectedSegments));

    useEffect(() => {
        if (listData.length === 0) {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            const listResponse = await axiosInstance.get(apiEndPoints.listData);
            const listData = listResponse.data;
            setListOptions(listData);
            dispatch(setListData(listData));
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const fetchSegmentDataByListId = async (listid) => {
        try {
            const response = await axiosInstance.get(`${baseURL}/cl/apis/v1/segment/${listid}`);
            const segmentData = response.data;
            setSegmentOptions(segmentData);
        } catch (error) {
            console.log('error', error);
        }
    };

    const formik = useFormik({
        initialValues: {
            list: intialFormData.list || '',

            segment: intialFormData.segment || []
        },
        validationSchema,
        onSubmit: (values) => {
            // debugger;
            const formData = {
                ...values,
                segment: selectedValue || []
            };
            dispatch(setFormData(formData));
            enqueueSnackbar('Form Submit Successfully !!!', {
                variant: 'success'
            });
            dispatch(setDrawerOpen(false));
        }
    });
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
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
                        <Typography variant="h4">Is In Form</Typography>
                    </div>
                    <div>
                        <Autocomplete
                            id="list"
                            options={listOptions}
                            value={listOptions.find((option) => option.list_name === formik.values.list) || null}
                            getOptionLabel={(option) => `${option.list_name} (${option.records})`}
                            onChange={(e, newValue) => {
                                const selectedList = newValue ? newValue.list_name : '';
                                formik.setFieldValue('segment', null);
                                formik.setFieldValue('list', selectedList);
                                setselectedValue([]);
                                if (newValue) {
                                    fetchSegmentDataByListId(newValue.listid);
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label="List" variant="standard" />}
                        />

                        {formik.touched.list && formik.errors.list && (
                            <div style={{ color: 'red' }} className="error">
                                {formik.errors.list}
                            </div>
                        )}
                    </div>
                    <div>
                        <Autocomplete
                            sx={{ marginTop: 1 }}
                            size="small"
                            id="segment"
                            multiple
                            options={segmentOptions}
                            value={selectedValue}
                            getOptionLabel={(option) => `${option.segment_name} (${option.count})`}
                            onChange={(e, value) => {
                                setselectedValue(value);
                                formik.setFieldValue('segment', value ? value.map((option) => option.segment_name) : []);
                            }}
                            renderInput={(params) => <TextField {...params} label="Select Value" variant="standard" />}
                            isOptionEqualToValue={(option, value) => option.segmentid === value.segmentid}
                            renderOption={(props, option) => <li {...props}>{`${option.segment_name} (${option.count})`}</li>}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip label={option.segment_name} {...getTagProps({ index })} color="primary" />
                                ))
                            }
                        />
                    </div>
                    {formik.errors.segment && <div style={{ color: 'red' }}>{formik.errors.segment}</div>}
                    <br />
                    <Box>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    dispatch(setFormData({ list: '', segment: [] }));
                                    formik.resetForm();
                                    setselectedValue([]);
                                    formik.setFieldValue('list', '');
                                    formik.setFieldValue('segment', []);
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </Box>
                </Box>
            </form>
        </div>
    );
};
