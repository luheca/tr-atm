import React from 'react';

import { useState } from 'react';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { Dialog, DialogActions, DialogContent, FormControl } from "@mui/material";

interface overlayScreenProps {
    open: boolean;
    label: string;
    handleConfirm: (value: any) => any;
    handleCancel: () => any;
    onClose: () => any;
}

export default function OverlayScreen({ open, label, handleConfirm, handleCancel, onClose }: overlayScreenProps) {
    const [formData, setFormData] = useState({
        value: '',
    });
    const [value, setValue] = useState();

    return (
        <Dialog open={open}>
            <DialogContent>
                <TextField
                    id="overlay-input"
                    name={label}
                    label={label}
                    type="text"
                    fullWidth
                    variant="outlined"
                    required
                    onChange={(e: any) => setValue(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => {
                        handleConfirm(value);
                        onClose();
                    }}
                >
                    Confirm
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        handleCancel();
                        onClose();
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>

        </Dialog>
    );
}
