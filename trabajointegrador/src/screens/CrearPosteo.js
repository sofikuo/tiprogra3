import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../firebase/config';

export default class CrearPosteo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textoPost: '',
      error: null
    };
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
    padding: 24,
    backgroundColor: '#fff', 
    backgroundImage: 'linear-gradient(to bottom, #fff5f5 0%, #fafafa 100%)', // Degradado rosa-blancuzco
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
    color: '#6d6875',
    fontFamily: 'Helvetica Neue', // Tipografía más delicada
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 205, 178, 0.7)', // Borde melocotón translúcido
    borderRadius: 18, // Bordes más redondeados
    padding: 18,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Blanco semi-transparente
    backdropFilter: 'blur(5px)', // Efecto vidrio esmerilado
    minHeight: 160,
    textAlignVertical: 'top',
    color: '#6d6875',
    shadowColor: '#ffcdb2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  boton: {
    backgroundColor: '#b5838d',
    paddingVertical: 16, // Más alto
    paddingHorizontal: 32,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#b5838d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(181, 131, 141, 0.2)', // Detalle de borde sutil
  },
  textoBoton: {
    color: '#fff',
    fontSize: 18, // Un poco más grande
    fontWeight: '600',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  error: {
    color: '#e5989b',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
    backgroundColor: 'rgba(229, 152, 155, 0.1)',
    padding: 8,
    borderRadius: 10,
  },
  decoracionFondo: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 205, 178, 0.15)', // Círculo difuminado
    top: -50,
    right: -50,
    zIndex: -1,
  },
});