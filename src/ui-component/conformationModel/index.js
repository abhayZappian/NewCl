import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

const ConfirmationDialog = ({ open, handleClose, title, content, onConfirm, confirmText }) => {
    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            sx={{ p: 4, borderRadius: 12 }}
        >
            <DialogTitle sx={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: 'primary.main' }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ fontSize: 18, textAlign: 'center', color: 'text.secondary' }}>
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                <Button
                    variant="outlined"
                    sx={{ fontSize: 16, marginRight: 2}}
                    onClick={() => handleClose(false)}
                >
                    Cancel
                </Button>
                <Button
                    sx={{ fontSize: 16, fontWeight: 'bold' }}
                    onClick={() => onConfirm()}
                    color="primary"
                    variant="contained"
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
