import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import TabLayout from "./(tabs)/_layout";
import Login from "@/components/Screens/Login/login";
import Verifyotp from "@/components/Screens/Login/verifytop";
import Signup from "@/components/Screens/Signup/signup";
import PickupDropScreen from "@/components/Screens/Select_location/PickupDropScreen";
import SelectPickupLocation from "@/components/Screens/Select_location/SelectPickupLocation";
import SenderDetailsScreen from "@/components/Screens/Select_location/SenderDetailsScreen";
import SelectPickupOnMapScreen from "@/components/Screens/Select_location/SelectPickupOnMapScreen";
import ReceiverDetailsScreen from "@/components/Screens/Select_location/ReceiverDetailsScreen";
import SelectDropOnMapScreen from "@/components/Screens/Select_location/SelectDropOnMapScreen";

export type RootStackParamList = {
    Tablayout: { user_id: any, phone: string};
    Login: { phone: string; user_id: any };
    Verifyotp: { phone: string; orderId: string  };
    Signup:{ phone: string };
    PickupDropScreen: {name: string; address:string; phone:string;};
    SelectPickupLocation:undefined;
    SenderDetailsScreen:{location:any;};
    SelectPickupOnMapScreen:undefined;
    ReceiverDetailsScreen: { location:any,name: string; address:string; phone:string;};
    SelectDropOnMapScreen: { location:any,name: string; address:string; phone:string;};
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
                    <Stack.Screen name="Login" component={Login}/>
                    <Stack.Screen name="Tablayout" component={TabLayout} options={{ headerShown: false }} />
                    <Stack.Screen name="Verifyotp" component={Verifyotp}/>
                    <Stack.Screen name="Signup" component={Signup}/>
                    <Stack.Screen name="PickupDropScreen" component={PickupDropScreen} />

                    <Stack.Screen name="SelectPickupLocation" component={SelectPickupLocation}  options={{ headerShown: true,title:"Select Pickup Location" }} />
                    <Stack.Screen name="SenderDetailsScreen" component={SenderDetailsScreen}  options={{ headerShown: true,title:"Sender Details" }} />
                    <Stack.Screen name="SelectPickupOnMapScreen" component={SelectPickupOnMapScreen}  options={{ headerShown: true,title:"Select Location" }} />
                    <Stack.Screen name="ReceiverDetailsScreen" component={ReceiverDetailsScreen}  options={{ headerShown: true,title:"Receiver Details" }} />
                    <Stack.Screen name="SelectDropOnMapScreen" component={SelectDropOnMapScreen}  options={{ headerShown: true,title:"Select Location" }} />

                    

                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
};

export default Index;