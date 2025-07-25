import { Box, Button, Typography } from '@mui/joy';
import { Home, ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            p: 2
        }}>
            <Typography level="h1" sx={{ fontSize: '8rem', mb: 2, color: 'primary.500' }}>
                404
            </Typography>
            <Typography level="h3" sx={{ mb: 2 }}>
                Page Not Found
            </Typography>
            <Button
                component={Link}
                to="/"
                startDecorator={<Home />}
                size="lg"
                sx={{ m: 5 }}
            >
                Go to Home
            </Button>
            <Button
                variant="outlined"
                startDecorator={<ArrowBack />}
                size="lg"
                onClick={() => window.history.back()}
            >
                Go Back
            </Button>
        </Box>
    );
};

export default NotFoundPage;