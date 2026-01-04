import axios from 'axios';

const API_URL = '/api/user/orders';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

const orderService = {
    placeOrder: async (orderData) => {
        const response = await axios.post(`${API_URL}/place`, orderData, getAuthHeaders());
        return response.data;
    },

    getMyOrders: async () => {
        const response = await axios.get(`${API_URL}/my-orders`, getAuthHeaders());
        return response.data;
    },

    getOrderById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    },

    cancelOrder: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    }
};

export default orderService;
