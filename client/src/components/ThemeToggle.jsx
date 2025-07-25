import IconButton from '@mui/joy/IconButton';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useColorScheme } from '@mui/joy/styles';

export default function ThemeToggle() {
    const { mode, setMode } = useColorScheme();

    const toggleColorMode = () => {
        setMode(mode === 'dark' ? 'light' : 'dark');
    };

    return (
        <IconButton variant="plain" onClick={toggleColorMode}>
            {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
        </IconButton>
    );
}
