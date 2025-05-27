import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/config';
import firebase from 'firebase';

class LikearPosteo extends Component {
  constructor() {
    super();
    this.state = {
      posteos: [],
      email: ''
    };
  }

  componentDidMount() {
    this.TodosPosteos();
  }

  TodosPosteos() {
    const email = auth.currentUser.email;
    this.setState({ email });

    db.collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot((docs) => {
        const posteosActualizados = [];
        docs.forEach((doc) => {
          posteosActualizados.push({
            id: doc.id,
            data: doc.data()
          });
        });
        this.setState({ posteos: posteosActualizados });
      });
  }

  manejarLike(posteoDoc) {
    const { email } = this.state;
    const docPosteo = db.collection('posts').doc(posteoDoc.id);
    const listaDeLikes = posteoDoc.data.likes || [];

    let usuarioLeDioLike = false;
    for (let i = 0; i < listaDeLikes.length; i++) {
      if (listaDeLikes[i] === email) {
        usuarioLeDioLike = true;
        break;
      }
    }

    if (usuarioLeDioLike) {
      docPosteo.update({
        likes: firebase.firestore.FieldValue.arrayRemove(email)
      });
    } else {
      docPosteo.update({
        likes: firebase.firestore.FieldValue.arrayUnion(email)
      });
    }
  }

  renderizarPosteo = ({ item }) => {
    const { email } = this.state;
    const likes = item.data.likes || [];

    let usuarioLeDioLike = false;
    for (let i = 0; i < likes.length; i++) {
      if (likes[i] === email) {
        usuarioLeDioLike = true;
        break;
      }
    }

    return (
      <View style={estilos.posteo}>
        <Text>{item.data.text}</Text>

        <TouchableOpacity onPress={() => this.manejarLike(item)}>
          <Text style={usuarioLeDioLike ? estilos.megusta : estilos.nomegusta}>
            {usuarioLeDioLike ? 'No me gusta' : 'Me gusta'} ({likes.length})
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={estilos.contenedor}>
        <Text style={estilos.titulo}>Posteos</Text>

        <FlatList
          data={this.state.posteos}
          renderItem={this.renderizarPosteo}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 15
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  posteo: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 10
  },
  megusta: {
    color: 'red',
    marginTop: 5
  },
  nomegusta: {
    color: 'blue',
    marginTop: 5
  }
});

export default LikearPosteo;

