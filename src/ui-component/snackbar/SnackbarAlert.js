import React, { useContext } from 'react';

import { SnackbarContext } from '../../context/SnackBarContext';
import { IconButton, Snackbar, SnackbarContent, makeStyles } from '@mui/material';
import { amber, blue, green, red } from '@mui/material/colors';
// import CloseIcon from '@mui/material/icons/Close';

const useStyles = makeStyles((theme) => ({
    success: {
        backgroundColor: green[600],
        fontWeight: '500',
        fontSize: '18px',
        color: '#FFFFFF'
    },

    error: {
        backgroundColor: red[600],
        fontWeight: '500',
        fontSize: '18px',
        color: '#FFFFFF'
    },

    info: {
        backgroundColor: blue[600],
        fontWeight: '500',
        fontSize: '18px',
        color: '#FFFFFF'
    },

    warning: {
        backgroundColor: amber[700],
        fontWeight: '500',
        color: '#000000',
        fontSize: '18px'
    },

    close: {
        padding: theme.spacing(0.5)
    }
}));

export default function SnackbarAlert() {
    const classes = useStyles();
    const { snackbar, setSnackbar } = useContext(SnackbarContext);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar('');
    };

    const { message, type } = snackbar;

    return (
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={!!message} autoHideDuration={3000} onClose={handleClose}>
            <SnackbarContent
                style={{ minWidth: 'auto' }}
                className={classes[type]}
                message={message ? <span>{message}</span> : null}
                // action={[
                //     <IconButton key="close" color="inherit" onClick={handleClose}>
                //         {/* <CloseIcon /> */}
                //     </IconButton>
                // ]}
            />
        </Snackbar>
    );
}
