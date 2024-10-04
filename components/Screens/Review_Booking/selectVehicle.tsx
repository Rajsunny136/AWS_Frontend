import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
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

const VehicleSelectionScreen: React.FC = () => {
  const route = useRoute<VehicleSelectionScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();

  const {
    receiver_name,
    receiver_address,
    receiver_phone,
    name,
    location,
    address,
    phone,
  } = route.params;

  const [distance, setDistance] = useState<number | null>(null);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Calculate distance when component mounts
  useEffect(() => {
    if (location && address && typeof address === "object") {
      const { latitude: lat1, longitude: lon1 } = location;
      const { latitude: lat2, longitude: lon2 } = address;

      const calculatedDistance = calculateDistance(lat1, lon1, lat2, lon2);
      setDistance(calculatedDistance);
      console.log(
        `Distance between sender and receiver: ${calculatedDistance.toFixed(
          2
        )} km`
      );
    } else {
      Alert.alert("Error", "Location or address data is missing.");
    }
  }, [location, address]);

  const handleConfirm = () => {
    if (distance !== null) {
    //   navigation.navigate("RideConfirmationScreen", { distance });
    } else {
      Alert.alert("Error", "Unable to confirm ride due to missing distance.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Sender Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.header}>Sender Details</Text>
        <Text style={styles.detailText}>Name: {name}</Text>
        <Text style={styles.senderDetailText}>
          Address: {address?.name || "Not Available"}
        </Text>
        <Text style={styles.detailText}>Phone: {phone}</Text>
      </View>

      {/* Receiver Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.header}>Receiver Details</Text>
        <Text style={styles.detailText}>Receiver: {receiver_name}</Text>
        <Text style={styles.detailText}>Address: {receiver_address}</Text>
        <Text style={styles.detailText}>Phone: {receiver_phone}</Text>
      </View>

      {/* Distance Display */}
      {distance !== null && (
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>
            Distance: {distance.toFixed(2)} km
          </Text>
        </View>
      )}

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirm Ride</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  detailsContainer: {
    marginBottom: 20,
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  detailText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  distanceContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  distanceText: {
    fontSize: 18,
    fontWeight: "600",
  },
  senderDetailText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
});

export default VehicleSelectionScreen;
