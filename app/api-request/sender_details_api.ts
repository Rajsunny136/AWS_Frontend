import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userCookie, origin } from './config';

// Function to get auth token (if needed for protected endpoints)
const getAuthToken = async (): Promise<string> => {
    const token = await AsyncStorage.getItem(userCookie);
    if (!token) {
        throw new Error('Token not found in AsyncStorage');
    }
    return token;
};

// Post sender details to the backend
export const createSenderDetails = async (data:any) => {
    
    const newData = JSON.stringify(data);
    try {
        const response = await axios({
            method: 'post',
            url: `${origin}/api/v1/sender-details/`, // Replace with your actual backend URL
            headers: {
                'Content-Type': 'application/json',
            },
            data: newData,
        });
        console.log('Response from API:', response); // Log the full response
        return response.data;
    } catch (error: any) {
        console.error('Error in createSenderDetails:', error.message);
        console.log('Error response:', error.response); // Log the error response
        return { error: error.response?.data?.message || 'An unknown error occurred' };
    }
};

export const createReceiverDetails = async (data: any) => {
    const newData = JSON.stringify(data);

    try {
        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem(userCookie);
        console.log(token);

        if (!token) {
            throw new Error("Token not found in AsyncStorage");
        }

        // Make the API request
        const response = await axios({
            method: 'post',
            url: `${origin}/api/v1/reciever/`, // Replace with your actual backend URL
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`, // Include the token in the request header
            },
            data: newData,
        });

        console.log('Response from API:', response); // Log the full response
        return response.data;
    } catch (error: any) {
        console.error('Error in createReceiverDetails:', error.message);
        console.log('Error response:', error.response); // Log the error response
        return { error: error.response?.data?.message || 'An unknown error occurred' };
    }
};