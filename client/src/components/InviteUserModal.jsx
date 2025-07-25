import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Modal,
    ModalDialog,
    DialogTitle,
    DialogContent,
    FormControl,
    Input,
    Stack,
    Button,
} from '@mui/joy';
import axiosClient from '../utils/axiosClient';
import { useSnackbar } from '../hooks/SnackBarProvider';

export default function InviteUserModal({ open, onClose }) {
    const [email, setEmail] = useState('');
    const { roomId } = useParams();
    const openSnackbar = useSnackbar();
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email.trim()) return;
        try {
            await axiosClient.post(`/room/${roomId}/invite`, { email });
            openSnackbar(`${email} has been invited successfully`, 'success');
        } catch (error) {
            openSnackbar(error?.response?.data?.message || 'Failed to invite the user', 'danger');
        }
        setEmail('');
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                sx={{
                    borderRadius: 'lg',
                    width: 400,
                    p: 3,
                    boxShadow: 'lg',
                }}
            >
                <DialogTitle>Invite User</DialogTitle>
                <DialogContent>Enter user's email to invite.</DialogContent>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <FormControl>
                            <Input
                                autoFocus
                                required
                                placeholder="e.g. dracarys@Valyrian.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                color='primary'
                            />
                        </FormControl>
                        <Button type="submit" variant="solid" color="primary">
                            Invite
                        </Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
}
