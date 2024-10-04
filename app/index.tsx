import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import TabLayout from "./(tabs)/_layout";
import Login from "@/components/Screens/Login/login";
import Verifyotp from "@/components/Screens/Login/verifytop";
import Signup from "@/components/Screens/Signup/signup";
import HelpAndSupport from "@/components/Screens/Profile/Help&Support";
import ReferYourFriends from "@/components/Screens/Profile/Refer_Friends";
import SavedAddressesScreen from "@/components/Screens/Profile/SavedAddress";
import NewAddress from "@/components/Screens/Profile/Add_Address";
import Chooseonmap from "@/components/Screens/Profile/Choose_on_Map";
import ChatScreen from "@/components/Screens/Profile/Live_chat";

import SelectPickupLocation from "@/components/Screens/Select_location/SelectPickupLocation";
import SenderDetailsScreen from "@/components/Screens/Select_location/SenderDetailsScreen";
import SelectPickupOnMapScreen from "@/components/Screens/Select_location/SelectPickupOnMapScreen";
import ReceiverDetailsScreen from "@/components/Screens/Select_location/ReceiverDetailsScreen";
import SelectDropOnMapScreen from "@/components/Screens/Select_location/SelectDropOnMapScreen";
import PickupDropScreen from "@/components/Screens/Select_location/PickupDropScreen";

import DeliveryIssuesScreen from "@/components/Screens/Profile/Delivery_Issues";
import BookingSummaryScreen from "@/components/Screens/Review_Booking/ReviewandBooking";
import VehicleSelectionScreen from "@/components/Screens/Review_Booking/selectVehicle";

 import ReturnProcessScreen from "@/components/Screens/Profile/Faqquries/cancelorderlist";
import DeliveryChargesScreen from "@/components/Screens/Profile/Faqquries/deliverychargeslist"
import CancelOrderScreen from "@/components/Screens/Profile/Faqquries/cancelorderlist"
        
export type RootStackParamList = {
  Tablayout: { user_id: any; phone: string };
  Login: { phone: string; user_id: any };
  Verifyotp: { phone: string; orderId: string };
  Signup: { phone: string };
  HelpAndSupport: undefined;
  ReferYourFriends: undefined;
  SavedAddressesScreen: { address_id: any };
  NewAddress: { address_id?: number };
  Chooseonmap: { address_id?: number };
  ChatScreen: undefined;
  DeliveryScreen: undefined;
  RecieverDetails: { location: any };
  PickupDropScreen: { name: string; address: any; phone: string };
  SelectPickupLocation: undefined;
  SenderDetailsScreen: { location: any };
  SelectPickupOnMapScreen: undefined;

  ReceiverDetailsScreen: {
    location: any;
    name: string;
    address: string;
    phone: string;
  };
  SelectDropOnMapScreen: {
    location: any;
    name: string;
    address: string;
    phone: string;
  };
  DeliveryIssuesScreen: undefined;
  BookingSummaryScreen: undefined;
  VehicleSelectionScreen: {
    location: any;
    receiver_name: string;
    receiver_address: string;
    receiver_phone: string;
    distance: number; // Ensure this is defined
    name: any;
    phone: string;
    address: any;
  };

  ReturnProcessScreen: undefined;
  DeliveryChargesScreen:undefined;
  CancelOrderScreen:undefined;
};


const Stack = createStackNavigator<RootStackParamList>();

const Index = () => {

  return (
    <>
      <StatusBar
        backgroundColor="#A487E7" // Same color as the header
        barStyle="light-content" // White text/icons for dark background
      />
      <NavigationContainer independent={true}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: "#A487E7" },
            headerTintColor: "white",
          }}
        >
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Tablayout"
            component={TabLayout}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Verifyotp"
            component={Verifyotp}
            options={{ headerShown: true }}
          />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen
            name="HelpAndSupport"
            component={HelpAndSupport}
            options={{ title: "Help And Support" }}
          />
          <Stack.Screen
            name="ReferYourFriends"
            component={ReferYourFriends}
            options={{ title: "Referral" }}
          />
          <Stack.Screen
            name="SavedAddressesScreen"
            component={SavedAddressesScreen}
            options={{ title: "Saved Address" }}
          />
          <Stack.Screen
            name="NewAddress"
            component={NewAddress}
            options={{ title: "Address" }}
          />
          <Stack.Screen
            name="Chooseonmap"
            component={Chooseonmap}
            options={{ title: "Map" }}
          />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="PickupDropScreen" component={PickupDropScreen} />
          <Stack.Screen
            name="SelectPickupLocation"
            component={SelectPickupLocation}
            options={{ headerShown: true, title: "Select Pickup Location" }}
          />
          <Stack.Screen
            name="SenderDetailsScreen"
            component={SenderDetailsScreen}
            options={{ headerShown: true, title: "Sender Details" }}
          />
          <Stack.Screen
            name="SelectPickupOnMapScreen"
            component={SelectPickupOnMapScreen}
            options={{ headerShown: true, title: "Select Location" }}
          />
          <Stack.Screen
            name="ReceiverDetailsScreen"
            component={ReceiverDetailsScreen}
            options={{ headerShown: true, title: "Receiver Details" }}
          />
          <Stack.Screen
            name="SelectDropOnMapScreen"
            component={SelectDropOnMapScreen}
            options={{ headerShown: true, title: "Select Location" }}
          />
          <Stack.Screen
            name="DeliveryIssuesScreen"
            component={DeliveryIssuesScreen}
            options={{ headerShown: true, title: "Delivery" }}
          />
          <Stack.Screen
            name="BookingSummaryScreen"
            component={BookingSummaryScreen}
            options={{ headerShown: true, title: "Review and Booking" }}
          />
          <Stack.Screen
            name="VehicleSelectionScreen"
            component={VehicleSelectionScreen}
            options={{ headerShown: true, title: "Select Vehicle" }}
          />
          <Stack.Screen
            name="ReturnProcessScreen"
            component={ReturnProcessScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="DeliveryChargesScreen"
            component={DeliveryChargesScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="CancelOrderScreen"
            component={CancelOrderScreen}
            options={{ headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default Index;