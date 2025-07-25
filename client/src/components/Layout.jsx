import Header from './Header';
import { Outlet } from 'react-router-dom';
import Box from '@mui/joy/Box';

const Layout = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Outlet />
        </Box>
    );
}

export default Layout;
