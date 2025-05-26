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

  login(email, pass) {
    auth.signInWithEmailAndPassword(email, pass)
      .then(() => {
        this.setState({ loggedIn: true });
        this.props.navigation.replace('MainTabs'); 
      })
      .catch(error => {
        this.setState({ error: 'Credenciales inválidas.' });
        console.error(error);
      });
  }

  render() {
    const { email, pass, error } = this.state;

    return (
      <View style={styles.container}>
        <TextInput
          placeholder="email"
          value={auth.email}
          onChangeText={(text) => this.setState({ email: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="password"
          value={auth.password}
          onChangeText={(text) => this.setState({ pass: text })}
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
