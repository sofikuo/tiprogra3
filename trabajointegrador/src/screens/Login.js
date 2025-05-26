import React, {Component} from 'react';
import { Text, View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { auth,db } from '../firebase/config';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    render() {
        return(
            <Text>Hola</Text>
        )
    }
    
}