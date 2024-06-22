import * as React from 'react';
import { Card, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function TabPanel(props) {
    const { children, value, index } = props;

    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component={'div'} variant={'body2'}>
                        {children}
                    </Typography>
                </Box>
            )}
        </div>
    );
}

const PageHeader = (props) => {
    const { title, description, pageAction } = props.titleBar;
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ bgcolor: '#fff', p: 2, display: 'flex' }}>
                <Box>
                    <Typography variant="h2">{title}</Typography>
                    <Typography>{description}</Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Box>
                    <Tabs value={value} onChange={handleChange} aria-label="disabled tabs example">
                        {pageAction.map((item, index) => (
                            <Tab key={index} label={item.actionName} />
                        ))}

                        {/* <Tab label="Item Two" {...a11yProps(1)} />
                            <Tab label="Item Three" {...a11yProps(2)} /> */}
                    </Tabs>
                </Box>
            </Box>
            <Box>
                {pageAction.map((item, index) => (
                    <TabPanel key={index} value={value} index={index}>
                        {item.actionName === 'Manage Data Source' && (
                            <Box>
                                <Typography component={'span'} variant={'body2'}>
                                    Hello
                                </Typography>
                            </Box>
                        )}
                        {item.actionName === 'Data Headers' && (
                            <Box>
                                <Typography component={'span'} variant={'body2'}>
                                    Data Headers
                                </Typography>
                            </Box>
                        )}
                    </TabPanel>
                ))}
            </Box>
        </>
    );
};

PageHeader.propTypes = {
    children: PropTypes.node,
    title: PropTypes.node,
    description: PropTypes.string,
    pageAction: PropTypes.array
};

export default PageHeader;
