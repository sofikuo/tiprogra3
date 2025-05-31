import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Post from '../components/Post';
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
      .where('emailCreador', '==', this.state.email)
      .onSnapshot(docs => {
        let posts = docs.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        }));

        posts.sort((a, b) => b.data.createdAt - a.data.createdAt);

        this.setState({
          posteos: posts
        });
      });
  }

  eliminarPosteo(postId) {
    db.collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
          this.props.navigation.navigate('Home');
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
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>Perfil</Text>

        <Text>Usuario: {this.state.username}</Text>
        <Text>Email: {this.state.email}</Text>

        <Text style={styles.subtitulo}>Tus posteos</Text>

        {this.state.posteos.length === 0 ? (
          <Text>No hay posteos</Text>
        ) : (
          <FlatList
            data={this.state.posteos}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <Post
                texto={item.data.texto}
                emailCreador={item.data.emailCreador}
                createdAt={item.data.createdAt}
                likes={item.data.likes}
                emailUsuarioActual={auth.currentUser.email}
                onLikePress={() => this.likePosteo(item.id, item.data.likes || [])}
                mostrarLikes={false}
                onEliminarPress={() => this.eliminarPosteo(item.id)}
              />
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
  contenedor: {
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
  postText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6
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
  },
  botonCrearPost: {
    marginTop: 10,
    backgroundColor: '#2980b9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20
  },
  textoCrearPost: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

export default MiPerfil;
