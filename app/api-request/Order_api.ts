// apiRequests/orderRouter.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { origin, userCookie } from './config';

// Get authentication token
const getAuthToken = async (): Promise<string> => {
    const token = await AsyncStorage.getItem(userCookie);
    if (!token) {
        throw new Error('Token not found in AsyncStorage');
    }
    return token;
};

// Retrieve orders for a specific user
export const getOrdersByuser_id = async (user_id: number) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(`${origin}/api/v1/bookings/user/${user_id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error retrieving orders:", error.response ? error.response.data : error.message);
        return { error: error.response?.data?.message || "An unknown error occurred" };
    }
};
