import { Autocomplete, Checkbox, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { Box, Stack, flexbox } from '@mui/system';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Button } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { selectGetEmailSchedule } from 'store/selectors';
import { enqueueSnackbar } from 'notistack';
import { setDrawerOpen, setScheduleData } from 'store/action/journeyCanvas';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useEffect } from 'react';
import * as Yup from 'yup';
import axiosInstance from 'helpers/apiService';
import { baseURL } from 'config/envConfig';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const validationSchema = Yup.object().shape({
    weekDays: Yup.mixed().required('Week Days  required'),
    startTimeRecurring: Yup.mixed().required('Start Time  required'),
    endTimeRecurring: Yup.mixed()
        .required('End Time  required')
        .test('is-greater', 'End time must be greater than start time', function (value) {
            const { startTimeRecurring } = this.parent;
            return new Date(value) > new Date(startTimeRecurring);
        }),
    timeZoneRecurring: Yup.mixed().required('Time Zone  required')
});
const validationSchemaOnce = Yup.object().shape({
    startTimeOnce: Yup.mixed().required('Start Time required'),
    endTimeOnce: Yup.mixed()
        .required('End Time  required')
        .test('is-greater', 'End time must be greater than start time', function (value) {
            const { startTimeOnce } = this.parent;
            return new Date(value) > new Date(startTimeOnce);
        }),
    timeZoneOnce: Yup.mixed().required('Time Zone  required'),
    dateOnce: Yup.mixed().required('Start Time  required')
});

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const weekDays = [
    { label: 'Sunday', value: 'sunday' },
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' }
];

