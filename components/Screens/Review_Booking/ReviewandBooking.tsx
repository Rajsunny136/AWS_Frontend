import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image
} from "react-native";
import { Card, Divider, Modal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons"; // Using Ionicons for icons

const BookingSummaryScreen = () => {
  const [goodsType, setGoodsType] = useState("General • Loose");
  const [isModalVisible, setModalVisible] = useState(false);

  // Function to handle booking
  const handleBooking = () => {
    Alert.alert("Booking Confirmed!", "Your booking has been made.");
  };

  // Function to handle changing goods type
  const handleChangeGoodsType = (type: string) => {
    setGoodsType(type);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Vehicle Information */}
        <Card style={styles.card}>
          <View style={styles.vehicleInfo}>
            <Image
              style={styles.iconImage}
              source={require("../../../assets/images/Bike.png")}
            />
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleTitle}>2 Wheeler</Text>
              <Text style={styles.linkText}>View Address Details</Text>
            </View>
            <Text style={styles.vehicleTime}>1 min away</Text>
          </View>
          <Text style={styles.loadingTime}>
            Free 25 mins of loading-unloading time included.
          </Text>
        </Card>

        {/* Offers and Discounts */}
        <Card style={styles.card}>
          <View style={styles.offers}>
            <Ionicons name="pricetag" size={24} color="#4CAF50" />
            <View style={styles.offerDetails}>
              <Text style={styles.offerText}>
                You saved <Text style={styles.savings}>₹15</Text> with 15OFF
              </Text>
              <Text style={styles.couponText}>Coupon Applied</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert("Offer removed!")}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Fare Summary */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Fare Summary</Text>
          <View style={styles.fareItem}>
            <Text>Trip Fare (incl. Toll)</Text>
            <Text>₹74.68</Text>
          </View>
          <View style={styles.fareItem}>
            <Text>Coupon Discount - 15OFF</Text>
            <Text style={styles.discount}>-₹15</Text>
          </View>
          <Divider />
          <View style={styles.fareItem}>
            <Text>Net Fare</Text>
            <Text>₹60</Text>
          </View>
          <View style={styles.fareItem}>
            <Text>Amount Payable (rounded)</Text>
            <Text>₹60</Text>
          </View>
        </Card>

        {/* Goods Type */}
        <Card style={styles.card}>
          <View style={styles.goodsType}>
            <Text style={styles.goodsLabel}>Goods Type</Text>
            <Text>{goodsType}</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.linkText}>Change</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Payment Method */}
        <View style={styles.paymentContainer}>
          <View style={styles.paymentMethod}>
            <Ionicons name="cash" size={24} color="#000" />
            <Text style={styles.paymentText}>Cash</Text>
          </View>
          <View style={styles.paymentAmount}>
            <Text>₹60</Text>
            <Text style={styles.viewBreakup}>View Breakup</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Book Button at the bottom */}
      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
        <Text style={styles.bookButtonText}>Book 2 Wheeler</Text>
      </TouchableOpacity>

      {/* Modal for Changing Goods Type */}
      <Modal
        visible={isModalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={styles.modal}
      >
        <Text style={styles.modalTitle}>Select Goods Type</Text>
        {["General • Loose", "Fragile", "Heavy", "Perishable"].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => handleChangeGoodsType(type)}
          >
            <Text style={styles.modalOption}>{type}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={styles.modalCloseButton}
        >
          <Text style={styles.linkText}>Close</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scrollContainer: {
    padding: width * 0.04, // 4% of the screen width
    paddingBottom: height * 0.1, // Extra padding at the bottom for button
  },
  card: {
    marginBottom: height * 0.02, // 2% of the screen height
    padding: width * 0.04, // 4% of the screen width
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleDetails: {
    marginLeft: width * 0.04, // 4% of the screen width
    flex: 1,
  },
  vehicleTitle: {
    fontWeight: "bold",
    fontSize: width * 0.05, // Responsive font size
  },
  vehicleTime: {
    color: "#1E88E5",
    fontWeight: "bold",
  },
  linkText: {
    color: "#1E88E5",
  },
  loadingTime: {
    color: "#888",
    marginTop: height * 0.01, // 1% of the screen height
  },
  offers: {
    flexDirection: "row",
    alignItems: "center",
  },
  offerDetails: {
    marginLeft: width * 0.04, // 4% of the screen width
    flex: 1,
  },
  offerText: {
    fontWeight: "bold",
    fontSize: width * 0.045, // Slightly smaller font size for offers
  },
  savings: {
    color: "#4CAF50",
  },
  couponText: {
    color: "#888",
  },
  removeText: {
    color: "#F44336",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: height * 0.01, // 1% of the screen height
    fontSize: width * 0.045, // Responsive font size
  },
  fareItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.01, // 1% of the screen height
  },
  discount: {
    color: "#4CAF50",
  },
  goodsType: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goodsLabel: {
    fontWeight: "bold",
  },
  paymentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.02, // 2% of the screen height
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentText: {
    marginLeft: width * 0.02, // 2% of the screen width
    fontSize: width * 0.045, // Responsive font size
    fontWeight: "bold",
  },
  paymentAmount: {
    alignItems: "flex-end",
  },
  viewBreakup: {
    color: "#1E88E5",
  },
  bookButton: {
    position: "absolute",
    bottom: height * 0.02, // 2% from the bottom of the screen
    left: 0,
    right: 0,
    paddingVertical: height * 0.015, // 1.5% of the screen height
    backgroundColor: "#A487E7",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: width * 0.04, // 4% of the screen width on both sides
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modal: {
    backgroundColor: "white",
    padding: width * 0.04, // 4% of the screen width
    borderRadius: 10,
    margin: width * 0.04, // 4% of the screen width
    elevation: 4,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: width * 0.05, // Responsive font size
    marginBottom: height * 0.02, // 2% of the screen height
  },
  modalOption: {
    paddingVertical: height * 0.01, // 1% of the screen height
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  modalCloseButton: {
    marginTop: height * 0.02, // 2% of the screen height
    alignItems: "center",
  },
  iconImage: {
    width: width * 0.1, // 10% of the screen width
    height: width * 0.1, // 10% of the screen width
    resizeMode: "cover",
    tintColor: "#A487E7",
    marginHorizontal: width * 0.02,
  },
});

export default BookingSummaryScreen;
