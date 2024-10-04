import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/app";

type VehicleSelectionScreenRouteProp = RouteProp<
    RootStackParamList,
    "VehicleSelectionScreen"
>;
type NavigationProp = StackNavigationProp<
    RootStackParamList,
    "VehicleSelectionScreen"
>;

type Vehicle = {
    id: number;
    type: string;
    baseFare: number;
    perKmRate: number;
};

const vehicles: Vehicle[] = [
    { id: 1, type: "Bike", baseFare: 50, perKmRate: 10 },
    { id: 2, type: "Car", baseFare: 100, perKmRate: 15 },
    { id: 3, type: "Van", baseFare: 150, perKmRate: 20 },
];

const VehicleSelectionScreen = () => {
    const route = useRoute<VehicleSelectionScreenRouteProp>();
    const navigation = useNavigation<NavigationProp>();

    // Extract all params from the route
    const { receiver_name, receiver_address, receiver_phone, distance } =
        route.params;

    console.log(
        "Receiver Details:",
        receiver_name,
        receiver_address,
        receiver_phone,
        "Distance:",
        distance
    );

    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [price, setPrice] = useState<number | null>(null);

    useEffect(() => {
        if (selectedVehicle && distance) {
            calculatePrice(selectedVehicle, distance);
        }
    }, [selectedVehicle, distance]);

    const calculatePrice = (vehicle: Vehicle, distance: number) => {
        const totalPrice = vehicle.baseFare + vehicle.perKmRate * distance;
        setPrice(totalPrice);
    };

    const handleVehicleSelect = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
    };

    const handleConfirm = () => {
        if (selectedVehicle && price !== null) {
            navigation.navigate("RideConfirmationScreen" as never);
        }
    };

    const renderVehicleItem = ({ item }: { item: Vehicle }) => {
        return (
            <TouchableOpacity
                style={[
                    styles.vehicleItem,
                    selectedVehicle?.id === item.id ? styles.selectedVehicle : {},
                ]}
                onPress={() => handleVehicleSelect(item)}
            >
                <Text style={styles.vehicleType}>{item.type}</Text>
                <Text style={styles.vehicleFare}>Base Fare: ₹{item.baseFare}</Text>
                <Text style={styles.vehicleRate}>Rate per km: ₹{item.perKmRate}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Display receiver details */}
            <View style={styles.receiverDetailsContainer}>
                <Text style={styles.receiverDetailText}>Receiver: {receiver_name}</Text>
                <Text style={styles.receiverDetailText}>
                    Address: {receiver_address}
                </Text>
                <Text style={styles.receiverDetailText}>Phone: {receiver_phone}</Text>
            </View>

            {/* Vehicle selection */}
            <Text style={styles.header}>Select Your Vehicle</Text>
            <FlatList
                data={vehicles}
                renderItem={renderVehicleItem}
                keyExtractor={(item) => item.id.toString()}
            />

            {/* Display price if vehicle is selected */}
            {selectedVehicle && price !== null && (
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>
                        Selected Vehicle: {selectedVehicle.type}
                    </Text>
                    <Text style={styles.priceText}>Total Price: ₹{price.toFixed(2)}</Text>

                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={handleConfirm}
                    >
                        <Text style={styles.confirmButtonText}>Confirm and Proceed</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    receiverDetailsContainer: {
        marginBottom: 20,
        padding: 15,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
    },
    receiverDetailText: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 5,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    vehicleItem: {
        padding: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 10,
    },
    selectedVehicle: {
        borderColor: "#007bff",
        backgroundColor: "#e6f0ff",
    },
    vehicleType: {
        fontSize: 18,
        fontWeight: "600",
    },
    vehicleFare: {
        fontSize: 14,
        color: "#555",
    },
    vehicleRate: {
        fontSize: 14,
        color: "#555",
    },
    priceContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#f5f5f5",
        borderRadius: 5,
    },
    priceText: {
        fontSize: 16,
        marginBottom: 10,
    },
    confirmButton: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default VehicleSelectionScreen;
