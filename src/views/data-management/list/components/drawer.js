import { Autocomplete, Box, Button, Drawer, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { selectCacheListName, selectCountryList } from 'store/selectors';
import { setCacheListName, setCountryList } from 'store/action/journeyCanvas';
import { useEffect, useState } from 'react';
import axiosInstance from 'helpers/apiService';
import { enqueueSnackbar } from 'notistack';
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
const validationSchema = Yup.object().shape({
    list_name: Yup.string().required('List Name  Required'),
    countryId: Yup.mixed().required('Country  Required')
});
const ListDrawer = ({ defaultValues, isDrawerOpen, setIsDrawerOpen, getDataRender, isEdit, setEdit }) => {
    const { id: createdBy, name: createdByName } = JSON.parse(localStorage?.getItem('userInfo')) || {};
    const Dispatch = useDispatch();
    const countryList = useSelector(selectCountryList) || {};
    const [receivedData, setReceivedData] = useState({});
    const [listNameError, setListNameError] = useState('');
    const [selectedFileName, setSelectedFileName] = useState('');
    const [disableButton, setdisableButton] = useState(false);
    const defaultValueslength = Object.keys(defaultValues).length;
    const searchCache = useSelector(selectCacheListName) || {};
    const [isButtonDisabled, setButtonDisabled] = useState(false);

    const checkListNameExists = async (listName) => {
        try {
            const response = await axiosInstance.post(apiEndPoints.checkListNameExistence, { list_name: listName });
            setListNameError(
                response.data.status ? 'List name already exists for this name is in deleted list so please use different name.' : ''
            );
            Dispatch(
                setCacheListName({
                    [formik.values.list_name]: response.data.status
                })
            );
        } catch (error) {
            console.error(error);
        }
    };
    const handleListNameChange = async (event) => {
        const listName = formik.values.list_name;
        if (listName && listName !== defaultValues?.list_name) {
            await checkListNameExists(listName);
        }
    };

    const getCountryName = async () => {
        try {
            const response = await axiosInstance.get(apiEndPoints.getAllCountries);
            Dispatch(setCountryList(response.data.allCountries));
        } catch (error) {
            console.error(error);
        }
    };

    const addList = async (values) => {
        try {
            const data = new FormData();
            data.append('created_by', createdBy);
            data.append('created_by_name', createdByName);
            data.append('list_name', values.list_name);
            data.append('country_id', values.countryId?.countryId);
            data.append('country_name', values.countryId?.countryName);
            data.append('csvFile', values.csvFile);
            const response = await axiosInstance.post(apiEndPoints.addList, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            enqueueSnackbar('Form Submit Successfully !!!', {
                variant: 'success'
            });
            getDataRender();
            onDrawerClose();
            setButtonDisabled(false);
        } catch (error) {
            enqueueSnackbar(`${error?.response?.data?.msg}`, {
                variant: 'error'
            });
            setButtonDisabled(false);
        }
    };
    const setFieldValues = (values) => {
        formik.setFieldValue('list_name', defaultValues?.list_name ? defaultValues?.list_name : '');
        formik.setFieldValue('countryId', {
            countryName: defaultValues?.country_name ? defaultValues?.country_name : '',
            countryId: defaultValues?.country_id ? defaultValues?.country_id : ''
        });
        setTimeout(() => {
            formik.validateField('list_name');
            formik.validateField('countryId');
        }, 0);
    };

    const updateList = async (values) => {
        try {
            const data = new FormData();
            data.append('edit_by', createdBy);
            data.append('edited_by_name', createdByName);
            data.append('list_name', values.list_name);
            data.append('country_id', values.countryId?.countryId);
            data.append('country_name', values.countryId?.countryName);
            const { res } = await axiosInstance.put(`${apiEndPoints.updateListName}/${receivedData?.listid}`, data);
            enqueueSnackbar('Form Updated Successfully !!!', {
                variant: 'success'
            });
            getDataRender();
            setIsDrawerOpen(false);
            setButtonDisabled(false);
            formik.resetForm()   
        } catch (error) {
            enqueueSnackbar(`${error?.response?.data?.msg}`, {
                variant: 'error'
            });
            setButtonDisabled(false);
        }
    };
    const formik = useFormik({
        initialValues: {
            list_name: '',
            countryId: null,
            csvFile: null
        },
        validationSchema,
        onSubmit: (values) => {
            if (defaultValueslength === 0) {
                addList(values);
                setButtonDisabled(true);
            } else {
                updateList(values);
                setButtonDisabled(true);
                
            }
        }
    });
    useEffect(() => {
        if (countryList.length === 0) {
            getCountryName();
        }
    }, [countryList]);
    useEffect(() => {
        setReceivedData(defaultValues);
        if (defaultValues && Object.keys(defaultValues).length) {
            setFieldValues(defaultValues);
        } else {
            formik.setFieldValue();
        }
    }, [defaultValues]);

    useEffect(() => {
        if (isDrawerOpen && !isEdit) {
            formik.resetForm();
        }
    }, [isEdit, isDrawerOpen]);

    useEffect(() => {
        setListNameError('');
        const timer = setTimeout(() => {
            const cachedResult = searchCache
                .map((e) => Object.keys(e))
                .flat()
                .includes(formik.values.list_name);
            if (cachedResult) {
                function getObjectWithValue(array, key) {
                    for (let obj of array) {
                        if (obj[key] === true) {
                            return obj;
                        }
                    }
                    return null;
                }
                let resultObject = getObjectWithValue(searchCache, formik.values.list_name);
                if (resultObject && !Object.keys(resultObject).includes(defaultValues?.list_name)) {
                    setListNameError('List name already exists for this name is in deleted list so please use different name.');
                } else {
                    console.log(`No object found with key '${formik.values.list_name}' and value 'true'.`);
                    setListNameError('');
                }
                console.log('optimize..............');
            } else {
                handleListNameChange();
            }
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [formik?.values?.list_name]);
    const onDrawerClose = () => {
        if (isEdit === true) {
            setSelectedFileName('');
            setIsDrawerOpen(false);
            setEdit(false);
            setFieldValues(defaultValues);
        } else {
            setSelectedFileName('');
            setIsDrawerOpen(false);
        }
    };
    const disableHandler = () => {
        setdisableButton(true);
        setTimeout(() => {
            setdisableButton(false);
        }, 100);
    };

    return (
        <Drawer anchor="right" open={isDrawerOpen}>
            <Box sx={{ m: 1, width: '350px', margin: '24px' }} noValidate autoComplete="off">
                <Box>
                    <form onSubmit={formik.handleSubmit}>
                        <Typography
                            sx={{
                                fontWeight: '600',
                                fontSize: '1.2rem',
                                marginBottom: '40px'
                            }}
                        >
                            Add List
                        </Typography>
                        <div>
                            <TextField
                                label="List Name"
                                name="list_name"
                                fullWidth
                                variant="standard"
                                value={formik.values.list_name}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    // await handleListNameChange(e);
                                }}
                                onBlur={formik.handleBlur}
                                error={formik.touched.list_name && Boolean(formik.errors.list_name)}
                                helperText={formik.touched.list_name && formik.errors.list_name}
                            />
                            {listNameError && <div style={{ color: 'red', marginTop: '5px' }}>{listNameError}</div>}
                        </div>
                        <div style={{ width: '350px' }}>
                            <Autocomplete
                                sx={{ marginTop: 1 }}
                                id="countryId"
                                name="countryId"
                                options={countryList}
                                value={formik.values.countryId}
                                getOptionLabel={(option) => `${option.countryName} `}
                                onChange={(e, newValue) => {
                                    formik.setFieldValue('countryId', newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        fullWidth
                                        {...params}
                                        label="Country"
                                        variant="standard"
                                        error={formik.touched.countryId && Boolean(formik.errors.countryId)}
                                        helperText={formik.touched.countryId && formik.errors.countryId}
                                    />
                                )}
                            />
                        </div>
                        <div
                            style={{
                                marginTop: '25px',
                                display: defaultValueslength > 0 ? 'none' : 'block'
                            }}
                        >
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
                                    onDrawerClose();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button disabled={isButtonDisabled} variant="contained" type="submit">
                                Submit
                            </Button>
                        </Box>
                        {/* <Box sx={{ mt: 6 }}>
                            <Typography>
                                ***Use following header in file: email, md5, firstname, lastname, sourceurl, ip, location, date, time,
                                address1, address2, city, state, country, zipcode, type, carrier, homephone, mobile, workphone, dob, gender.
                            </Typography>
                        </Box> */}
                    </form>
                </Box>
            </Box>
        </Drawer>
    );
};
export default ListDrawer;
