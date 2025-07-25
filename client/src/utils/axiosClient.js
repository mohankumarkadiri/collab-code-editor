import axios from 'axios';
import config from '../config';

const axiosClient = axios.create({
    baseURL: config.SERVER_BASE_ADDRESS,
    withCredentials: true,
});

axiosClient.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;