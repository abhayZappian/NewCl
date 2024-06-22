import React, { useContext, useState } from 'react';
import { MyContext } from '../../context/MyContextProvider';
import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Link } from 'react-router-dom';
import { height } from '@mui/system';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../helpers/apiService';
import { useNavigate } from 'react-router-dom';
// import SnackbarAlert from 'ui-component/snackbar/SnackbarAlert';
import { SnackbarContext } from '../../context/SnackBarContext';
import { Button, Snackbar } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';
import { baseURL, callBackURL, gatewayURL, idpURL } from 'config/envConfig';
import { useEffect } from 'react';
import Group1 from '../../assets/images/login/Group1.png';
import Group2 from '../../assets/images/login/Group2.png';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required')
});

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            MIS
        </Typography>
    );
}

const defaultTheme = createTheme();
export const Login = () => {
    const navigate = useNavigate();
    const [appName, setAppName] = useState(false);

    // const [open, setopen] = useState(false);
    // const [message, setmessage] = useState("");
    const [loading, setLoading] = React.useState(false);

    const getClientsHandler = async () => {
        const data = {
            data: {}
        };
        await axios.post(`${gatewayURL}/core/get-clients`, data).then((response) => {
            const rdata = response.data;
            if (rdata.status.code === 200) {
                const appIs = rdata.data?.find((item) => item.clientId === 'campaignlabs');
                if (appIs) {
                    setAppName(appIs);
                } else {
                    alert('App is not there !');
                }
            }
        });
    };

    useEffect(() => {
        getClientsHandler();
    }, [null]);
    const getAuthorizationCode = () => {
        return `${idpURL}/oauth2/authorize?response_type=code&client_id=campaignlabs&scope=openid&redirect_uri=${callBackURL}`;
    };

    return (
        <>
            <Box display="flex" flexDirection="row" height="100vh" width="100vw" overflow="hidden">
                <Box flex="1" display="flex" alignItems="center" justifyContent="center">
                    <Grid
                        container
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            
                            position: 'absolute'
                        }}
                    >
                        <Grid item>
                            <Typography variant="h1" component="h2" sx={{ color: 'black', fontWeight: 10 }}>
                                Login to your account
                            </Typography>
                            <Typography variant="h4" component="h2" sx={{ marginTop: '8px', color: 'grey' }}>
                                Advanced reports and analysis offered by Campaign Lab
                            </Typography>
                            <LoadingButton
                                componet={Link}
                                href={getAuthorizationCode()}
                                variant="contained"
                                color="primary"
                                sx={{ mt: 5, p: 2, width: '200px', display: 'flex', alignItems: 'flex-start' }}
                                loading={loading}
                                loadingPosition="start"
                            >
                                login
                            </LoadingButton>
                            <Typography variant="h4" component="h2" sx={{ mt: 5, fontWeight: 10 }}>
                                <span style={{ color: '#0080cf' }}>Support</span> and <span style={{ color: '#0080cf' }}>Help</span> to
                                connect with our tech team
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Box
                    position="relative"
                    flex="1"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="60px 0 0 60px"
                    overflow="hidden"
                >
                    <img src={Group2} alt="" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
                    <img src={Group1} alt="" style={{ position: 'absolute', objectFit: 'cover', width: '75%' }} />
                    <Box>
                        <Typography
                            variant="h2"
                            component="h2"
                            position="absolute"
                            bottom="18%"
                            left="0"
                            right="0"
                            textAlign="center"
                            color="white"
                            sx={{ fontFamily: 'sans-serif', fontWeight: 1000 }}
                        >
                            Advanced features for campaign scheduling
                        </Typography>
                        <Typography
                            variant="h4"
                            component="h4"
                            position="absolute"
                            bottom="14%"
                            left="0"
                            right="0"
                            textAlign="center"
                            color="white"
                            sx={{ fontFamily: 'sans-serif', fontWeight: 100 }}
                        >
                            The most important feature of any Email scheduling tool is the campaign scheduling feature. We provide
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    );
};
