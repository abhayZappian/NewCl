import { Typography } from '@mui/joy';
import { Box, Card, CardContent } from '@mui/material';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Autocomplete, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from 'react';
import axiosInstance from 'helpers/apiService';
import apiEndPoints from 'helpers/APIEndPoints';
import { useEffect } from 'react';
import { baseURL } from 'config/envConfig';
import { setDrawerOpen, setFormData, setListData, setSegmentData } from 'store/action/journeyCanvas';
import { enqueueSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { selectGetFormData, selectListData, selectSegmentData } from 'store/selectors';
const validationSchema = Yup.object().shape({
    contacts: Yup.array().of(
        Yup.object().shape({
            list: Yup.mixed().required('List required'),
            segment: Yup.array().min(1, 'Select at least one segments').of(Yup.mixed().required('Multi-Select is required'))
        })
    )
});

export const ContactJourneyFormComponent = () => {
    const dispatch = useDispatch();
    const intialFormData = useSelector(selectGetFormData) || {};
    const listData = useSelector(selectListData) || [];
    const segmentData = useSelector(selectSegmentData) || [];

    // const [list, setlist] = useState([]);
    const [segments, setSegments] = useState([]);

    const getListsData = async () => {
        const { data } = await axiosInstance.get(apiEndPoints.listData);
        dispatch(setListData(data));
    };
    const getSegmentsData = async (listId) => {
        const { data } = await axiosInstance.get(`${baseURL}/cl/apis/v1/segment/${listId}`);
        console.log(data, 'data................');
        setSegments(data);
        dispatch(setSegmentData(data));
        console.log(segmentData, 'redux segment ...............');
    };
    useEffect(() => {
        if (
            // list.length === 0 &&
            listData.length === 0
        ) {
            getListsData();
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            //   contacts: [{ list: "", segment: [] }],
            contacts:
                //   Array.isArray
                intialFormData?.contacts
                    ? intialFormData?.contacts?.map(
                          (item) => (
                              {
                                  list: item?.list?.list_name || '',
                                  segment: item?.segment.map((e) => e.segment_name) || []
                                  // segment: item?.segment?.map((e) => e?.segment?.segment_name) || [],
                              }
                          )
                      )
                    : [{ list: '', segment: [] }]
        },
        validationSchema,
        onSubmit: (values) => {
            console.log('Form data submitted:', values);
            dispatch(setFormData(values));
            enqueueSnackbar('Form Submit Successfully !!!', {
                variant: 'success'
            });
            dispatch(setDrawerOpen(false));
        }
    });
    useEffect(() => {
        if (intialFormData?.contacts?.length) {
            formik.setFieldValue('contacts', intialFormData?.contacts);
        }
    }, [intialFormData]);

    const addDropdown = () => {
        formik.setFieldValue('contacts', [...formik.values.contacts, { list: '', segment: [] }]);
    };

    const removeDropdown = (index) => {
        const newContacts = [...formik.values.contacts];
        newContacts.splice(index, 1);
        formik.setFieldValue('contacts', newContacts);
    };
    const handleReset = () => {
        formik.resetForm();
        dispatch(
            setFormData({
                contacts: [
                    {
                        list: '',
                        segment: []
                    }
                ]
            })
        );
    };
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
                    <Typography level="h4"> Contact Enters Journey</Typography>
                </div>
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        {formik.values.contacts.map((contact, index) => {
                            const contactKey = `contacts[${index}]`;
                            return (
                                <div key={index}>
                                    <Card
                                        sx={{
                                            position: 'relative',
                                            border: '2px solid #d1cfcf',
                                            pb: 3,
                                            marginTop: 3,
                                            backgroundColor: '#ffffff'
                                        }}
                                    >
                                        <CardContent>
                                            <Autocomplete
                                                id={`list-${index}`}
                                                name={`${contactKey}.list`}
                                                // options={list}
                                                //   options={{list.filter(
                                                //   (option) =>
                                                //     !formik.values.contacts.some(
                                                //       (contact) => contact.list.listid === option.listid
                                                //     )
                                                // )}}
                                                disableClearable
                                                options={listData.filter(
                                                    (option) =>
                                                        !formik.values.contacts.some((contact) => contact.list.listid === option.listid)
                                                )}
                                                getOptionLabel={(option) => `${option.list_name} (${option.records})`}
                                                value={contact.list || null}
                                                onChange={(e, newValue) => {
                                                    console.log(newValue, 'newww');
                                                    formik.setFieldValue(`${contactKey}.list`, newValue, true);
                                                    formik.setFieldValue(
                                                        `${contactKey}.segment`,
                                                        //  newValue ||
                                                        []
                                                    );
                                                    getSegmentsData(newValue.listid);
                                                }}
                                                renderInput={(params) => <TextField {...params} label="Lists" variant="standard" />}
                                            />
                                            {formik.touched.contacts &&
                                                formik.touched.contacts[index] &&
                                                formik.errors.contacts?.[index]?.list && (
                                                    <div style={{ color: 'red' }}>{formik.errors.contacts?.[index]?.list}</div>
                                                )}
                                            <Autocomplete
                                                sx={{ mt: 2 }}
                                                multiple
                                                id={`segment-${index}`}
                                                name={`${contactKey}.segment`}
                                                options={segments}
                                                value={contact.segment || null}
                                                getOptionLabel={(option) => `${option.segment_name} (${option.count})`}
                                                onChange={(_, newValue) => formik.setFieldValue(`${contactKey}.segment`, newValue || [])}
                                                renderInput={(params) => <TextField {...params} variant="standard" label="Segments" />}
                                            />
                                            {formik.touched.contacts &&
                                                formik.touched.contacts[index] &&
                                                formik.errors.contacts?.[index]?.segment && (
                                                    <div style={{ color: 'red' }}>{formik.errors.contacts?.[index]?.segment}</div>
                                                )}

                                            {index > 0 && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        right: '-4%',
                                                        top: '0'
                                                    }}
                                                >
                                                    <Button onClick={() => removeDropdown(index)} type="button">
                                                        <CancelIcon />
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                        <Button sx={{ mt: 3 }} variant="outlined" type="button" onClick={addDropdown}>
                            <AddIcon />
                        </Button>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Submit
                            </Button>
                            <Button variant="outlined" onClick={handleReset}>
                                Reset
                            </Button>
                        </Box>
                    </form>
                </div>
            </Box>
        </div>
    );
};