export const ScheduleEmailFormComponent = () => {
    const [weekDayOptions, setWeekDayOptions] = useState([]);
    const intialScheduleData = useSelector(selectGetEmailSchedule) || {};
    // console.log(intialScheduleData, 'dataaaaaaaa');
    const parsedStartTime = dayjs(`2022-04-17T${intialScheduleData.startTimeRecurring}`);
    const parsedEndTime = dayjs(`2022-04-17T${intialScheduleData.endTimeRecurring}`);
    const [timeZones, setTimeZone] = useState('');
    const [selectedOption, setSelectedOption] = useState('recurring');
    const parsedStartTimeOnce = dayjs(`2022-04-17T${intialScheduleData.startTimeOnce}`);
    const parsedEndTimeOnce = dayjs(`2022-04-17T${intialScheduleData.endTimeOnce}`);
    const getTimeZone = async () => {
        const res = await axiosInstance.get(`${baseURL}/timeZone`);
        setTimeZone(res.data);
    };

    useEffect(() => {
        getTimeZone();
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        setWeekDayOptions(weekDays);
    }, []);

    const formik = useFormik({
        initialValues: {
            type: intialScheduleData.type || null,
            dateOnce: intialScheduleData.dateOnce || '',
            weekDays: intialScheduleData.weekDays,
            startTimeRecurring: parsedStartTime.isValid() ? parsedStartTime.toDate() : null,
            endTimeRecurring: parsedEndTime.isValid() ? parsedEndTime.toDate() : null,
            timeZoneRecurring: intialScheduleData.timeZoneRecurring || '',
            startTimeOnce: parsedStartTimeOnce.isValid() ? parsedStartTimeOnce.toDate() : null,
            endTimeOnce: parsedEndTimeOnce.isValid() ? parsedEndTimeOnce.toDate() : null,
            timeZoneOnce: intialScheduleData.timeZoneOnce || ''
        },

        validationSchema: selectedOption === 'recurring' ? validationSchema : validationSchemaOnce,
        onSubmit: async (values) => {
            if (selectedOption === 'recurring') {
                const data = {
                    type: selectedOption,
                    weekDays: values.weekDays,
                    startTimeRecurring: moment(values.startTimeRecurring).format('HH:mm'),
                    endTimeRecurring: moment(values.endTimeRecurring).format('HH:mm'),
                    timeZoneRecurring: values.timeZoneRecurring
                };
                console.log(data);
                dispatch(setScheduleData(data));
                dispatch(setDrawerOpen(false));
                enqueueSnackbar('Form Submit Successfully !!!', {
                    variant: 'success'
                });
            } else {
                const data = {
                    type: selectedOption,
                    startTimeOnce: moment(values.startTimeOnce).format('HH:mm'),
                    endTimeOnce: moment(values.endTimeOnce).format('HH:mm'),
                    timeZoneOnce: values.timeZoneOnce,
                    dateOnce: values.dateOnce
                };
                console.log(data);
                enqueueSnackbar('Form Submit Successfully !!!', {
                    variant: 'success'
                });
                dispatch(setScheduleData(data));
                dispatch(setDrawerOpen(false));
            }
        }
    });
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
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
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <Typography level="h4"> Schedule Form </Typography>
                    </div>
                    <div>
                        <div>
                            <FormControl component="fieldset" sx={{ marginTop: 3 }}>
                                <RadioGroup row aria-label="options" name="options" value={selectedOption} onChange={handleOptionChange}>
                                    <FormControlLabel value="recurring" control={<Radio />} label="Recurring" />
                                    <FormControlLabel value="once" control={<Radio />} label="Once" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>

                    {selectedOption === 'recurring' && (
                        <>
                            {
                                <div>
                                    <div style={{ marginTop: '10px' }}>
                                        <div>
                                            <Autocomplete
                                                multiple
                                                id="weekDays"
                                                name="weekDays"
                                                options={weekDayOptions}
                                                value={formik.values.weekDays}
                                                onChange={(e, newValue) => formik.setFieldValue('weekDays', newValue, true)}
                                                disableCloseOnSelect
                                                getOptionLabel={(option) => option.label}
                                                renderOption={(props, option, { selected }) => (
                                                    <li {...props}>
                                                        <Checkbox
                                                            icon={icon}
                                                            checkedIcon={checkedIcon}
                                                            style={{ marginRight: 8 }}
                                                            checked={selected}
                                                        />
                                                        {option.label}
                                                    </li>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        label="Select Week Days"
                                                        placeholder="Week Days"
                                                    />
                                                )}
                                            />
                                            {formik.touched.weekDays && formik.errors.weekDays && (
                                                <div style={{ color: 'red' }} className="error">
                                                    {formik.errors.weekDays}
                                                </div>
                                            )}
                                        </div>
                                        <Box
                                            sx={{
                                                display: 'flex'
                                            }}
                                        >
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Stack spacing={1} sx={{ Width: 5, marginTop: 4 }}>
                                                    <TimePicker
                                                        name="startTimeRecurring"
                                                        label="Start Time"
                                                        value={dayjs(formik.values?.startTimeRecurring)}
                                                        onChange={(newValue) => {
                                                            formik.setFieldValue('startTimeRecurring', newValue.$d, true);
                                                        }}
                                                        referenceDate={dayjs('2022-04-17')}
                                                    />
                                                    {formik.touched.startTimeRecurring && formik.errors.startTimeRecurring && (
                                                        <div style={{ color: 'red' }} className="error">
                                                            {formik.errors.startTimeRecurring}
                                                        </div>
                                                    )}
                                                </Stack>
                                            </LocalizationProvider>
                                            &nbsp; &nbsp; &nbsp;
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Stack spacing={1} sx={{ Width: 5, marginTop: 4 }}>
                                                    <TimePicker
                                                        name="endTimeRecurring"
                                                        label="End Time"
                                                        value={dayjs(formik.values?.endTimeRecurring)}
                                                        onChange={(newValue) => {
                                                            formik.setFieldValue('endTimeRecurring', newValue.$d, true);
                                                        }}
                                                        referenceDate={dayjs('2022-04-17')}
                                                    />
                                                    {formik.touched.endTimeRecurring && formik.errors.endTimeRecurring && (
                                                        <div style={{ color: 'red' }} className="error">
                                                            {formik.errors.endTimeRecurring}
                                                        </div>
                                                    )}
                                                </Stack>
                                            </LocalizationProvider>
                                        </Box>
                                        <Box sx={{ mt: 2 }}>
                                            <Autocomplete
                                                id="timeZoneRecurring"
                                                name="timeZoneRecurring"
                                                options={timeZones}
                                                value={formik?.values?.timeZoneRecurring || null}
                                                getOptionLabel={(option) => `${option.label}`}
                                                onChange={(event, newValue) => formik.setFieldValue('timeZoneRecurring', newValue, true)}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Select a Time Zone" variant="standard" />
                                                )}
                                            />
                                            {formik.touched.timeZoneRecurring && formik.errors.timeZoneRecurring && (
                                                <div style={{ color: 'red' }} className="error">
                                                    {formik.errors.timeZoneRecurring}
                                                </div>
                                            )}
                                        </Box>
                                    </div>
                                </div>
                            }
                        </>
                    )}
                    {selectedOption === 'once' && (
                        <>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Stack spacing={2} sx={{ minWidth: 305, marginTop: 1 }}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker
                                            fullWidth
                                            name="dateOnce"
                                            value={dayjs(formik.values?.dateOnce)}
                                            onChange={(newValue) => formik.setFieldValue('dateOnce', newValue.$d, true)}
                                        />
                                        {formik.touched.dateOnce && formik.errors.dateOnce && (
                                            <div style={{ color: 'red' }} className="error">
                                                {formik.errors.dateOnce}
                                            </div>
                                        )}
                                    </DemoContainer>
                                </Stack>
                            </LocalizationProvider>
                            <Box
                                sx={{
                                    display: 'flex'
                                }}
                            >
                                {' '}
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Stack spacing={1} sx={{ Width: 5, marginTop: 4 }}>
                                        <TimePicker
                                            name="startTimeOnce"
                                            label="Start Time"
                                            value={dayjs(formik.values?.startTimeOnce)}
                                            onChange={(newValue) => {
                                                formik.setFieldValue('startTimeOnce', newValue.$d, true);
                                            }}
                                            referenceDate={dayjs('2022-04-17')}
                                        />
                                        {formik.touched.startTimeOnce && formik.errors.startTimeOnce && (
                                            <div style={{ color: 'red' }} className="error">
                                                {formik.errors.startTimeOnce}
                                            </div>
                                        )}
                                    </Stack>
                                </LocalizationProvider>
                                &nbsp; &nbsp; &nbsp;
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Stack spacing={1} sx={{ Width: 5, marginTop: 4 }}>
                                        <TimePicker
                                            name="endTimeOnce"
                                            label="End Time"
                                            value={dayjs(formik.values?.endTimeOnce)}
                                            onChange={(newValue) => {
                                                formik.setFieldValue('endTimeOnce', newValue.$d, true);
                                            }}
                                            referenceDate={dayjs('2022-04-17')}
                                        />
                                        {formik.touched.endTimeOnce && formik.errors.endTimeOnce && (
                                            <div style={{ color: 'red' }} className="error">
                                                {formik.errors.endTimeOnce}
                                            </div>
                                        )}
                                    </Stack>
                                </LocalizationProvider>
                            </Box>
                            <Box sx={{ mt: 3 }}>
                                <Autocomplete
                                    id="timeZoneOnce"
                                    name="timeZoneOnce"
                                    options={timeZones}
                                    value={formik?.values?.timeZoneOnce || null}
                                    getOptionLabel={(option) => `${option.label}`}
                                    onChange={(event, newValue) => formik.setFieldValue('timeZoneOnce', newValue, true)}
                                    renderInput={(params) => <TextField {...params} label="Select a Time Zone" variant="standard" />}
                                />
                                {formik.touched.timeZoneOnce && formik.errors.timeZoneOnce && (
                                    <div style={{ color: 'red' }} className="error">
                                        {formik.errors.timeZoneOnce}
                                    </div>
                                )}
                            </Box>
                        </>
                    )}
                    <div>
                        <Button sx={{ mt: 4 }} type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </div>
                </form>
            </Box>
        </div>
    );
};
