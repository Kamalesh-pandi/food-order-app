import axios from 'axios';

const API_URL = '/api/cart';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

const cartService = {
    getCart: async () => {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    },

    addToCart: async (foodId, quantity = 1) => {
        const response = await axios.post(`${API_URL}/add`, { foodId, quantity }, getAuthHeaders());
        return response.data;
    },

    updateQuantity: async (foodId, quantity) => {
        const response = await axios.put(`${API_URL}/update`, { foodId, quantity }, getAuthHeaders());
        return response.data;
    },

    removeFromCart: async (foodId) => {
        const response = await axios.delete(`${API_URL}/remove/${foodId}`, getAuthHeaders());
        return response.data;
    },

    clearCart: async () => {
        const response = await axios.delete(`${API_URL}/clear`, getAuthHeaders());
        return response.data;
    }
};

export default cartService;
