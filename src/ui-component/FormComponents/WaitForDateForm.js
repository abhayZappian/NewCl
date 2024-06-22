import { useState } from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/joy';
import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TextField } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

export const WaitForDateForm = () => {
    const [selectedValue, setSelectedValue] = useState('Minutes');
    const [selectedDate, setSelectedDate] = useState(null);
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    const [value, setValue] = React.useState(null);

    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
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
                    <Typography level="h4"> Wait for form </Typography>
                </div>
                <div>
                    <FormControl component="fieldset" sx={{ marginTop: 4 }}>
                        <RadioGroup row aria-label="radios" name="radios" value={selectedValue} onChange={handleChange}>
                            <FormControlLabel value="Minutes" control={<Radio />} label="Minutes" />
                            <FormControlLabel value="Hours" control={<Radio />} label="Hours" />
                            <FormControlLabel value="Date" control={<Radio />} label="Date" />
                        </RadioGroup>
                    </FormControl>

                    {selectedValue === 'Minutes' && (
                        <div>
                            <Autocomplete
                                id="minute-picker"
                                options={minutes}
                                renderInput={(params) => <TextField {...params} label="Minute" variant="standard" fullWidth />}
                            />
                        </div>
                    )}
                    {selectedValue === 'Hours' && (
                        <div>
                            <Autocomplete
                                id="hour-picker"
                                options={hours}
                                renderInput={(params) => <TextField {...params} label="Hour" variant="standard" fullWidth />}
                            />
                        </div>
                    )}
                    {selectedValue === 'Date' && (
                        <div style={{ marginTop: '30px' }}>
                            <div>
                                {' '}
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Stack spacing={2} sx={{ minWidth: 305 }}>
                                        <DatePicker
                                            label="Select Date"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            renderInput={(props) => <TextField {...props} />}
                                        />
                                        <TimePicker value={value} onChange={setValue} referenceDate={dayjs('2022-04-17')} />
                                        <Typography>Stored value: {value == null ? 'null' : value.format()}</Typography>
                                    </Stack>
                                </LocalizationProvider>
                            </div>
                        </div>
                    )}
                </div>
            </Box>
        </div>
    );
};
