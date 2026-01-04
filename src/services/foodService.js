import axios from 'axios';

const API_URL = '/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
};

const foodService = {
    getAllCategories: async () => {
        const response = await axios.get(`${API_URL}/categories`, getAuthHeaders());
        return response.data;
    },

    getAllFoods: async (params = {}) => {
        try {
            const config = {
                ...getAuthHeaders(),
                params
            };
            const response = await axios.get(`${API_URL}/foods`, config);
            console.log("getAllFoods response:", response.data);
            return response.data;
        } catch (error) {
            console.error("getAllFoods error:", error);
            throw error;
        }
    },

    getFoodById: async (id) => {
        const response = await axios.get(`${API_URL}/foods/${id}`, getAuthHeaders());
        return response.data;
    }
};

export default foodService;
