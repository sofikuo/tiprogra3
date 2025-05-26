import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Registro from '../screens/Registro';
import Login from '../screens/Login';

const Tab = createBottomTabNavigator();

function TabNavigation() {
    return(
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />   
            <Tab.Screen name="Registro" component={Registro} />
             <Tab.Screen name="Login" component={Login} />
        </Tab.Navigator>
    );
}

export default TabNavigation;