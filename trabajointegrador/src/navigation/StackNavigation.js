import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Registro from '../screens/Registro';
import Login from '../screens/Login';
import Home from '../screens/Home';

const Stack = createNativeStackNavigator();

function StackNavigation() {
    return(
        <Stack.Navigation>
            <Stack.Screen name='Login' component={Login} options={{headerShown: false}}> </Stack.Screen>
            <Stack.Screen name='Registro' component={Registro} options={{headerShown: false}}> </Stack.Screen>
            
        </Stack.Navigation>
    )
};

export default StackNavigation;