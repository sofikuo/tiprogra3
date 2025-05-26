import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Registro from '../screens/Registro';
import Login from '../screens/Login';
import TabNavigation from './TabNavigation'; 

const Stack = createNativeStackNavigator();

function StackNavigation() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Registro' component={Registro} />
            <Stack.Screen name='MainTabs' component={TabNavigation} />
        </Stack.Navigator>
    );
}

export default StackNavigation;
