import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import TabLayout from "./(tabs)/_layout";
import Login from "@/components/Screens/Login/login";
import Verifyotp from "@/components/Screens/Login/verifytop";
import Signup from "@/components/Screens/Signup/signup";


export type RootStackParamList = {
    Tablayout: { user_id: any, phone: string};
    Login: { phone: string; user_id: any };
    Verifyotp: { phone: string; orderId: string  };
    Signup:{ phone: string }
};

const Stack = createStackNavigator<RootStackParamList>();

const Index = () => {

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="pink" />
            <NavigationContainer independent={true}>
                <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>

                    <Stack.Screen name="Login" component={Login}/>
                    <Stack.Screen name="Tablayout" component={TabLayout} options={{ headerShown: false }} />
                    <Stack.Screen name="Verifyotp" component={Verifyotp}/>
                    <Stack.Screen name="Signup" component={Signup}/>

                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
};

export default Index;