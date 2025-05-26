import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Registro from '../screens/Registro';
import Login from '../screens/Login';
import Home from '../screens/Home';
import Perfil from '../screens/MiPerfil';

import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

