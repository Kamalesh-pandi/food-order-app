import axios from 'axios';

// const BASE_URL = 'http://16.171.10.128:8081'; // URL is handled by Vite proxy now

const api = axios.create({
    // baseURL: BASE_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Clear token and redirect to login if unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // window.location.href = '/login'; // Optional: Redirect or let context handle it
        }
        return Promise.reject(error);
    }
);

export default api;
