import Lottie from 'lottie-react';
import LottieFile from '../assets/Lottie/ServerError.json';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import ReplayIcon from '@mui/icons-material/Replay';

const ServerError = ({ errors }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            height: '70%'
        }}>
            <Lottie
                animationData={LottieFile}
                loop={true}
                autoplay={true}
                style={{
                    width: '40%',
                    height: '40%'
                }}
            />
            <Typography color='danger' fontSize={29} component="h1">There is an issue with site access</Typography>
            <Typography color='danger' fontSize={17} component="span">{errors}</Typography>
            <Button
                variant='soft'
                color='danger'
                startDecorator={<ReplayIcon />}
                sx={{
                    marginTop: '40px'
                }}
                onClick={() => {
                    window.location.href = '/';
                }}
            >
                Try Again
            </Button>
        </div>
    );
}

export default ServerError;