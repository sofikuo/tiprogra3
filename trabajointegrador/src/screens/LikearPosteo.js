import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/config';

class LikearPosteo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogueado: null,
      posteosUsuario: [],
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ usuarioLogueado: user });
        this.cargarPosteos(user.email);
      } else {
        this.setState({ usuarioLogueado: null, posteosUsuario: [] });
        this.props.navigation.navigate('Login');
      }
    });
  }

  cargarPosteos(email) {
    this.unsubscribe = db.collection('posts')
      .where('usuario', '==', email)
      .onSnapshot(snapshot => {
        let posteos = [];
        snapshot.forEach(doc => {
          posteos.push({ id: doc.id, data: doc.data() });
        });
        this.setState({ posteosUsuario: posteos });
      }, error => console.log('Error', error));
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  manejarLike(posteo) {
    const emailUsuario = this.state.usuarioLogueado.email;
    const likesActuales = posteo.data.likes || [];
    let tieneLike = false;

    for (let i = 0; i < likesActuales.length; i++) {
      if (likesActuales[i] === emailUsuario) {
        tieneLike = true;
      }
    }

    let nuevosLikes = [];

    if (tieneLike) {
      for (let i = 0; i < likesActuales.length; i++) {
        if (likesActuales[i] !== emailUsuario) {
          nuevosLikes.push(likesActuales[i]);
        }
      }
    } else {
      for (let i = 0; i < likesActuales.length; i++) {
        nuevosLikes.push(likesActuales[i]);
      }
      nuevosLikes.push(emailUsuario);
    }

    db.collection('posts')
      .doc(posteo.id)
      .update({ likes: nuevosLikes })
      .then(() => {
        let posteosActualizados = [];
        for (let i = 0; i < this.state.posteosUsuario.length; i++) {
          let p = this.state.posteosUsuario[i];
          if (p.id === posteo.id) {
            posteosActualizados.push({
              id: p.id,
              data: {
                texto: p.data.texto,
                autor: p.data.autor,
                likes: nuevosLikes
              }
            });
          } else {
            posteosActualizados.push(p);
          }
        }
        this.setState({ posteosUsuario: posteosActualizados });
      })
      .catch(error => console.log('Error', error));
  }

  borrarPosteo(id) {
    db.collection('posts')
      .doc(id)
      .delete()
      .then(() => {
        let posteosFiltrados = [];
        for (let i = 0; i < this.state.posteosUsuario.length; i++) {
          if (this.state.posteosUsuario[i].id !== id) {
            posteosFiltrados.push(this.state.posteosUsuario[i]);
          }
        }
        this.setState({ posteosUsuario: posteosFiltrados });
      })
      .catch(error => console.log('Error', error));
  }

  logout() {
    auth.signOut()
      .then(() => this.props.navigation.navigate('Login'))
      .catch(error => console.log('Error', error));
  }

  render() {
    const usuarioLogueado = this.state.usuarioLogueado;
    const posteosUsuario = this.state.posteosUsuario;

    if (!usuarioLogueado) {
      return (
        <View style={styles.container}>
          <Text>Cargando usuario...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Perfil</Text>
        <Text>Nombre: {usuarioLogueado.displayName || 'Usuario'}</Text>
        <Text>Email: {usuarioLogueado.email}</Text>

        <Text style={styles.subtitulo}>Tus posteos:</Text>

        {posteosUsuario.length === 0 ? (
          <Text>No tenés posteos.</Text>
        ) : (
          <FlatList
            data={posteosUsuario}
            keyExtractor={function(item) { return item.id; }}
            renderItem={({ item }) => {
              const emailUsuario = usuarioLogueado.email;
              const likes = item.data.likes || [];

              let tieneLike = false;
              for (let i = 0; i < likes.length; i++) {
                if (likes[i] === emailUsuario) {
                  tieneLike = true;
                }
              }

              return (
                <View style={styles.posteo}>
                  <Text>{item.data.texto}</Text>

                  <View style={styles.filaBotones}>
                    <TouchableOpacity onPress={() => this.manejarLike(item)}>
                      <Text style={tieneLike ? styles.meGustaActivo : styles.meGusta}>
                        Me gusta ({likes.length})
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.borrarPosteo(item.id)}>
                      <Text style={styles.borrar}>Borrar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        )}

        <TouchableOpacity style={styles.logout} onPress={() => this.logout()}>
          <Text style={styles.textoLogout}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitulo: { fontSize: 18, marginTop: 15, marginBottom: 10 },
  posteo: {
    backgroundColor: '#eee',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  filaBotones: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  meGusta: { color: '#333', fontWeight: 'bold' },
  meGustaActivo: { color: '#e91e63', fontWeight: 'bold' },
  borrar: { color: 'red', fontWeight: 'bold' },
  logout: {
    marginTop: 30,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
  },
  textoLogout: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});

export default LikearPosteo;
