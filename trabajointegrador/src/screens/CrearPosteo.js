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

    if (!textoPost.trim()) {
      this.setState({ error: 'El texto del post no puede estar vacío' });
      return;
    }

    if (user) {
      const nuevoPost = {
        texto: textoPost,
        emailCreador: user.email,
        createdAt: Date.now(),
        likes: [], // Array para guardar emails de usuarios que dieron like
      };

      db.collection('posts').add(nuevoPost)
        .then(() => {
          Alert.alert('Éxito', 'Post creado correctamente');
          this.setState({ textoPost: '' });
          this.props.navigation.navigate('Home'); // Redirigir a la pantalla principal
        })
        .catch(error => {
          console.error('Error al crear post:', error);
          this.setState({ error: 'Error al crear el post' });
        });
    } else {
      this.props.navigation.navigate('Login');
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
          multiline
          numberOfLines={4}
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

