import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location'; // Using expo-location
import LocationInput from './LocationInput';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { userCookie } from "@/app/api-request/config";
import { jwtDecode } from 'jwt-decode';

const PickupDropScreen = () => {
    const navigation = useNavigation();

    const [pickupLocation, setPickupLocation] = useState<string | null>(null);
    const [dropLocation, setDropLocation] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    const retrieveUserId = async () => {
        try {
            const token = await AsyncStorage.getItem(userCookie);
            if (!token) throw new Error("Token not found in AsyncStorage");
            
            const decodedToken: any = jwtDecode(token);
            const user_id = decodedToken.id;
            if (user_id) setUserId(user_id);
        } catch (error) {
            console.error("Failed to decode token or retrieve user_id:", error);
            Alert.alert("Error", "Failed to retrieve user information.");
        }
    };

    // Fetch current location and convert it to an address
    const fetchCurrentLocation = async () => {
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "Location access is required.");
            return;
        }

        // Get current position
        const { coords } = await Location.getCurrentPositionAsync({});
        
        // Reverse geocode to get a detailed address
        const places = await Location.reverseGeocodeAsync({
            latitude: coords.latitude,
            longitude: coords.longitude,
        });

        if (places.length > 0) {
            const place = places[0]; // Extract the first result
            
            // Detailed address components
            const street = place.street || place.name || ''; // Street name or POI
            const subregion = place.subregion || ''; // Subregion or neighborhood
            const city = place.city || ''; // City or town
            const region = place.region || ''; // State or region
            const postalCode = place.postalCode || ''; // Postal/Zip code
            const country = place.country || ''; // Country
            
            // Construct the detailed address
            const detailedAddress = `${street}, ${subregion}, ${city}, ${region} ${postalCode}, ${country}`;
            
            // Set the pickup location with the detailed address
            setPickupLocation(detailedAddress);
        }
    } catch (error) {
        console.error("Error fetching detailed location:", error);
        Alert.alert("Error", "Failed to fetch location.");
    }
};

    

    useEffect(() => {
        (async () => {
            await retrieveUserId();
            await fetchCurrentLocation();
            setLoading(false);
        })();
    }, []);

    const clearPickupLocation = () => setPickupLocation(null);
    const clearDropLocation = () => setDropLocation(null);

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <>
                    <LocationInput
                        label="Pickup Location"
                        value={pickupLocation ?? ''}
                        onChangeText={(text) => setPickupLocation(text)}
                        onSelectMap={() => navigation.navigate('' as never,)}
                        onClear={clearPickupLocation}
                    />
                    <LocationInput
                        label="Drop Location"
                        value={dropLocation ?? ''}
                        onChangeText={(text) => setDropLocation(text)}
                        onSelectMap={() => navigation.navigate('' as never,)}
                        onClear={clearDropLocation}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
});

export default PickupDropScreen;
