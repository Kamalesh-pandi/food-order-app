import api from '../api/axios';

const API_URL = '/api/auth';

const authService = {
    signup: async (userData) => {
        const response = await api.post(`${API_URL}/signup`, userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    login: async (credentials) => {
        // Ensure no stale token is sent with login request
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        const response = await api.post(`${API_URL}/login`, credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    updateProfile: async (formData) => {
        // api interceptor adds the token automatically
        const response = await api.put('/api/users/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default authService;
