import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/config';
import firebase from 'firebase';

class MiPerfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posteos: [],
      email: auth.currentUser.email,
      username: ''
    };
  }

  componentDidMount() {
    this.traerDatosUsuario();
    this.traerPosteos();
  }

  traerDatosUsuario() {
    db.collection('users')
      .where('owner', '==', this.state.email)
      .onSnapshot(docs => {
        let usuarios = [];
        docs.forEach(doc => {
          usuarios.push({
            id: doc.id,
            data: doc.data()
          });
        });
        if (usuarios.length > 0) {
          this.setState({ 
            username: usuarios[0].data.username || ''
          });
        }
      });
  }

  traerPosteos() {
    db.collection('posts')
      .where('owner', '==', this.state.email)
      .orderBy('createdAt', 'desc')
      .onSnapshot(docs => {
        let posts = [];
        docs.forEach(doc => {
          posts.push({
            id: doc.id,
            data: doc.data()
          });
        });
        this.setState({ 
          posteos: posts
        });
      });
  }

  eliminarPosteo(postId) {
    db.collection('users')
      .where('owner', '==', this.state.email)
      .get()
      .then(docs => {
        docs.forEach(doc => {
          doc.ref.update({
            posts: firebase.firestore.FieldValue.arrayRemove(postId)
          });
        });
      })
      .then(() => {
        this.traerPosteos();
      })
      .catch(error => console.log('Error', error));
  }

  logout() {
    auth.signOut()
      .then(() => this.props.navigation.navigate('Login'))
      .catch(error => console.log('Error', error));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Perfil</Text>
        <Text>Usuario: {this.state.username}</Text>
        <Text>Email: {this.state.email}</Text>

        <Text style={styles.subtitulo}>Tus posteos</Text>
        {this.state.posteos.length === 0 ? (
          <Text>No hay posteos</Text>
        ) : (
          <FlatList
            data={this.state.posteos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.post}>
              
                <TouchableOpacity 
                  style={styles.botonBorrar} 
                  onPress={() => this.eliminarPosteo(item.id)}
                >
                  <Text style={styles.textoBorrar}>Borrar</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <TouchableOpacity 
          style={styles.botonLogout} 
          onPress={() => this.logout()}
        >
          <Text style={styles.textoLogout}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    flex: 1 
  },
  titulo: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  subtitulo: { 
    marginTop: 20, 
    fontSize: 18, 
    fontWeight: '600' 
  },
  post: { 
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderColor: '#ccc',
    marginBottom: 10 
  },
  botonBorrar: { 
    backgroundColor: '#e74c3c', 
    marginTop: 5, 
    padding: 8,
    borderRadius: 4, 
    width: 80,
    alignSelf: 'flex-end'
  },
  textoBorrar: { 
    color: 'white', 
    textAlign: 'center' 
  },
  botonLogout: { 
    marginTop: 30, 
    backgroundColor: 'gray', 
    padding: 12, 
    borderRadius: 5,
    marginHorizontal: 50
  },
  textoLogout: { 
    color: 'white', 
    textAlign: 'center', 
    fontWeight: 'bold' 
  }
});

export default MiPerfil;