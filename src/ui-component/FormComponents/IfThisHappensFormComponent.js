import React from 'react';
import { useFormik } from 'formik';
import { FormControl, Radio, RadioGroup, FormControlLabel, TextField, Button, Box } from '@mui/material';
import * as Yup from 'yup';
import { Typography } from '@mui/joy';
import { useDispatch, useSelector } from 'react-redux';
import { selectGetFormData } from 'store/selectors';
import { enqueueSnackbar } from 'notistack';
import { setDrawerOpen, setFormData } from 'store/action/journeyCanvas';

const validatePercentage = (value) => {
    if (!/^\d+(\.\d+)?%$/.test(value)) {
        return false;
    }
    return true;
};
const validationSchema = Yup.object().shape({
    option: Yup.string().required('Please select an option')
    // text: Yup.string().when('option', {
    //     is: 'Completion of campaign',
    //     then: Yup.string().required('').test('is-percentage', 'Invalid percentage', validatePercentage)
    // }),
    // fixedNumber: Yup.string().when('option', {
    //     is: 'Completion of campaign',
    //     then: Yup.string().required('Please enter your number')
    // })
});

export const IfThisHappensFormComponent = () => {
    const dispatch = useDispatch();
    const intialFormData = useSelector(selectGetFormData) || {};
    console.log(intialFormData, 'dataaaa');

    const formik = useFormik({
        initialValues: {
            option: intialFormData.option || ''
            // text: '',
            // fixedNumber: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log('Form values:', values);
            dispatch(setFormData(values));
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
                        <Typography level="h4"> If this happens form </Typography>
                    </div>
                    <div>
                        <FormControl component="fieldset" sx={{ mt: 2 }}>
                            <RadioGroup name="option" value={formik.values.option} onChange={formik.handleChange}>
                                {/* <FormControlLabel value="Completion of campaign" control={<Radio />} label="Completion of Journey" /> */}
                                <FormControlLabel value="Errors" control={<Radio />} label="Errors" />
                                {/* <FormControlLabel value="Issues" control={<Radio />} label="Issues" /> */}
                                <FormControlLabel value="Bugs" control={<Radio />} label="Bugs" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    {formik.touched.option && formik.errors.option && (
                        <div style={{ color: 'red' }} className="error">
                            {formik.errors.option}
                        </div>
                    )}
                    {/* 
                    {formik.values.option === 'Completion of campaign' && (
                        <>
                            <div>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="text"
                                    name="text"
                                    label="Enter your percentage"
                                    value={formik.values.text}
                                    onChange={formik.handleChange}
                                    error={formik.touched.text && Boolean(formik.errors.text)}
                                    helperText={formik.touched.text && formik.errors.text}
                                />
                            </div>
                            <div style={{
                                display:"flex",
                                justifyContent:"center",
                                alignItems:"center",
                                marginTop:"20px"
                            }}>
                                <Typography level='h4' sx={{fontWeight:"10"}}>or</Typography>
                            </div>
                            <div>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="fixedNumber"
                                    name="fixedNumber"
                                    type="Number"
                                    label="Enter your fixed number"
                                    value={formik.values.fixedNumber}
                                    onChange={formik.handleChange}
                                    error={formik.touched.fixedNumber && Boolean(formik.errors.fixedNumber)}
                                    helperfixedNumber={formik.touched.fixedNumber && formik.errors.fixedNumber}
                                />
                            </div>
                        </>
                    )} */}

                    <Box sx={{ width: 350, marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                                dispatch(setFormData(null));
                                formik.resetForm();
                                formik.setFieldValue('option', '', true);
                            }}
                        >
                            Reset
                        </Button>
                    </Box>
                </Box>
            </form>
        </div>
    );
};
