import React, { useEffect, useState, memo } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getOrdersByuser_id } from '../api-request/Order_api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { jwtDecode } from "jwt-decode";
import { userCookie } from '../api-request/config';

interface Booking {
    booking_id: number;
    pickup_address: string;
    dropoff_address: string;
}

interface Driver {
    driver_id: number;
    driver_name: string;
    vehicle_type: string;
}

interface User {
    id: number;
    username: string;
}

interface Order {
    request_id: number;
    Booking: Booking;
    Driver?: Driver;
    User: User;
    status: string;
}

const OrdersScreen: React.FC = () => {
    const [data, setData] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [user_id, setuser_id] = useState<number | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchuser_id = async () => {
            try {
                const token = await AsyncStorage.getItem(userCookie);
                if (!token) throw new Error('Token not found in AsyncStorage');

                const decodedToken: any = jwtDecode(token);
                setuser_id(decodedToken.id);
            } catch (error) {
                console.error('Failed to fetch user ID:', error);
                Alert.alert('Error', 'Failed to fetch user ID');
            }
        };

        fetchuser_id();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (user_id === null) return;

            try {
                const result = await getOrdersByuser_id(user_id);
                console.log("API result:", result); // Log the API result
                if (result.error) {
                    console.error('API error:', result.error);
                    Alert.alert('Error', result.error);
                } else if (Array.isArray(result)) {
                    setData(result);
                } else {
                    console.error('Unexpected data format:', result);
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                Alert.alert('Error', 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user_id]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (data.length === 0) {
        return (
            <View style={styles.container}>
                <Text>No past orders available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <OrderItem item={item} navigation={navigation} />
                )}
                keyExtractor={(item) => (item.request_id ? item.request_id.toString() : Math.random().toString())}
            />
        </View>
    );
};

const OrderItem: React.FC<{ item: Order; navigation: any }> = memo(({ item, navigation }) => {
    const vehicleImage = item.Driver?.vehicle_type === 'Car'
        ? require('../../assets/images/Truck.png')
        : item.Driver?.vehicle_type === 'auto'
            ? require('../../assets/images/Auto.png')
            : null;

    const statusColor = item.status === 'Completed'
        ? 'green'
        : item.status === 'Pending'
            ? 'red'
            : item.status === 'Rejected'
                ? 'gray'
                : 'green';

    // Log to check if addresses exist
    console.log('Pickup Address:', item.Booking?.pickup_address);
    console.log('Dropoff Address:', item.Booking?.dropoff_address);

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('IndetailedorderScreen', { order: item })}
        >
            <View style={styles.row}>
                <Image source={vehicleImage} style={styles.image} resizeMode="contain" />
                <View style={styles.column}>
                    <Text style={styles.vehicle}>{item.Driver?.vehicle_type || 'Unknown Vehicle'}</Text>
                    <Text style={styles.time}>Order ID: {item.Booking?.booking_id || 'Unknown ID'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="black" style={styles.arrowIcon} />
            </View>
            <View style={styles.details}>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <View style={styles.dotGreen} />
                        <Text style={styles.detailText}>
                            Pickup: {item.Booking?.pickup_address || 'Pickup Address Not Available'}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <View style={styles.dotRed} />
                        <Text style={styles.detailText}>
                            Drop: {item.Booking?.dropoff_address || 'Dropoff Address Not Available'}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.footer}>
                <View style={styles.statusContainer}>
                    <Ionicons
                        name={item.status === 'Completed' ? "checkmark-circle-outline" : "remove-circle-outline"}
                        size={12}
                        color={statusColor}
                    />
                    <Text style={[styles.status, { color: statusColor }]}>
                        {item.status || 'Unknown Status'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        marginRight: 16,
    },
    column: {
        flex: 1,
    },
    vehicle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    time: {
        fontSize: 14,
        color: '#888',
    },
    arrowIcon: {
        marginLeft: 'auto',
    },
    details: {
        marginVertical: 8,
    },
    detailsContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dotGreen: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'green',
        marginRight: 8,
    },
    dotRed: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'red',
        marginRight: 8,
    },
    detailText: {
        fontSize: 14,
    },
    footer: {
        marginTop: 8,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    status: {
        fontSize: 12,
        marginLeft: 8,
    },
});

export default OrdersScreen;
