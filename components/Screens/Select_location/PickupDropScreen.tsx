import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userCookie } from "@/app/api-request/config";
import { GooglePlacesAutocomplete, GooglePlaceData, GooglePlaceDetail } from 'react-native-google-places-autocomplete'; 
import config from '@/app/api-request/config';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '@/app/index';
import { jwtDecode } from 'jwt-decode';
import { StackNavigationProp } from '@react-navigation/stack';
type DropLocation = {
    name: string;
    latitude: number;
    longitude: number;
} | null;
type PickupDropScreenRouteProp = RouteProp<RootStackParamList, 'PickupDropScreen'>;

const PickupDropScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'SelectPickupOnMapScreen'>>(); // Type the navigation
   
    const route = useRoute<PickupDropScreenRouteProp>();
    const name = route?.params?.name || "Unknown"; // Provide default value if undefined
    const address = route?.params?.address || "Fetching current location...";
    const phone = route?.params?.phone || "Unknown";

    const [pickupLocation, setPickupLocation] = useState<string | null>("Fetching current location...");
    const [dropLocation, setDropLocation] =useState<DropLocation>(null);
    const [userPhone, setUserPhone] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<string | null>(null);

    const retrieveUserInfo = async () => {
        try {
            const token = await AsyncStorage.getItem(userCookie);
            if (!token) throw new Error("Token not found in AsyncStorage");
            
            const decodedToken: any = jwtDecode(token);
            const user_id = decodedToken.id;
            setUserId(user_id);
        } catch (error) {
            console.error("Failed to decode token or retrieve user info:", error);
            Alert.alert("Error", "Failed to retrieve user information.");
        }
    };

    useEffect(() => {
        if (route.params) {
           const { name, address, phone } = route.params;
           setUserName(name || 'Unknown');
           setUserPhone(phone || 'Unknown');
           setPickupLocation(address || 'Fetching current location...');
           setLoading(false); // Disable loading once data is ready
        }
     }, [route.params]);

    const handlePlaceSelect = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
        if (details && details.geometry) {
            const { lat, lng } = details.geometry.location;
            const selectedLocation = {
                name: data.description,
                latitude: lat,
                longitude: lng,
            };
            setDropLocation(selectedLocation);
            console.log("shashi",selectedLocation);
            // Correctly pass the selected location when navigating
            navigation.navigate('ReceiverDetailsScreen', { 
                location: selectedLocation, 
                name: userName || 'Unknown',  // Default to 'Unknown' if null
                address: address || 'Fetching current location...',  // Ensure address is string
                phone: userPhone || 'Unknown',  // Default to 'Unknown' if null
              });
               } else {
            Alert.alert("Error", "Could not retrieve location details.");
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <>
                    <Text style={styles.label}>Pickup Location</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SelectPickupLocation' as never)}>
                        <View style={styles.inputContainer}>
                            <View style={styles.row}>
                                <Text style={styles.userDetails}>{userName} · {userPhone}</Text>
                                <MaterialIcons name="keyboard-arrow-right" size={24} color="#000" />
                            </View>
                            <TextInput
                                style={styles.input}
                                value={pickupLocation ?? 'Fetching location...'}
                                editable={false}
                            />
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.label}>Drop Location</Text>
                    <GooglePlacesAutocomplete
                        placeholder="Where is your Drop?"
                        onPress={handlePlaceSelect}
                        query={{
                            key: config.GOOGLE_API_KEY,
                            language: 'en',
                        }}
                        fetchDetails={true} // This enables fetching extra location details like latitude and longitude
                        styles={{
                            textInput: styles.dropInput,
                        }}
                    />


                    <TouchableOpacity
                        style={styles.selectOnMapButton}
                        onPress={() => navigation.navigate('SelectDropOnMapScreen' as never)}
                    >
                        <MaterialIcons name="place" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Select on Map</Text>
                    </TouchableOpacity>
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
        paddingTop: 25,
    },
    inputContainer: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 20,
    },
    input: {
        fontSize: 16,
    },
    dropInput: {
        fontSize: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'lightgrey',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    userDetails: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    selectOnMapButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
        fontWeight: 'bold',
    },
});

export default PickupDropScreen;
