import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import config, { userCookie } from "@/app/api-request/config";
import { io } from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

// Define the types for the route parameters and Driver
type Location = {
  latitude: number;
  longitude: number;
  name?: string;
};

type address = {
  name: string;
  latitude: number;
  longitude: number;
};

type Driver = {
  driverId: number;
  vehicleType: string;
  latitude: number;
  longitude: number;
};

type RootStackParamList = {
  SearchingForDriverScreen: {
    bookingId: string;
    address: address;
    location: Location;
    totalPrice: number;
    vehicleName: string;
  };
};

type SearchingForDriverScreenRouteProp = RouteProp<
  RootStackParamList,
  "SearchingForDriverScreen"
>;

type SearchingForDriverScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SearchingForDriverScreen"
>;

const SearchingForDriverScreen = () => {
  const route = useRoute<SearchingForDriverScreenRouteProp>();
  const { bookingId, address, location, totalPrice, vehicleName } = route.params;
  const navigation = useNavigation<SearchingForDriverScreenNavigationProp>();

  const [countdown, setCountdown] = useState(600);
  const [nearbyDrivers, setNearbyDrivers] = useState<Driver[]>([]);
  const [driverId, setDriverId] = useState<number | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const socket = io(config.SOCKET_IO_URL); // WebSocket connection
  const [currentDriverIndex, setCurrentDriverIndex] = useState(0);


  // Fetch user ID from token stored in AsyncStorage
  const userDetails = async () => {
    try {
      const token = await AsyncStorage.getItem(userCookie);
      if (!token) throw new Error("Token not found in AsyncStorage");
      const decodedToken: any = jwtDecode(token);
      const user_id = decodedToken.id;
      console.log("User_id is ", user_id);
      setUserId(user_id); // Set userId state
    } catch (error) {
      console.error("Failed to decode token or retrieve user info:", error);
      Alert.alert("Error", "Failed to retrieve user information.");
    }
  };

  useEffect(() => {
    // Fetch user details when the component mounts
    userDetails();
  }, []);

  // Socket connection and requesting nearby drivers
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    // Emit event to fetch nearby drivers
    socket.emit("requestNearbyDrivers", {
      vehicleType: vehicleName,
      latitude: address.latitude,
      longitude: address.longitude,
    });

    // Listen for nearby drivers from the server
    socket.on("nearbyDrivers", (drivers: Driver[]) => {
      console.log("Nearby drivers received:", drivers);
      setNearbyDrivers(drivers);

      // Filter drivers based on vehicle type
      const filteredDrivers = drivers.filter(
        (driver) => driver.vehicleType === vehicleName
      );

      console.log("Filtered drivers based on vehicleType", filteredDrivers)

      // Emit REGISTER_DRIVER event for the first filtered driver
      if (filteredDrivers.length > 0) {
        const driverDetails = filteredDrivers[0]; // Get the first filtered driver

        // Emit REGISTER_DRIVER with the details of the first filtered driver
        socket.emit("REGISTER_DRIVER", {
          driverId: driverDetails.driverId,
          vehicleType: driverDetails.vehicleType,
          latitude: driverDetails.latitude,
          longitude: driverDetails.longitude,
        });

        console.log("Emitted REGISTER_DRIVER for driver:", driverDetails);
      } else {
        console.log("No drivers found with the specified vehicle type.");
      }
    });

    // Listen for ride request status
    socket.on("rideRequestStatus", (status) => {
      if (status === "accepted") {
        Alert.alert("Ride Accepted", "Driver has accepted your ride.");
        // Navigate to the ride details screen
        // navigation.navigate("RideDetailsScreen", { bookingId });
      } else if (status === "rejected") {
        // Move to the next driver in the list
        requestNextDriver();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [driverId, vehicleName, address.latitude, address.longitude]);

  // Request booking from the next available driver
  const requestNextDriver = () => {
    const filteredDrivers = nearbyDrivers.filter(
      (driver) => driver.vehicleType === vehicleName
    );

    if (filteredDrivers.length > 0 && currentDriverIndex < filteredDrivers.length) {
      const driverToRequest = filteredDrivers[currentDriverIndex];
      setSelectedDriver(driverToRequest);
      setCurrentDriverIndex(currentDriverIndex + 1); // Move to the next driver

      // Emit ride request to this driver
      console.log("Requesting booking with driver:", driverToRequest.driverId);
       // Emit ride request using WebSocket
       console.log('Emitting booking request:', {
        bookingId,
        userId, // This should be the user ID fetched from AsyncStorage
        driverId: driverToRequest.driverId,
        pickupAddress: {
          latitude: address.latitude,
          longitude: address.longitude,
        },
        dropoffAddress: location,
        totalPrice,
        vehicleName,
      });
      socket.emit("REQUEST_BOOKING", {
        bookingId,
        userId,
        driverId: driverToRequest.driverId,
        pickupAddress: {
          latitude: address.latitude,
          longitude: address.longitude,
        },
        dropoffAddress: location,
        totalPrice,
        vehicleName,
      });
    } else {
      // If no more drivers are available, show an alert
      Alert.alert("No Drivers Available", "All drivers have rejected the ride.");
    }
  };

  // Automatically request booking with the first available driver
  useEffect(() => {
    if (nearbyDrivers.length > 0) {
      requestNextDriver();
    }
  }, [nearbyDrivers]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(interval);
      Alert.alert("Time's up", "Booking has been cancelled automatically.");
    }

    return () => clearInterval(interval);
  }, [countdown]);
  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNavContainer}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.tripIdText}>Trip CRN {bookingId}</Text>
          <View style={styles.navIcons}>
            <Icon name="information-circle-outline" size={24} color="#000" />
            <Icon
              name="share-social-outline"
              size={24}
              color="#000"
              style={styles.shareIcon}
            />
          </View>
        </View>
      </View>

      {/* Route and Address Info */}
      <View style={styles.routeInfoCard}>
        <View style={styles.routeInfo}>
          <Text>
            {address.name} → {location.name}
          </Text>
          <TouchableOpacity>
            <Text style={styles.addText}>+ ADD</Text>
          </TouchableOpacity>
        </View>
      </View>

       {/* Main Container for Map and Searching for Driver Info */}
       <View style={styles.mainContainer}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              latitude: address.latitude,
              longitude: address.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {/* Current Location Marker */}
            <Marker
              coordinate={{
                latitude: address.latitude,
                longitude: address.longitude,
              }}
            >
              <View>
                <Image
                  source={require('../../../assets/images/shashikumar.png')} // Your custom person icon
                  style={{ width: 80, height: 80 }} // Resizing the icon to 30x30 pixels
                />
              </View>
          
            </Marker>

              {/* Filtered Driver Location Markers */}
  {nearbyDrivers.map((driver) => {
    // Set the image source based on the vehicle type
    let vehicleIcon;
    switch (driver.vehicleType) {
      case "Bike":
        vehicleIcon = require('../../../assets/images/bike1.png');
        break;
      case "Truck":
        vehicleIcon = require('../../../assets/images/truck1.png');
        break;
      case "3-wheeler":
        vehicleIcon = require('../../../assets/images/3-wheeler.png');
        break;
      case "4-wheeler":
        vehicleIcon = require('../../../assets/images/4-wheeler.png');
        break;
      default:
        vehicleIcon = require('../../../assets/images/shashi-bsk.png'); // Fallback icon for unknown types
    }

    return (
      <Marker
        key={driver.driverId}
        coordinate={{
          latitude: driver.latitude,
          longitude: driver.longitude,
        }}
      >
        <View>
          <Image
            source={vehicleIcon} // Display the selected icon
            style={{ width: 70, height: 50 }} // Adjust size as needed
          />
        </View>
      </Marker>
             );
            })}
          </MapView>
        </View>

        {/* Searching for Driver Info */}
        <View style={styles.searchingContainer}>
          <View style={styles.bookingStatus}>
            <Icon name="checkmark-circle" size={48} color="green" />
            <Text style={styles.searchingText}>Searching for a driver...</Text>
            <Text style={styles.cancelText}>
              Booking will get cancelled if not allocated in{" "}
              {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? "0" : ""}
              {countdown % 60}
            </Text>
            <Text style={styles.savingText}>
              Yay! You are saving ₹15 on this order 🤑
            </Text>
          </View>

          {/* Payment Info */}
          <View style={styles.paymentInfo}>
            <Text>Cash</Text>
            <Text style={styles.priceText}>₹{totalPrice}</Text>
            <TouchableOpacity>
              <Text style={styles.viewBreakupText}>View Breakup</Text>
            </TouchableOpacity>
          </View>

          {/* Contact Support and Cancel Trip */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.supportButton}>
              <Text style={styles.supportText}>Contact Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  topNavContainer: {
    width: "100%",
    backgroundColor: "#A487E7",
    paddingTop: 40, // Adjust for status bar height
    paddingBottom: 16,
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  tripIdText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  navIcons: {
    flexDirection: "row",
  },
  shareIcon: {
    marginLeft: 12,
  },
  routeInfoCard: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
  },
  routeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addText: {
    color: "#1a73e8",
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
  },
  mapContainer: {
    flex: 1, // This takes 50% height of the screen
    margin: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchingContainer: {
    flex: 1, // This takes 50% height of the screen
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    elevation: 3,
  },
  bookingStatus: {
    alignItems: "center",
    marginBottom: 16,
  },
  searchingText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "bold",
  },
  cancelText: {
    marginTop: 8,
    color: "#777",
  },
  savingText: {
    marginTop: 8,
    color: "#2ecc71",
  },
  paymentInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  priceText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  viewBreakupText: {
    color: "#1a73e8",
  },
  actions: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  supportButton: {
    backgroundColor: "#A487E7",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  supportText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "rgb(122, 115, 150)",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SearchingForDriverScreen;