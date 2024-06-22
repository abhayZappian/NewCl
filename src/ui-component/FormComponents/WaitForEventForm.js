import { Typography } from '@mui/joy';
import { Box, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { useState } from 'react';

export const WaitForEventForm = () => {
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
                    <Typography level="h4"> Wait for Event form </Typography>
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
                            <MenuItem value={10}>Open</MenuItem>
                            <MenuItem value={20}>Sent but not opened</MenuItem>
                            <MenuItem value={30}>Opened but not clicked</MenuItem>
                            <MenuItem value={10}>Clicker and Conversion</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </Box>
        </div>
    );
};
