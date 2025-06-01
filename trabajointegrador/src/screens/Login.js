import React, { Component } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebase/config';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pass: '',
      error: '',
      loggedIn: false
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      console.log(user);
      if (user) {
        console.log('Usuario logueado:', auth.currentUser.email);
        this.props.navigation.navigate('MainTabs');
      }
    });
  }


  login(email, pass) {
    if (email === '' || pass === '') {
      this.setState({ error: 'Campos vacíos' });
      return;
    }

    if (!email.includes('@')) {
      this.setState({ error: 'El email no es válido' });
      return;
    }

    if (pass.length < 6) {
      this.setState({ error: 'Contraseña incorrecta' });
      return;
    }

    auth.signInWithEmailAndPassword(email, pass)
      .then(() => {
        this.setState({ loggedIn: true });
        this.props.navigation.replace('MainTabs');
      })
      .catch(error => {
        this.setState({ error: 'Datos inválidos' });
        console.error(error);
      });
  }

  render() {
    const { email, pass, error } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Iniciar Sesión
        </Text>

        <TextInput
          placeholder="email"
          value={this.state.email}
          onChangeText={(text) => this.setState({ email: text, error: '' })}
          style={styles.input}
        />

        <TextInput
          placeholder="password"
          value={this.state.pass}
          onChangeText={(text) => this.setState({ pass: text, error: '' })}
          style={styles.input}
          secureTextEntry={true}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.login(email, pass)}
        >
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('Registro')}>
          <Text style={styles.link}>Regístrate aquí</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ffcdb2',
    marginBottom: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#6d6875',
    shadowColor: '#6d6875',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#b5838d',
    padding: 14,
    borderRadius: 30,
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
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  link: {
    color: '#b5838d',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  error: {
    color: '#e5989b',
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

export default Login;
