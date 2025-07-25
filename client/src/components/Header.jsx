import { useState } from 'react';
import {
    Sheet,
    Typography,
    Box,
    Avatar,
    Stack,
    Chip,
    Tooltip,
    Button,
    IconButton
} from '@mui/joy';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CircleIcon from '@mui/icons-material/Circle';
import { clearRoom } from '../store/roomSlice';
import { resetSocketState } from '../store/socketSlice';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import ThemeToggle from './ThemeToggle';
import InviteUserModal from './InviteUserModal';

export default function Header() {
    const { users, host: hostEmail } = useSelector((state) => state.room || {});
    const { name: currentUsername = "Anonymous User", email: currentUserEmail, profileImage } = useSelector((state) => state.auth.userInfo || {});
    const { connected, socket } = useSelector(state => state?.socket || {});
    const [openModal, setOpenModal] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleUserLeaveRoom = () => {
        if (!socket) return
        socket.disconnect();
        dispatch(clearRoom());
        dispatch(resetSocketState());
        navigate('/');
    }

    return (
        <Sheet
            component="header"
            variant="soft"
            color="neutral"
            sx={{
                width: '100%',
                px: 3,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.surface',
                zIndex: 1000,
                borderRadius: 0,
            }}
        >
            <Box display="flex" alignItems="center" gap={1.5}>
                <Avatar
                    src={profileImage || ''}
                    sx={{
                        border: '2px solid',
                        borderColor: 'primary.outlinedBorder',
                        width: 40,
                        height: 40,
                    }}
                >
                    {currentUsername[0].toUpperCase()}
                </Avatar>
                <Box>
                    <Typography level="body-md">{currentUsername}</Typography>
                    <Tooltip
                        color={connected ? 'success' : 'danger'}
                        title={connected ? 'Connected' : 'Disconnected'}
                        placement="bottom"
                        variant="outlined"
                        arrow
                    >
                        <Chip
                            size="sm"
                            variant="soft"
                            color={connected ? "success" : "danger"}
                            startDecorator={<CircleIcon sx={{ fontSize: 10 }} />}
                        >
                            You
                        </Chip>
                    </Tooltip>
                </Box>
            </Box>

            <Box flex={1} display="flex" justifyContent="center" alignItems="center" gap={1}>
                {users
                    ?.filter((user) => user?.name !== currentUsername)
                    ?.map((user) => (
                        <Tooltip key={user?._id} title={user.name} color="primary" variant="outlined" arrow>
                            <Avatar
                                src={user.profileImage}
                                slotProps={{ img: { referrerPolicy: "no-referrer" } }}
                                variant="soft"
                                color="primary"
                                sx={{
                                    fontSize: 15,
                                    width: 40,
                                    height: 40,
                                    border: '1px solid',
                                    borderColor: 'primary.outlinedBorder',
                                }}
                            >
                                {user.name[0].toUpperCase()}
                            </Avatar>
                        </Tooltip>
                    ))}
            </Box>

            <Stack direction="row" alignItems="center" spacing={1}>
                {currentUserEmail === hostEmail && connected && (
                    <Button
                        variant="soft"
                        color="primary"
                        startDecorator={<PersonAddIcon />}
                        onClick={() => setOpenModal(true)}
                    >
                        Invite
                    </Button>
                )}
                {
                    connected && (
                        <Tooltip title="Leave" color='danger' variant='outlined' arrow>
                            <IconButton variant="soft" color="danger" onClick={handleUserLeaveRoom}>
                                <LogoutIcon />
                            </IconButton>
                        </Tooltip>
                    )
                }
                <ThemeToggle />
            </Stack>

            <InviteUserModal
                open={openModal}
                onClose={() => setOpenModal(false)}
            />

        </Sheet>
    );
}