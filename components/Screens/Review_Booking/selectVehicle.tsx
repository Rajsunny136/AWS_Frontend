import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/app";
import { Ionicons } from "@expo/vector-icons";

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
      // navigation.navigate("RideConfirmationScreen", { distance });
    } else {
      Alert.alert("Error", "Unable to confirm ride due to missing distance.");
    }
  };

  return (
    <View style={styles.cardWrapper}>
      {/* Sender Details */}
      <View style={styles.cardContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="ellipse" size={12} color="green" />
          <View style={styles.dottedLine} />
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.nameText}>
            {name} · {phone}
          </Text>
          <Text style={styles.addressText}>
            {address?.name || "Not Available"}
          </Text>
        </View>
      </View>

      {/* Receiver Details */}
      <View style={styles.cardContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.dottedLine} />
          <Ionicons name="location-sharp" size={12} color="red" />
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.nameText}>
            {receiver_name} · {receiver_phone}
          </Text>
          <Text style={styles.addressText}>{receiver_address}</Text>
        </View>
        <Ionicons
          name="swap-vertical"
          size={18}
          color="gray"
          style={styles.swapIcon}
        />
      </View>

      {/* Add/Edit Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={16} color="blue" />
          <Text style={styles.actionText}>EDIT LOCATIONS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  detailText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333", // Darker color for better readability
  },
  confirmButton: {
    backgroundColor: "#007bff", // Primary color for the button
    padding: 15,
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
  cardWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    margin:10
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    alignItems: "center",
    marginRight: 10,
  },
  dottedLine: {
    height: 30, 
    borderLeftWidth: 1,
    borderLeftColor: "gray",
    borderStyle: "dotted",
    marginVertical: 5,
  },
  dottedLineHidden: {
    height: 20,
    marginVertical: 5,
  },
  detailContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  addressText: {
    fontSize: 14,
    color: "gray",
  },
  swapIcon: {
    marginLeft: 10,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: "blue",
    fontWeight: "bold",
  },
});

export default VehicleSelectionScreen;
