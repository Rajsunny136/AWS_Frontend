import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Animated,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { userCookie } from "@/app/api-request/config";
import config from "@/app/api-request/config";
import axios from "axios";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "../api-request/user_api";

// Define the params expected for PickupDropScreen
type PickupDropScreenParams = {
  name: string | null;
  phone: string | null;
  address: {
    name: string; 
    latitude: number;
    longitude: number;
  };
};

// Define the navigation prop type
type HomeScreenNavigationProp = NativeStackNavigationProp<
  { PickupDropScreen: PickupDropScreenParams },
  "PickupDropScreen"
>;

const Home = () => {
  const route = useRoute();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [user_id, setUserId] = useState<string>("");
  const [address, setAddress] = useState<string>("Fetching location...");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false); // For refresh control
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    name: string;
    latitude: number;
    longitude: number;
  } | null>(null); // Add currentLocation to state
  const scrollAnim = useRef(new Animated.Value(0)).current;

  interface ExtendedLocationGeocodedAddress extends Location.LocationGeocodedAddress {
    subLocality?: string;
    neighbourhood?: string;
    locality?: string;
  }

  const fetchCurrentLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setAddress("Permission to access location was denied");
        setLoading(false);
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      let places = (await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      })) as ExtendedLocationGeocodedAddress[];

      if (places && places.length > 0) {
        const place = places[0];

        const street = place.street || place.name || "";
        const area = (place as any).subLocality || "";
        const city = place.city || place.locality || "";
        const state = place.region || "";
        const formattedAddress = `${street}, ${area}, ${city}, ${state}`;

        const newLocation = {
          name: formattedAddress, // Concatenated address parts
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        setAddress(newLocation.name); // Display the formatted address
        setCurrentLocation(newLocation); // Set currentLocation state
        console.log(`Name: ${newLocation.name}, Latitude: ${newLocation.latitude}, Longitude: ${newLocation.longitude}`);
      } else {
        setAddress("Location not found");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setAddress("Failed to fetch location");
    } finally {
      setLoading(false);
    }
  };

  const initialize = async () => {
    try {
      const token = await AsyncStorage.getItem(userCookie);
      if (!token) {
        throw new Error("Token not found in AsyncStorage");
      }

      const decodedToken: any = jwtDecode(token);
      const user_id = decodedToken.id;

      if (user_id) {
        const userDetails = await getUserById(user_id); // Fetch user details
        setUserName(userDetails.username); // Set username
        setUserPhone(userDetails.phone); // Set phone
        setUserId(user_id); // Store user_id in state

        console.log(`Username: ${userDetails.username}`);
      }
    } catch (error) {
      console.error("Error initializing user:", error);
      Alert.alert("Error", "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
    fetchCurrentLocation();
  }, []);

  const handleNavigation = () => {
    // Ensure navigation only happens if address and userPhone are available
    if (currentLocation && userPhone && userName) {
      navigation.navigate("PickupDropScreen", {
        name: userName,
        address: currentLocation, // Use currentLocation from state
        phone: userPhone,
      });
    } else {
      Alert.alert("Error", "Failed to get necessary details for navigation.");
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await initialize();
    await fetchCurrentLocation();
    setRefreshing(false);
  };
  useEffect(() => {
    const startMarquee = () => {
      scrollAnim.setValue(0);
      Animated.loop(
        Animated.timing(scrollAnim, {
          toValue: -100, // Adjust this value based on your text width
          duration: 8000, // Adjust duration for speed
          useNativeDriver: true,
        })
      ).start();
    };

    if (!loading) {
      startMarquee();
    }
  }, [loading]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={24} color="green" />
        {loading ? (
          <ActivityIndicator size="small" color="green" />
        ) : (
          <View style={styles.marqueeContainer}>
            <Animated.Text
              style={[
                styles.addressText,
                {
                  transform: [{ translateX: scrollAnim }],
                },
              ]}
            >
              {address || "Location not found"}
            </Animated.Text>
          </View>
        )}

      </View>

      {/* Grid Items */}
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.gridItem} onPress={handleNavigation}>
          <Text style={styles.gridText}>Trucks</Text>
          <Image
            style={styles.iconImage}
            source={require("../../assets/images/Truck.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={handleNavigation}>
          <Text style={styles.gridText}>2 Wheeler</Text>
          <Image
            style={styles.iconImage}
            source={require("../../assets/images/Bike.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={handleNavigation}>
          <Text style={styles.gridText}>Packers & Movers</Text>
          <Image
            style={styles.iconImagepack}
            source={require("../../assets/images/Packers and movers.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={handleNavigation}>
          <Text style={styles.gridText}>3 Wheeler</Text>
          <Image
            style={styles.iconImage}
            source={require("../../assets/images/Auto.png")}
          />
        </TouchableOpacity>
      </View>

      {/* Announcements */}
      <View style={styles.announcementContainer}>
        <Text style={styles.announcementTitle}>Announcements</Text>
        <TouchableOpacity style={styles.announcementCard}>
          <Text style={styles.announcementText}>
            Introducing ShipEase Enterprise
          </Text>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>1 Year of ShipEase</Text>
      </View>
    </ScrollView>
  );
};

const { width, height } = Dimensions.get("window");

// Breakpoints
const isSmallDevice = width < 375; // Small phones
const isMediumDevice = width >= 375 && width < 768; // Standard phones
const isLargeDevice = width >= 768; // Tablets

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: width * 0.04, // Consistent padding
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: width * 0.04,
    borderRadius: 12,
    marginTop: height * 0.02,
    justifyContent: "space-between",
    overflow: "hidden",
    elevation: 3, // Shadow for Android
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  addressText: {
    fontSize: width * 0.042, // Auto-scale font
    fontWeight: "500",
    color: "#333",
  },
  marqueeContainer: {
    width: "90%",
    overflow: "hidden",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: height * 0.03,
  },
  gridItem: {
    width: isSmallDevice ? "47%" : isLargeDevice ? "30%" : "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.04,
    alignItems: "center",
    marginBottom: height * 0.02,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconImage: {
    width: width * 0.2,
    height: height * 0.1,
    marginBottom: height * 0.01,
    resizeMode: "contain",
  },
  iconImagepack: {
    width: width * 0.15,
    height: height * 0.09,
    marginBottom: height * 0.01,
    resizeMode: "contain",
  },
  gridText: {
    fontSize: width * 0.04,
    color: "#333",
    fontWeight: "bold",
  },
  announcementContainer: {
    marginTop: height * 0.03,
    padding: width * 0.04,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  announcementTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.015,
  },
  announcementCard: {
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    padding: width * 0.04,
  },
  announcementText: {
    fontSize: width * 0.038,
    color: "#333",
  },
  viewAllText: {
    color: "#1e90ff",
    marginTop: height * 0.01,
    fontSize: width * 0.04,
  },
  footer: {
    paddingVertical: height * 0.02,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f1f1",
    marginTop: height * 0.03,
  },
  footerText: {
    fontSize: width * 0.038,
    color: "#666",
  },
});

export default Home;