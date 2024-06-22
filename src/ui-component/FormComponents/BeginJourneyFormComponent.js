import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Formik, Form, ErrorMessage, FieldArray, useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { setDrawerOpen, setFormData, setIspListData } from 'store/action/journeyCanvas';
import { useDispatch, useSelector } from 'react-redux';
import { selectGetFormData, selectIspListData } from 'store/selectors';
import axiosInstance from 'helpers/apiService';
import { enqueueSnackbar } from 'notistack';
import apiEndPoints from 'helpers/APIEndPoints';

const validationSchema = Yup.object().shape({
    volumeCap: Yup.number().required('Volume Cap is required')
});
const BeginJourneyFormComponent = () => {
    const dispatch = useDispatch();
    const intialFormData = useSelector(selectGetFormData) || {};
    const ispListData = useSelector(selectIspListData);
    const [options, setOptions] = useState(ispListData);
    const [selectedISPs, setSelectedISPs] = useState([]);

    useEffect(() => {
        // Fetch options using Axios
        if (ispListData.length === 0) {
            ispList();
        }
    }, []);

    const ispList = () => {
        axiosInstance
            .get(apiEndPoints.ispList)
            .then((response) => {
                const fetchedOptions = response.data;
                setOptions(fetchedOptions);
                dispatch(setIspListData(fetchedOptions));
            })
            .catch((error) => {
                console.error('Error fetching options:', error);
            });
    };

    const formik = useFormik({
        // Create a formik instance

        initialValues: {
            volumeCap: intialFormData.volumeCap || '',
            isp: Array.isArray(intialFormData.isp)
                ? intialFormData.isp.map((item) => ({
                      ispName: item.ispName || '',
                      ispVolume: item.ispVolume || ''
                  }))
                : [intialFormData.isp]
        },
        validationSchema,
        onSubmit: async (values) => {
            const isIspListEmpty = values.isp.every((isp) => !isp.ispName || !isp.ispVolume);
            if (isIspListEmpty) {
                return;
            }
            await new Promise((r) => setTimeout(r, 500));
            dispatch(setFormData(values));
            enqueueSnackbar('Form Submit Successfully !!!', {
                variant: 'success'
            });
            dispatch(setDrawerOpen(false));
        }
    });

    const handleVolumeCapChange = (e) => {
        formik.handleChange(e);
    };

    return (
        <div>
           {/* <Box
                sx={{
                    m: 1,
                    width: '350px',
                    margin: '24px'
                }}
                noValidatez
                autoComplete="off"
            >
                <div>
                    <Typography variant="h4">Begin Journey Form</Typography>
                </div>
                <Formik
                    initialValues={formik.initialValues}
                    onSubmit={(values) => {
                        formik.handleSubmit(); // Manually trigger form submission
                    }}
                >
                    {({ values }) => (
                        <Form>
                            <div>
                                <TextField
                                    fullWidth
                                    type="number"
                                    id="filled-hidden-label-normal"
                                    label="Volume Cap"
                                    variant="standard"
                                    name="volumeCap"
                                    value={formik.values.volumeCap}
                                    onChange={handleVolumeCapChange}
                                    error={formik.touched.volumeCap && Boolean(formik.errors.volumeCap)}
                                />
                                {formik.touched.volumeCap && formik.errors.volumeCap && (
                                    <div className="error">{formik.errors.volumeCap}</div>
                                )}
                            </div>
                            <div>
                                <FieldArray name="isp">
                                    {({ insert, remove, push }) => (
                                        <div>
                                            {values.isp.length > 0 &&
                                                values.isp.map((isp, index) => (
                                                    <Box
                                                        component="form"
                                                        sx={{
                                                            '& > :not(style)': { m: 1, width: '12ch' }
                                                        }}
                                                        noValidate
                                                        autoComplete="off"
                                                        key={index}
                                                    >
                                                        <FormControl variant="standard" sx={{ m: 1 }}>
                                                            <InputLabel htmlFor={`isp.${index}.ispName`}>ISP List</InputLabel>
                                                            <Select
                                                                labelId={`list-label-${index}`}
                                                                id={`list-select-${index}`}
                                                                name={`isp[${index}].ispName`}
                                                                value={formik?.values?.isp[index]?.ispName}
                                                                onChange={(e) => {
                                                                    handleVolumeCapChange(e);
                                                                    const selectedValue = e.target.value;
                                                                    setSelectedISPs([...selectedISPs, selectedValue]);
                                                                }}
                                                                label="ISP List"
                                                            >
                                                                <MenuItem value="">
                                                                    <em>None</em>
                                                                </MenuItem>
                                                                {options.map((option) => (
                                                                    <MenuItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                        <TextField
                                                            id="filled-hidden-label-normal"
                                                            label="ISP Volume Cap"
                                                            type="number"
                                                            value={formik?.values?.isp[index]?.ispVolume}
                                                            variant="standard"
                                                            name={`isp[${index}].ispVolume`}
                                                            onChange={(e) => {
                                                                handleVolumeCapChange(e);
                                                            }}
                                                        />
                                                        <ErrorMessage
                                                            name={`isp.${index}.ispVolume`}
                                                            component="div"
                                                            className="field-error"
                                                        />
                                                        <IconButton
                                                            onClick={() => {
                                                                remove(index);
                                                            }}
                                                            color="error"
                                                            style={{ width: '4ch', marginTop: '20px' }}
                                                        >
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                            <IconButton
                                                onClick={() => {
                                                    push({ ispName: '', ispVolume: '' });
                                                    setSelectedISPs([]);
                                                }}
                                                color="primary"
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </div>
                                    )}
                                </FieldArray>
                            </div>
                            <div>
                                <Button sx={{ mt: 1 }} variant="outlined" color="primary" type="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Box> */}
        </div>
    );
};
export default BeginJourneyFormComponent;

// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
// import { Grid } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import { useState } from 'react';
// export default function BeginJourneyFormComponent() {
//     const theme = useTheme();
//     const [openModel, setOpenModel] = useState(true);
//     return (
//         <div>
//             <Modal
//                 sx={{ top: '30%', padding: '10px' }}
//                 open={true}
//                 aria-labelledby="modal-modal-title"
//                 aria-describedby="modal-modal-description"
//             >
//                 <Grid
//                     container
//                     bgcolor="white"
//                     maxWidth={800}
//                     alignItems={'center'}
//                     margin="auto"
//                     // padding={"40px 20px"}
//                     p={9}
//                     borderRadius={5}
//                     rowGap={3}
//                     sx={{
//                         outline: 'none',
//                         textAlign: 'center',
//                         [theme.breakpoints.down('md')]: {
//                             // rowGap: 1,
//                             padding: '40px'
//                         }
//                     }}
//                 >
//                     <Grid xs={12} item>
//                         <Typography
//                             sx={{
//                                 color: '#262250',
//                                 font: 'normal normal 900 45px/normal Inter',
//                                 letterSpacing: '0px',
//                                 textTransform: 'capitalize',
//                                 opacity: 1,
//                                 textAlign: 'center',
//                                 [theme.breakpoints.down('md')]: {
//                                     fontSize: '24px'
//                                 }
//                             }}
//                         >
//                             Thanks For Choosing Credmudra!
//                         </Typography>
//                     </Grid>
//                     <Grid xs={12} item>
//                         <Typography
//                             sx={{
//                                 color: '#262250',
//                                 font: 'normal normal normal 22px/normal Inter',
//                                 letterSpacing: '0px',
//                                 textTransform: 'capitalize',
//                                 opacity: 1,
//                                 textAlign: 'center',
//                                 [theme.breakpoints.down('md')]: {
//                                     fontSize: '18px'
//                                 }
//                             }}
//                         >
//                             Your loan application is underway, and we're connecting with matched lenders for a speedy process. To expedite,
//                             register directly with them.
//                         </Typography>
//                     </Grid>
//                     <Grid>
//                       <Button></Button>
//                     </Grid>
//                 </Grid>
//             </Modal>
//         </div>
//     );
// }
