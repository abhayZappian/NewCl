import React from 'react';
import { useFormik } from 'formik';
import { FormControl, FormControlLabel, Radio, RadioGroup, Button, Box, TextField, Autocomplete } from '@mui/material';
import * as Yup from 'yup';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@mui/joy';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSnackbar } from 'notistack';
import { setDrawerOpen, setEventData, setFormData } from 'store/action/journeyCanvas';
import {  selectGetFormData } from 'store/selectors';


const validationSchema = Yup.object().shape({
    conditonOptions: Yup.mixed().required('Conditon options field is required')
});

export const EventOccurs = () => {
    const dispatch = useDispatch();
    const intialFormData = useSelector(selectGetFormData) || {};
    console.log(intialFormData, 'okkkkkk');

    const formik = useFormik({
        initialValues: {
            not: intialFormData.not || false,
            conditonOptions: intialFormData.conditonOptions || ''
        },
        validationSchema,
        onSubmit: (values) => {
            console.log('values,----', values);
            let dataNew = {
                not: values.not,
                conditonOptions: values.conditonOptions
            };
            console.log('Form data:', dataNew);
            dispatch(setFormData(dataNew));
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
                    <Typography level="h4"> Event Occurs Form </Typography>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <Box sx={{ width: 300, marginTop: 2 }}>
                        <FormControlLabel
                            control={<Checkbox checked={formik.values.not} onChange={formik.handleChange} name="not" />}
                            label="Not"
                        />
                    </Box>

                    <Box>
                        <FormControl component="fieldset">
                            <RadioGroup row name="conditonOptions" value={formik.values.conditonOptions} onChange={formik.handleChange}>
                                <FormControlLabel value="Opened" control={<Radio />} label="Opened" />
                                <FormControlLabel value="Clicked" control={<Radio />} label="Clicked" />
                                <FormControlLabel value="Conversion" control={<Radio />} label="Conversion" />
                            </RadioGroup>
                        </FormControl>
                        {formik.touched.conditonOptions && formik.errors.conditonOptions && (
                            <div className="error" style={{ color: 'red' }}>
                                {formik.errors.conditonOptions}
                            </div>
                        )}
                    </Box>
                    <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                                dispatch(
                                    setFormData({
                                        not: false,
                                        conditonOptions: ''
                                    })
                                );
                                formik.resetForm();
                                formik.setFieldValue('not', false, true);
                                formik.setFieldValue('conditonOptions', '', true);
                            }}
                        >
                            Reset
                        </Button>
                    </Box>
                </form>
            </Box>
        </div>
    );
};
