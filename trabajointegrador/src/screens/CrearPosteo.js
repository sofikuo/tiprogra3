import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../firebase/config';

export default class CrearPosteo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textoPost: '',
      error: null,
      usuarioLogueado: null
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ usuarioLogueado: user });
      } else {
        this.props.navigation.navigate('Login');
      }
    });
  }

  crearPost() {
    const { textoPost } = this.state;
    const user = auth.currentUser;

    // Validación del texto del post
    if (textoPost === '') {
      this.setState({ error: 'El post no puede estar vacio' });
      return;
    }

    if (user) {
      const nuevoPost = {
        texto: textoPost,
        emailCreador: user.email,
        createdAt: Date.now(),
        likes: [], 
      };

      db.collection('posts').add(nuevoPost)
        .then(() => {
          Alert.alert('Éxito', 'Post creado correctamente');
          this.setState({ textoPost: '' });
          this.props.navigation.navigate('Home'); 
        })
        .catch(error => {
          console.error('Error al crear post:', error);
          this.setState({ error: 'Error al crear el post' });
        });
    }
  }

  render() {
    if (!this.state.usuarioLogueado) {
      return (
        <View style={styles.container}>
          <Text>Cargando...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Crear nuevo post</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Escribe tu post aquí..."
          value={this.state.textoPost}
          onChangeText={(texto) => this.setState({ textoPost: texto, error: null })}
        />
        
        {this.state.error && <Text style={styles.error}>{this.state.error}</Text>}
        
        <TouchableOpacity
          style={styles.boton}
          onPress={() => this.crearPost()}
        >
          <Text style={styles.textoBoton}>Publicar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  boton: {
    backgroundColor: '#3897f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});