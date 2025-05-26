import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import React, {Component} from 'react';
import { auth, db } from '../firebase/config';

class Perfil extends Component {
  constructor(props){
    super(props)
    this.state = {
      posteos: [],
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName || 'Username',
    }
  }

  componentDidMount(){
    this.traerPosteos()
  }

  traerPosteos(){
    db.collection('posts')
      .where('owner', '==', this.state.email)
      .onSnapshot((docs) => {
        let arrDocs = [];
        docs.forEach((doc) => arrDocs.push({
          id: doc.id,
          data: doc.data()
        }))
        this.setState({ posteos: arrDocs })
      })
  }

  borrarPosteo(id){
    db.collection('posts').doc(id).delete()
      .then(() => console.log('Post eliminado'))
      .catch(error => console.log('Error al borrar post:', error))
  }

  logout(){
    auth.signOut()
      .then(()=> this.props.navigation.navigate('Login'))
      .catch(error => console.log('Error en signOut', error))
  }

  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Perfil</Text>
        <Text>Email: {this.state.email}</Text>
        <Text>Usuario: {this.state.displayName}</Text>

        <Text style={styles.subtitulo}>Mis posteos</Text>
        {
          this.state.posteos.length === 0 ?
          <Text>No tenés posteos</Text> :
          <FlatList
            data={this.state.posteos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.post}>
                <Text>{item.data.texto}</Text>

                <TouchableOpacity
                  style={styles.botonBorrar}
                  onPress={() => this.borrarPosteo(item.id)}
                >
                  <Text style={styles.textoBorrar}>Borrar</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        }

        <TouchableOpacity style={styles.botonLogout} onPress={() => this.logout()}>
          <Text style={styles.textoLogout}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    )
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
    borderColor: '#ccc'
  },
  botonBorrar: {
    backgroundColor: '#e74c3c',
    marginTop: 5,
    padding: 6,
    borderRadius: 4,
    width: 70
  },
  textoBorrar: {
    color: 'white',
    textAlign: 'center'
  },
  botonLogout: {
    marginTop: 30,
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5
  },
  textoLogout: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  }
})

export default Perfil;
