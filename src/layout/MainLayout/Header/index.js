import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router';

import Icon from '@mdi/react';
import { mdiAccountOutline } from '@mdi/js';

import LogoSection from '../LogoSection';
import HeaderNav from './HeaderNav';
import { MyContext } from 'context/MyContextProvider';
import { useContext } from 'react';
import axios from 'axios';
import { baseURL, gatewayURL, idpURL, logoutURL } from 'config/envConfig';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { user, setUser } = useContext(MyContext);
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        const data = {
            clientName: 'campaignlabs'
        };

        const headers = {
            Authorization: JSON.parse(localStorage.getItem('token'))?.access_token
                ? 'Bearer ' + JSON.parse(localStorage.getItem('token'))?.access_token
                : null,
            'Content-Type': 'application/json',
            accept: 'application/json'
        };
        axios
            .post(
                `${gatewayURL}/secured/introspect`,
                {
                    data
                },
                { headers }
            )
            .then((result) => {
                if (result?.data?.data?.active) {
                    const id_token = JSON.parse(localStorage.getItem('token'))?.id_token;
                    window.location.href = `${idpURL}/connect/logout?post_logout_redirect_uri=${logoutURL}&id_token_hint=${id_token}`;
                } else {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            })
            .catch((error) => {
                localStorage.removeItem('token');
                window.location.href = '/login';
            });
    };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" color="primary">
                    <Toolbar disableGutters>
                        <Button
                            variant="text"
                            sx={{ width: '40px' }}
                            onClick={() => {
                                navigate('/');
                                // handleCloseDataMenu();
                            }}
                        >
                            <LogoSection />
                        </Button>
                        <Box sx={{ flexGrow: 1 }}>
                            <HeaderNav />
                        </Box>
                        <IconButton onClick={handleMenu}>
                            <Icon path={mdiAccountOutline} size={1} color="#fff" />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
};

export default Header;
