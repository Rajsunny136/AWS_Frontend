import axios from 'axios';
import {origin} from './config'
import { userCookie } from "./config";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const sendUserOTP = async (data: any) => {
    console.log(origin);
    const newData = JSON.stringify(data);
    try {
         
        const response = await axios({
            method: 'post',
            url: `${origin}/api/v1/otp/send-otp`,
            headers: {
                "Content-Type": "application/json",
                
            },
            data: newData
        });
        return response.data;

    } catch (error: any) {
        console.log(error);

        if (error.isAxiosError) {
            if (!error.response) {
                // Network error: No response received
                return { error: "Unable to connect to the server. Please Try Again." };
            } else {
                // Server error: Response received with a status code out of the 2xx range
                return {
                    error: error.response.data?.message || "Server error: Please try again later.",
                    status: error.response.status,
                };
            }
        }
        // Handle unexpected errors
        return { error: "Unexpected error: Please try again later." };
    }
};

export const verifyUserOTP = async (data: { phone: string; otp: string; orderId: string }) => {
    try {
         
      const response = await axios.post(`${origin}/api/v1/otp/verify-otp`, data, {
        headers: {
          "Content-Type": "application/json",
        
        }
      });
  
      return response.data;
    } catch (error: any) {
      console.error('Error verifying OTP:', error.response ? error.response.data : error.message);
      return error.response ? error.response.data : { message: 'An unexpected error occurred' };
    }
  };



export const getUserDetails = async (phone: string, token: string) => {
    try {
        const token = await AsyncStorage.getItem('userCookie');console.log(token);
        if(!token) {
            throw new Error(("token not found in async storage"));
            
        }
        const response = await axios({
            method: 'get',
            url: `${origin}/api/v1/user/user-details`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            params: {
                phone
            }
        });
        const responseData = await response.data;
        return responseData;
    } catch (error: any) {
        return error.response.data;
    }
};