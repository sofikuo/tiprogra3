import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Perfil from '../screens/MiPerfil';
import CrearPosteo from '../screens/CrearPosteo';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function TabNavigation() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Perfil') {
                        iconName = 'person';
                    } else if (route.name === 'Crear Posteo'){
                        iconName = 'create';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Perfil" component={Perfil} />
            <Tab.Screen name="Crear Posteo" component={CrearPosteo} />
        </Tab.Navigator>
    );
}

export default TabNavigation;
