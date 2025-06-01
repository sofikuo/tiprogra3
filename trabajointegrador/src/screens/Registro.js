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
                <Text style={styles.title}>
                    Registro
                </Text>
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
        padding: 24,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fafafa', // Mismo fondo que Home/Perfil
    },
    input: {
        borderWidth: 1,
        borderColor: '#ffcdb2', // Borde melocotón
        marginBottom: 16,
        padding: 14,
        borderRadius: 12, // Bordes más redondeados
        backgroundColor: '#ffffff',
        fontSize: 16,
        color: '#6d6875', // Texto gris lavanda
        shadowColor: '#6d6875',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    button: {
        backgroundColor: '#b5838d', // Rosa polvoriento
        padding: 14,
        borderRadius: 30, // Bordes muy redondeados
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#b5838d',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600', // Semi-bold en lugar de bold
        fontSize: 16,
        letterSpacing: 0.5, // Espaciado elegante
    },
    link: {
        color: '#b5838d', // Rosa polvoriento
        marginTop: 20,
        textAlign: 'center',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    error: {
        color: '#e5989b', // Rosa suave para errores
        marginBottom: 16,
        textAlign: 'center',
        backgroundColor: 'rgba(229, 152, 155, 0.1)',
        padding: 8,
        borderRadius: 8,
    },
    decoracionFondo: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 205, 178, 0.15)',
        top: -50,
        right: -50,
        zIndex: -1,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#6d6875',
        marginBottom: 32,
        textAlign: 'center',
      },
});

