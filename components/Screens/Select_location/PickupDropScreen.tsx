import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userCookie } from "@/app/api-request/config";
import { GooglePlacesAutocomplete, GooglePlaceData, GooglePlaceDetail } from 'react-native-google-places-autocomplete'; 
import config from '@/app/api-request/config';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '@/app/index';
import { jwtDecode } from 'jwt-decode';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextInput as PaperInput } from 'react-native-paper'; // Import Paper TextInput

type DropLocation = {
    name: string;
    latitude: number;
    longitude: number;
} | null;

type PickupDropScreenRouteProp = RouteProp<RootStackParamList, 'PickupDropScreen'>;

const PickupDropScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'SelectPickupOnMapScreen'>>();
    const route = useRoute<PickupDropScreenRouteProp>();
    const name = route?.params?.name || "Unknown";
    const address = route?.params?.address || "Fetching current location...";
    console.log("Address with lat & lng:", address)
    const phone = route?.params?.phone || "Unknown";
    const [pickupLocation, setPickupLocation] = useState<string | null>("Fetching current location...");
    const [dropLocation, setDropLocation] = useState<DropLocation>(null);
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
            setPickupLocation(address.name || 'Fetching current location...');
            setLoading(false);
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
            navigation.navigate('ReceiverDetailsScreen', { 
                location: selectedLocation, 
                name: userName || 'Unknown',
                address: address || 'Fetching current location...',
                phone: userPhone || 'Unknown',
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
                    {/* Main Container with Icons and Inputs */}
                    <View style={styles.iconLineContainer}>
                    <View style={styles.iconLine}>
                            <MaterialIcons name="place" size={30} color="green" style={styles.circleIcon} />
                            <View style={styles.verticalLine} />
                            <MaterialIcons name="place" size={30} color="red" style={styles.circleIconRed} />
                        </View>
                        
                        {/* Inputs Container */}
                        <View style={styles.inputFieldContainer}>
                            {/* Pickup Location */}
                            <TouchableOpacity onPress={() => navigation.navigate('SelectPickupLocation' as never)}>
                                <View style={styles.inputContainer}>
                                    <View style={styles.row}>
                                        <Text style={styles.userDetails}>{userName} · {userPhone}</Text>
                                        <MaterialIcons name="keyboard-arrow-right" size={24} color="#000" />
                                    </View>
                                    <PaperInput
                                        mode="outlined"
                                        label="Pickup Location"
                                        value={pickupLocation ?? 'Fetching location...'}
                                        editable={false}
                                        style={styles.pickupInput}
                                    />
                                </View>
                            </TouchableOpacity>

                            {/* Drop Location */}
                            <GooglePlacesAutocomplete
                                placeholder="Where is your Drop?"
                                onPress={handlePlaceSelect}
                                query={{
                                    key: config.GOOGLE_API_KEY,
                                    language: 'en',
                                }}
                                fetchDetails={true}
                                minLength={2}
                                debounce={300}
                                styles={{
                                    textInput: styles.dropInput,
                                    listView: {
                                        ...styles.listView, // existing styles
                                        zIndex: 1000,      // Ensure suggestions are on top
                                        position: 'absolute', // Prevent it from being pushed down
                                        top: 60, // Adjust this as necessary
                                    },
                                }}
                            />
                        </View>
                    </View>

                    {/* Select on Map Button */}
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

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: width * 0.05,
        justifyContent: 'space-between', // Adjust to space items evenly
    },
    iconLineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconLine: {
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 10,
    },
    circleIcon: {
        marginBottom: 5,
        paddingTop: 15,
        marginTop: 12,
    },
    verticalLine: {
        width: 2,
        height: 60,
        backgroundColor: '#888',
    },
    circleIconRed: {
        marginTop: 5,
    },
    inputFieldContainer: {
        flex: 1,
        position: 'relative', // Ensure child elements are properly positioned
    },
    inputContainer: {
        // padding:15,
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    pickupInput: {
        fontSize: 16,
        color: '#555',
    },
    dropInput: {
        fontSize: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 2,
    },
    listView: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        // Additional styles can be added here if needed
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
        paddingVertical: 14,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        marginTop: 20, // Add some space above the button
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
        fontWeight: 'bold',
    },
});

export default PickupDropScreen;