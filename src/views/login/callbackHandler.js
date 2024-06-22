import { Box } from '@mui/system';
import axios from 'axios';
import { baseURL, callBackURL, gatewayURL } from 'config/envConfig';
import React from 'react';
import { useEffect } from 'react';
import './login.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CallbackHandlerPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const code = searchParams.get('code');

    const handlerCore = async () => {
        const data = {
            data: {
                redirectUri: callBackURL,
                clientName: 'campaignlabs',
                code: code
            }
        };

        await axios.post(`${gatewayURL}/core/get-token`, data).then((response) => {
            const rdata = response.data;
            if (rdata.status.code === 200) {
                localStorage.setItem('token', JSON.stringify(response?.data?.data?.token));
                localStorage.setItem('userInfo', JSON.stringify(response?.data?.data?.user));
                return navigate('/');
            }
        });
    };
    useEffect(() => {
        handlerCore();
    }, []);
    return (
        <>
            <Box sx={{ height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div class="spinner"></div>
            </Box>
        </>
    );
};

export default CallbackHandlerPage;
