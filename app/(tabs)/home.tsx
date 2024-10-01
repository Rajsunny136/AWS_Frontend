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
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { jwtDecode } from "jwt-decode";
import { RootStackParamList } from "..";
import { userCookie } from "@/app/api-request/config";



const Home = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [user_id, setUserId] = useState<string>("");
  const [address, setAddress] = useState<string>("Fetching location...");
  const [loading, setLoading] = useState<boolean>(true);
  const scrollAnim = useRef(new Animated.Value(0)).current;

  // Fetch user's current location using Expo Location
  interface ExtendedLocationGeocodedAddress
    extends Location.LocationGeocodedAddress {
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
      })) as ExtendedLocationGeocodedAddress[]; // Use the extended type

      if (places && places.length > 0) {
        const place = places[0];

        // Log the place object to inspect its properties
        console.log(place);

        const street = place.street || place.name || "";
        const area = (place as any).subLocality || ""; // Using type assertion to access subLocality
        const city = place.city || place.locality || "";
        const state = place.region || "";

        console.log(
          `Street: ${street}, Area: ${area}, City: ${city}, State: ${state}`
        );

        setAddress(` ${street}, ${area},${city}, ${state}`);
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

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = await AsyncStorage.getItem(userCookie);
        if (!token) {
          throw new Error("Token not found in AsyncStorage");
        }
        const decodedToken: any = jwtDecode(token);
        const user_id = decodedToken.id;
        console.log(`UserID : ${user_id}`);
        if (user_id) {
          setUserId(user_id);
        }
      } catch (error) {
        console.error("Failed to decode token or retrieve user_id:", error);
        Alert.alert("Error", "Failed to retrieve user information.");
        setLoading(false);
      }
    };

    initialize();
    fetchCurrentLocation();
  }, []);

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

  const handleServiceClick = () => {
    // Navigate to UserLandingPage with service type, phone, and user_id
    navigation.navigate("UserLandingPage" as never);
  };

  return (
    <ScrollView style={styles.container}>
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
        <Ionicons name="chevron-down" size={24} color="black" />
      </View>

      <View style={styles.gridContainer}>
        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => navigation.navigate("DeliveryScreen" as never)} // Navigate to DeliveryScreen
        >
          <Text style={styles.gridText}>Trucks</Text>
          <Image
            style={styles.iconImage}
            source={require("../../assets/images/Truck.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem}>
          <Text style={styles.gridText}>2 Wheeler</Text>
          <Image
            style={styles.iconImage}
            source={require("../../assets/images/Bike.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem}>
          <Text style={styles.gridText}>Packers & Movers</Text>
          <Image
            style={styles.iconImagepack}
            source={require("../../assets/images/Packers and movers.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem}>
          <Text style={styles.gridText}>3 wheeler</Text>
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
const isSmallDevice = width < 375; // Example breakpoint for small devices

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: isSmallDevice ? width * 0.03 : width * 0.04, // Responsive padding
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: isSmallDevice ? width * 0.03 : width * 0.04, // Responsive padding
    borderRadius: 10,
    marginTop: height * 0.02, // Responsive margin
    justifyContent: "space-between",
    overflow: "hidden",
  },
  addressText: {
    fontSize: isSmallDevice ? width * 0.035 : width * 0.04, // Responsive font size
    fontWeight: "bold",
    color: "#333",
  },
  marqueeContainer: {
    width: "70%",
    overflow: "hidden",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: height * 0.03, // Responsive margin
  },
  gridItem: {
    width: isSmallDevice ? "100%" : "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: isSmallDevice ? height * 0.02 : height * 0.025, // Responsive padding
    paddingHorizontal: width * 0.04, // Responsive padding
    alignItems: "center",
    marginBottom: height * 0.02, // Responsive margin
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconImage: {
    width: isSmallDevice ? width * 0.15 : width * 0.23, // Responsive width
    height: isSmallDevice ? height * 0.08 : height * 0.1, // Responsive height
    marginBottom: height * 0.01, // Responsive margin
  },
  iconImagepack: {
    width: isSmallDevice ? width * 0.1 : width * 0.23, // Responsive width
    height: isSmallDevice ? height * 0.07 : height * 0.1, // Responsive height
    marginBottom: height * 0.01, // Responsive margin
  },
  gridText: {
    fontSize: isSmallDevice ? width * 0.03 : width * 0.035, // Responsive font size
    color: "#333",
    fontWeight: "bold",
  },
  announcementContainer: {
    marginTop: height * 0.03, // Responsive margin
    padding: width * 0.04, // Responsive padding
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  announcementTitle: {
    fontSize: isSmallDevice ? width * 0.04 : width * 0.045, // Responsive font size
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.02, // Responsive margin
  },
  announcementCard: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: isSmallDevice ? width * 0.03 : width * 0.04, // Responsive padding
  },
  announcementText: {
    fontSize: isSmallDevice ? width * 0.035 : width * 0.04, // Responsive font size
    color: "#333",
  },
  viewAllText: {
    color: "#1e90ff",
    marginTop: height * 0.01, // Responsive margin
  },
  footer: {
    paddingVertical: height * 0.02, // Responsive padding
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f1f1",
    marginTop: height * 0.03, // Responsive margin
  },
  footerText: {
    fontSize: isSmallDevice ? width * 0.035 : width * 0.04, // Responsive font size
    color: "#666",
  },
});

export default Home;
