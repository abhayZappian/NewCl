import { Typography } from '@mui/joy';
import { Box, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { useState } from 'react';

export const WaitForTimeSlotForm = () => {
    const [age, setAge] = useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
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
                    <Typography level="h4"> Wait for form </Typography>
                </div>

                <div>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: '100%' }}>
                        <InputLabel id="filled-hidden-label-normal">Drop down with Minute to Year as options </InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={age}
                            label="List"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Sunday</MenuItem>
                            <MenuItem value={20}>Monday</MenuItem>
                            <MenuItem value={30}>Tuesday</MenuItem>
                            <MenuItem value={10}>Wednesday</MenuItem>
                            <MenuItem value={20}>Thursday</MenuItem>
                            <MenuItem value={30}>Friday</MenuItem>
                            <MenuItem value={10}>Saturday</MenuItem>
                            <MenuItem value={10}>Weekends and Sunday to Saturday as options</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: '100%' }}>
                        <InputLabel id="filled-hidden-label-normal">timezone selection </InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={age}
                            label="List"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>EST</MenuItem>
                            <MenuItem value={20}>PST</MenuItem>
                            <MenuItem value={30}>IST</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div></div>
            </Box>
        </div>
    );
};
