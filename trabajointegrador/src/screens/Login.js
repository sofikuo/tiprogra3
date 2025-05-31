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

        <Button
          title="Iniciar sesión"
          onPress={() => this.login(email, pass)}
          color="gray"
        />

        <TouchableOpacity onPress={() => this.props.navigation.navigate('Registro')}>
          <Text style={styles.link}>Regístrate aquí</Text>
        </TouchableOpacity>
      </View>
    );
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
});

export default Login;
