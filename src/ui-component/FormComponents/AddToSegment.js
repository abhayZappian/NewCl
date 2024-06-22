import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { Typography } from '@mui/joy';
import axiosInstance from 'helpers/apiService';
import apiEndPoints from 'helpers/APIEndPoints';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDrawerOpen, setFormData, setListData } from 'store/action/journeyCanvas';
import { enqueueSnackbar } from 'notistack';
import { selectGetFormData, selectListData } from 'store/selectors';
import { createdByName, createdBy } from '../../helpers/userInfo';

const validationSchema = Yup.object().shape({
    list: Yup.mixed().required('List required')
});
const validationSchemaNew = Yup.object().shape({
    listName: Yup.string()
        .trim()
        .required('List Name  required')
        .matches(/^[^\s]+(\s[^\s]+)*$/, 'Only one space is allowed between words ')
    // description: Yup.string()
    //     .trim()
    //     .required('Discription  required')
    //     .matches(/^[^\s]+(\s[^\s]+)*$/, 'Only one space is allowed between words ')
});

export const AddToSegment = () => {
    const dispatch = useDispatch();
    const listData = useSelector(selectListData);
    const intialFormData = useSelector(selectGetFormData) || {};

    const [data, setData] = useState(listData);
    const [selectedOption, setselectedOption] = useState('Existing');

    const getData = async () => {
        const { data } = await axiosInstance.get(apiEndPoints.listData);
        setData(data);
        dispatch(setListData(data));
    };
    const addList = async (data) => {
        try {
            const res = await axiosInstance.post(apiEndPoints.addList, data);
            console.log(res);
            getData();
            // dispatch(setDrawerOpen(false));
            enqueueSnackbar(res?.data?.msg, {
                variant: 'success'
            });
            formik.setFieldValue('type', 'Existing');
            formik.setFieldValue('listName',"");
            formik.setFieldValue('list',"");
            setselectedOption("Existing")
            
        } catch (error) {
            enqueueSnackbar(`${error?.response?.data?.msg}`, {
                variant: 'error'
            });
        }
    };

    useEffect(() => {
        if (listData.length === 0) {
            getData();
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            listName: intialFormData.listName || '',
            type: 'Existing',
            description: 'description',
            list: intialFormData.list || ''
        },
        validationSchema: selectedOption === 'Existing' ? validationSchema : validationSchemaNew,
        onSubmit: (values) => {
            if (values.type === 'New') {
                const data = {
                    type: values.type,
                    listName: values?.listName.trim(),
                    description: 'description'
                };
                console.log(data, 'new data.............');
                dispatch(setFormData(data));
                const addListData = {
                    list_name: values?.listName,
                    created_by: createdBy,
                    created_by_name: createdByName,
                    country_id: '1',
                    country_name: 'IND'
                };
                addList(addListData);
            } else {
                const data = {
                    type: values.type,
                    list: values.list
                };
                console.log(data, 'existing data');
                dispatch(setFormData(data));
                enqueueSnackbar('Form Submit Successfully !!!', {
                    variant: 'success'
                });
                dispatch(setDrawerOpen(false));
            }
        }
    });
    return (
        <form onSubmit={formik.handleSubmit}>
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
                        <Typography level="h4"> Add To List Form </Typography>
                    </div>

                    <div>
                        <div>
                            <FormControl component="fieldset" sx={{ marginTop: 3 }}>
                                <RadioGroup
                                    row
                                    aria-label="options"
                                    name="options"
                                    value={formik.values?.type}
                                    onChange={(e) => {
                                        console.log(e.target.value, 'e.target.value..............');
                                        formik.setFieldValue('type', e.target.value, true);
                                        setselectedOption(e.target.value);
                                    }}
                                >
                                    <FormControlLabel name="type" value="Existing" control={<Radio />} label="Select List" />
                                    <FormControlLabel name="type" value="New" control={<Radio />} label="Create List" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                    {formik.values.type === 'Existing' && (
                        <>
                            <div>
                                <Autocomplete
                                    fullWidth
                                    id="list"
                                    name="list"
                                    options={data}
                                    value={data.find((option) => option.list_name === formik.values.list.list_name) || null}
                                    getOptionLabel={(option) => `${option.list_name} (${option.records})`}
                                    onChange={(e, newValue) => {
                                        const selectedList = newValue ? newValue : '';
                                        formik.setFieldValue('list', selectedList);
                                    }}
                                    onBlur={formik.handleBlur}
                                    renderInput={(params) => <TextField {...params} label=" Select List" variant="standard" />}
                                />
                            </div>
                            {formik.errors.list && <div style={{ color: 'red' }}>{formik.errors.list}</div>}
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button sx={{ mt: 4 }} type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>
                                <Button
                                    sx={{ mt: 4 }}
                                    onClick={() => {
                                        dispatch(
                                            setFormData({
                                                type: 'Existing',
                                                list: ''
                                            })
                                        );
                                        formik.resetForm();
                                        formik.setFieldValue('list', '', true);
                                    }}
                                    variant="outlined"
                                    color="primary"
                                >
                                    Reset
                                </Button>
                            </div>
                        </>
                    )}
                    {formik.values.type === 'New' && (
                        <>
                            <div>
                                <TextField
                                    id="listName"
                                    name="listName"
                                    label="Create List "
                                    variant="standard"
                                    fullWidth
                                    value={formik.values.listName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.errors.listName && <div style={{ color: 'red' }}>{formik.errors.listName}</div>}
                            {/* <div>
                                <TextField
                                    sx={{ marginTop: 1 }}
                                    id="description"
                                    name="description"
                                    label="Description"
                                    variant="standard"
                                    fullWidth
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div> */}
                            {/* {formik.errors.description && <div style={{ color: 'red' }}>{formik.errors.description}</div>} */}
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button sx={{ mt: 4 }} type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>
                                <Button
                                    sx={{ mt: 4 }}
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                        dispatch(
                                            setFormData({
                                                listName: '',
                                                type: 'New',
                                                description: '',
                                                list: ''
                                            })
                                        );
                                        formik.resetForm();
                                        formik.setFieldValue('listName', '', true);
                                        formik.setFieldValue('description', '', true);
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        </>
                    )}
                </Box>
            </div>
        </form>
    );
};
