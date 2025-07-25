import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Input,
    Typography,
    Stack,
    Card,
    CardContent,
    Grid,
    Chip,
    IconButton
} from '@mui/joy';
import { useSnackbar } from '../hooks/SnackBarProvider';
import axiosClient from '../utils/axiosClient';
import GroupIcon from '@mui/icons-material/Group';
import LaunchIcon from '@mui/icons-material/Launch';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function HomePage() {
    const [roomId, setRoomId] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const openSnackbar = useSnackbar();

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axiosClient.get('/room');
            const allRooms = response.data || [];
            setRooms(allRooms);
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const createRoom = async () => {
        setIsCreating(true);
        try {
            const response = await axiosClient.post('/room');
            const newRoomId = response.data?._id;
            if (newRoomId) {
                navigate(`/room/${newRoomId}`);
            } else {
                openSnackbar('Something went wrong', 'danger');
            }
        } catch (error) {
            openSnackbar(
                error.response?.data?.message || 'Failed to create room',
                'danger'
            );
        } finally {
            setIsCreating(false);
        }
    };

    const joinRoom = async () => {
        if (!roomId.trim()) return;
        setIsJoining(true);
        try {
            await axiosClient.post(`/room/${roomId}/join`, { roomId: roomId.trim() });
            navigate(`/room/${roomId.trim()}`);
        } catch (error) {
            openSnackbar(
                error.response?.data?.message || 'Failed to join room',
                'danger'
            );
        } finally {
            setIsJoining(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Box sx={{ p: 4, maxWidth: '100%' }}>
            <Stack spacing={2} sx={{ mb: 4 }} direction={{ xs: 'column', sm: 'row' }}>
                <Button
                    onClick={createRoom}
                    loading={isCreating}
                    size="lg"
                    variant="solid"
                    sx={{ minWidth: 140 }}
                >
                    Create Room
                </Button>

                <Box sx={{ display: 'flex', gap: 1, flex: 1, maxWidth: 400 }}>
                    <Input
                        placeholder="Enter room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
                        size="lg"
                        sx={{ flex: 1 }}
                    />
                    <Button
                        onClick={joinRoom}
                        loading={isJoining}
                        disabled={!roomId.trim()}
                        size="lg"
                        variant="outlined"
                    >
                        Join
                    </Button>
                </Box>
            </Stack>

            <Box>
                <Typography level="h4" sx={{ mb: 2 }}>
                    My Rooms
                </Typography>

                {loading ? (
                    <Typography>Loading...</Typography>
                ) : rooms.length === 0 ? (
                    <Typography sx={{ color: 'text.secondary' }}>
                        You have not joined any rooms yet.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {rooms.map((room) => (
                            <Grid key={room._id} xs={4} sm={6} lg={12}>
                                <Card
                                    variant="outlined"
                                    onClick={() => navigate(`/room/${room._id}`)}
                                    sx={{
                                        height: '100%',
                                        p: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        '&:hover': { boxShadow: 'md' },
                                        borderRadius: 'lg',
                                    }}
                                >
                                    <CardContent sx={{ p: 0 }}>
                                        <Stack spacing={2}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography
                                                    level="title-sm"
                                                    sx={{
                                                        fontFamily: 'monospace',
                                                        overflowWrap: 'anywhere',
                                                        fontSize: 'sm',
                                                        maxWidth: '80%',
                                                    }}
                                                >
                                                    {room._id}
                                                </Typography>
                                                <IconButton size="sm" variant="plain">
                                                    <LaunchIcon fontSize="small" />
                                                </IconButton>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <AccessTimeIcon sx={{ fontSize: 16 }} />
                                                <Typography level="body-sm">
                                                    {formatDate(room.createdAt || room.updatedAt)}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <GroupIcon sx={{ fontSize: 16 }} />
                                                    <Typography level="body-sm">
                                                        {room.users?.length || 0} user{room.users?.length !== 1 && 's'}
                                                    </Typography>
                                                </Box>
                                                {room.status && (
                                                    <Chip size="sm" variant="soft">
                                                        {room.status}
                                                    </Chip>
                                                )}
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
}