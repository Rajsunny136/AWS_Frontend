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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { jwtDecode } from "jwt-decode";

// Define the params expected for PickupDropScreen
type PickupDropScreenParams = {
  name: string | null;
  address: string;
  phone: string | null;
};

// Define the navigation prop type
type HomeScreenNavigationProp = NativeStackNavigationProp<
  { PickupDropScreen: PickupDropScreenParams },
  'PickupDropScreen'
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
  const scrollAnim = useRef(new Animated.Value(0)).current;

  const fetchCurrentLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setAddress("Permission to access location was denied");
        setLoading(false);
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const googleGeocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${config.GOOGLE_API_KEY}`;

      const response = await axios.get(googleGeocodingUrl);
      const results = response.data.results;

      if (results && results.length > 0) {
        const detailedAddress = results[0].formatted_address;
        setAddress(detailedAddress);
      } else {
        setAddress("Location not found");
      }
    } catch (error) {
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
      const user_phone = decodedToken.phone;
      const user_name = decodedToken.name;

      setUserPhone(user_phone);
      setUserName(user_name);
      if (user_id) {
        setUserId(user_id);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
    fetchCurrentLocation();
  }, []);

  const handleNavigation = () => {
    // Ensure navigation only happens if address and userPhone are available
    if (address && userPhone && userName) {
      navigation.navigate("PickupDropScreen", { name: userName,address: address, phone: userPhone,});
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
        <Ionicons name="chevron-down" size={24} color="black" />
      </View>

      {/* Grid Items */}
      <View style={styles.gridContainer}>
        <TouchableOpacity
          style={styles.gridItem}
          onPress={handleNavigation}
        >
          <Text style={styles.gridText}>Trucks</Text>
          <Image
            style={styles.iconImage}
            source={require("../../assets/images/Truck.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={handleNavigation}
        >
          <Text style={styles.gridText}>2 Wheeler</Text>
          <Image
            style={styles.iconImage}
            source={require("../../assets/images/Bike.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={handleNavigation}
        >
          <Text style={styles.gridText}>Packers & Movers</Text>
          <Image
            style={styles.iconImagepack}
            source={require("../../assets/images/Packers and movers.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={handleNavigation}
        >
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
          <Text style={styles.announcementText}>Introducing ShipEase Enterprise</Text>
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
    fontWeight: "400",
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
