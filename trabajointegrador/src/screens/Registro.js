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
            username: ''
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.props.navigation.navigate('MainTabs')
            }
        })
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
                            this.props.navigation.navigate('MainTabs');
                        })
                        .catch(error => console.log('Error al guardar en Firestore:', error));
                })
                .catch(error => console.log('Error al crear usuario:', error));
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    keyboardType='default'
                    value={this.state.email}
                    onChangeText={(texto) => this.setState({ email: texto, error: false })}
                    placeholder='email'
                />
                <TextInput
                    style={styles.input}
                    keyboardType='default'
                    value={this.state.password}
                    onChangeText={(texto) => this.setState({ password: texto, error: false })}
                    placeholder='password'
                    secureTextEntry={true}
                />
                <TextInput
                    style={styles.input}
                    keyboardType='default'
                    value={this.state.username}
                    onChangeText={(texto) => this.setState({ username: texto, error: false })}
                    placeholder='usuario'
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        this.registrarUsuario(this.state.email, this.state.password, this.state.username);
                    }}
                >
                    <Text style={styles.buttonText}>Registrarme</Text>
                </TouchableOpacity>


                {this.state.error ? (
                    <Text style={styles.error}>Credenciales inválidas</Text>
                ) : null}

                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                    <Text style={styles.link}>Haz Login aquí</Text>
                </TouchableOpacity>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 12,
        padding: 10,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center'
    },
    link: {
        color: 'black',
        marginTop: 15,
        textAlign: 'center',
    },
    button: {
        backgroundColor: 'gray',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }
});
