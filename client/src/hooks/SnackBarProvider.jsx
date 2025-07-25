import { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '@mui/joy/Snackbar';
import Typography from '@mui/joy/Typography';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ReportIcon from '@mui/icons-material/Report';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: '',
        color: 'primary',
        icon: <InfoIcon />
    });

    function getIcon(color) {
        switch (color) {
            case 'danger':
                return <ReportIcon />
            case 'warning':
                return <WarningIcon />
            case 'success':
                return <CheckCircleIcon />
            default:
                return <InfoIcon />
        }
    }

    const openSnackbar = useCallback((message, color = 'primary') => {
        setSnackbarState({ open: true, message, color, icon: getIcon(color) });
    }, []);

    const closeSnackbar = useCallback(() => {
        setSnackbarState({ ...snackbarState, open: false });
    }, [snackbarState]);

    return (
        <SnackbarContext.Provider value={openSnackbar}>
            {children}
            <Snackbar
                autoHideDuration={3000}
                open={snackbarState.open}
                variant="solid"
                color={snackbarState.color}
                onClose={(event, reason) => {
                    if (reason === 'clickaway') {
                        return;
                    }
                    closeSnackbar();
                }
                }
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                startDecorator={snackbarState.icon}
            >
                <Typography sx={{
                    fontFamily: 'Poppins-Medium',
                    color: 'inherit'
                }}>
                    {snackbarState.message}
                </Typography>
            </Snackbar>
        </SnackbarContext.Provider >
    );
};

export const useSnackbar = () => {
    return useContext(SnackbarContext);
};