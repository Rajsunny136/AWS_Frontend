import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';

interface Booking {
    booking_id: number;
    pickup_address: string;
    dropoff_address: string;
    pickup_time: string;
    dropoff_time: string;
}

interface Driver {
    driver_id: number;
    driver_name: string;
    vehicle_type: string;
    vehicle_number: string;
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

type VehicleType = 'car' | '3wheeler';

const vehicleImages: { [key in VehicleType]: any } = {
    'car': require('../../../assets/images/Truck.png'),
    '3wheeler': require('../../../assets/images/Auto.png'),
};

const IndetailedorderScreen: React.FC = () => {
    const route = useRoute<RouteProp<{ params: { order: Order } }>>();
    const navigation = useNavigation();
    const { order } = route.params;

    // Default to 'Car' if vehicle type is not found
    const vehicleType: VehicleType = (order.Driver?.vehicle_type.toLowerCase() as VehicleType) || 'car';
    const vehicleImage = vehicleImages[vehicleType] || vehicleImages['car'];

    // Format date and time
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Order Details</Text>
            </View>

            {/* Ride Information */}
            <View style={styles.rideInfoContainer}>
                <View style={styles.rideHeader}>
                    <Image source={vehicleImage} style={styles.vehicleImage} />
                    <View style={styles.rideInfoText}>
                        <Text style={styles.rideType}>{order.Driver?.vehicle_type || 'Unknown Vehicle'}</Text>
                        <Text style={styles.rideTime}>Order ID: {order.Booking?.booking_id || 'Unknown ID'}</Text>
                    </View>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Pickup Location:</Text>
                        <Text style={styles.detailsValue}>{order.Booking?.pickup_address || 'Address not available'}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Drop Location:</Text>
                        <Text style={styles.detailsValue}>{order.Booking?.dropoff_address || 'Address not available'}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Pickup Time:</Text>
                        <Text style={styles.detailsValue}>{formatDate(order.Booking?.pickup_time || '')}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Dropoff Time:</Text>
                        <Text style={styles.detailsValue}>{formatDate(order.Booking?.dropoff_time || '')}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Driver:</Text>
                        <Text style={styles.detailsValue}>{order.Driver?.driver_name || 'Driver details not available'}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Vehicle Type:</Text>
                        <Text style={styles.detailsValue}>{order.Driver?.vehicle_type || 'Vehicle type not available'}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>User:</Text>
                        <Text style={styles.detailsValue}>{order.User.username || 'User details not available'}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.detailsLabel}>Status:</Text>
                        <Text style={styles.detailsValue}>{order.status || 'Status not available'}</Text>
                    </View>
                </View>
            </View>

            {/* Payment Information */}
            <View style={styles.paymentContainer}>
                <Text style={styles.paymentHeader}>Payment Information</Text>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailsRow}>
                        <Text style={styles.summaryLabel}>Total Amount</Text>
                        <Text style={styles.summaryValue}>₹150</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.summaryLabel}>Payment Mode</Text>
                        <Text style={styles.summaryValue}>UPI</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={styles.summaryLabel}>Payment Status</Text>
                        <Text style={styles.summaryValue}>Paid</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 16,
    },
    headerButton: {
        padding: 8,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 16,
    },
    rideInfoContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 16,
    },
    rideHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    vehicleImage: {
        width: 50,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
        resizeMode: 'contain',
    },
    rideInfoText: {
        flex: 1,
    },
    rideType: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    rideTime: {
        fontSize: 14,
        color: '#888',
    },
    detailsContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 8,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailsLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    detailsValue: {
        fontSize: 14,
        color: '#555',
        flexShrink: 1,
        maxWidth: '80%',
    },
    paymentContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    paymentHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    summaryLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    summaryValue: {
        fontSize: 14,
        color: '#555',
    },
});

export default IndetailedorderScreen;
