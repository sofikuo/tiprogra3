import {
    Text,
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import React, { Component } from 'react'
import { db, auth } from '../firebase/config'

export default class Registro extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            error: false
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.props.navigation.navigate('Tab')
            }
        }
        )
    }

    registrarUsuario(email, password, username) {  // si aca hay definidas dos variables, donce las tengo que llamar? abajo
        if (
            (email !== '' &&
                password !== '' &&
                username !== ''
            )
            &&
            password.length >= 6
            &&
            email.includes('@')
            &&
            username.length > 3
        ) {
            auth.createUserWithEmailAndPassword(email, password)
                .then(() => {
                    db.collection('users').add({ // que tipo de dato tiene dentro el app? objeto literal
                        owner: email, // auth.currentuser se usa cuando estoy dentro de la aplicacion y no tengo acceso directo al mail
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                        username: username
                    })
                        .then(() => {
                            this.props.navigation.navigate('Tab')
                        })

                    this.props.navigation.navigate('Tab')
                })
                .catch(error => console.log('error', error))
        }
    }

    render() {
        return (
            <View>
                <Text>Register</Text>
                <TextInput
                    style={
                        styles.input
                    }
                    keyboardType='default'
                    value={this.state.email}
                    onChangeText={(texto) => this.setState({ email: texto, error: false })}
                    placeholder='Ingresa tu email'
                />
                <TextInput
                    style={
                        styles.input
                    }
                    keyboardType='default'
                    value={this.state.password}
                    onChangeText={(texto) => this.setState({ password: texto, error: false })}
                    placeholder='Ingresa tu password'
                    secureTextEntry={true}
                />
                <TextInput
                    style={
                        styles.input
                    }
                    keyboardType='default'
                    value={this.state.username}
                    onChangeText={(texto) => this.setState({ username: texto, error: false })}
                    placeholder='Ingresa tu usuario'
                />
                <TouchableOpacity
                    onPress={() => {
                        this.registrarUsuario(this.state.email, this.state.password, this.state.username);
                        this.props.navigation.navigate('Login');
                    }}
                >
                    <Text>Registrarme</Text>
                </TouchableOpacity>
                {
                    this.state.error ? <Text>Credenciales invalidas</Text> : null
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333'
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 16
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#4285f4',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    errorText: {
        color: 'red',
        marginTop: 20,
        fontSize: 16
    }
})