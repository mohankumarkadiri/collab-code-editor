import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from '../hooks/SnackBarProvider';
import { login, logout } from '../store/authSlice';
import Loading from './Loading';
import ServerError from './ServerError';
import Box from '@mui/joy/Box';
import axiosClient from '../utils/axiosClient';


const LayoutProtectedRoute = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const openSnackbar = useSnackbar();
    let [loading, setLoading] = useState(true);
    let [errors, setErrors] = useState('');
    let isLoggedIn = useSelector(state => state?.auth?.loggedIn);

    useEffect(() => {
        let TRIES_LEFT = 5;
        async function isAuthenticated() {
            setLoading(true);
            try {
                let response = await axiosClient.get('/api');
                dispatch(login(response?.data));
                setLoading(false);
                setErrors('');
            } catch (err) {
                TRIES_LEFT--;
                if (err?.response?.status === 401) {
                    setTimeout(() => {
                        openSnackbar('UnAuthorized User! Please SIGN IN', 'danger');
                    }, 1000);
                    setTimeout(() => {
                        dispatch(logout());
                        navigate('/login');
                    }, 2000);
                } else {
                    if (TRIES_LEFT) {
                        await isAuthenticated();
                    } else {
                        setLoading(false);
                        setErrors(err?.message);
                    }
                }
            }
        }
        if (!isLoggedIn) {
            isAuthenticated();
        }
        // eslint-disable-next-line
    }, [])
    return (
        <>
            {loading && <Loading />}
            {!loading && errors && <ServerError errors={errors} />}
            {!loading && !errors && (
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <Outlet />
                </Box>
            )}
        </>
    );
};

export default LayoutProtectedRoute;