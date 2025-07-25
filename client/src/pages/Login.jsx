import { useEffect } from 'react';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import { useColorScheme } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Avatar from '@mui/joy/Avatar';
import Icon from '../assets/Images/icon.png';
import GoogleIcon from '../assets/SVG/google.svg';
import config from '../config';

export default function LoginPage() {
    const { mode, setMode } = useColorScheme();

    useEffect(() => {
        document.title = 'Login';
    }, []);

    const handleSignIn = () => {
        window.open(`${config.SERVER_BASE_ADDRESS}/auth/google`, '_self');
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flex={1}
            height="100%"
            sx={{
                background: 'linear-gradient(145deg, primary.100, primary.200)',
            }}
        >
            <Sheet
                variant="soft"
                color="background"
                sx={{
                    p: 4,
                    borderRadius: 'xl',
                    boxShadow: 'xl',
                    width: 360,
                }}
            >
                <Stack spacing={3} alignItems="center">
                    <Avatar
                        src={Icon}
                        size="lg"
                        variant="soft"
                        color="neutral"
                        sx={{
                            background: 'None',
                            width: '120px',
                            aspectRatio: 1,
                            mixBlendMode: mode === 'dark' ? 'hard-light' : 'luminosity',
                            borderRadius: 0
                        }}
                    />

                    <Typography level="h2" fontWeight="xl" textAlign="center">
                        Collab Code Editor
                    </Typography>

                    <Typography level="body2" color="text.secondary" textAlign="center">
                        Coding together in real-time
                    </Typography>

                    <Button
                        fullWidth
                        size="lg"
                        variant="outlined"
                        color="primary"
                        startDecorator={
                            <Avatar
                                src={GoogleIcon}
                                size="sm"
                                variant="plain"
                                color="background"
                            />
                        }
                        endDecorator="→"
                        onClick={handleSignIn}
                    >
                        Sign in with Google
                    </Button>
                </Stack>
            </Sheet>
        </Box>
    );
}