import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    FlatList
} from 'react-native';
import Post from '../components/Post';
import { auth, db } from "../firebase/config";
import firebase from 'firebase';

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            posts: []
        }
    }
    componentDidMount() {
        this.fetchPosts();
    }

    fetchPosts() {
        db.collection('posts')
            .orderBy('createdAt', 'desc')
            .onSnapshot(docs => {
                let posts = [];
                docs.forEach(doc => {
                    const data = doc.data();
                    if (data.texto && data.texto !== '') {
                        posts.push({
                            id: doc.id,
                            data: data
                        });
                    }
                });
                this.setState({
                    posts: posts,
                    loading: false
                })
            })
    }

    likePosteo(postId, likesArray) {
        const email = auth.currentUser.email;

        if (likesArray.includes(email)) {
            db.collection('posts').doc(postId).update({
                likes: firebase.firestore.FieldValue.arrayRemove(email)
            });
        } else {
            db.collection('posts').doc(postId).update({
                likes: firebase.firestore.FieldValue.arrayUnion(email)
            });
        }
    }



    redireccionar(nombrePantalla, params = {}) {
        this.props.navigation.navigate(nombrePantalla, params)
    }

    render() {
        return (
            <View style={styles.contenedor}>

                {this.state.loading ? (
                    <ActivityIndicator size="large" color="#b5838d" />
                ) : (
                    <FlatList
                        data={this.state.posts}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <Post
                                texto={item.data.texto}
                                emailCreador={item.data.emailCreador}
                                createdAt={item.data.createdAt}
                                likes={item.data.likes}
                                emailUsuarioActual={auth.currentUser.email}
                                onLikePress={() => this.likePosteo(item.id, item.data.likes || [])}
                                mostrarLikes={true} 
                            />
                        )}
                    />

                )}

                <TouchableOpacity
                    onPress={() => this.redireccionar('TabNavigation')}
                >
                </TouchableOpacity>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    contenedor: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fafafa', // Fondo sólido que matchea el degradado
    },
    postContainer: {
      backgroundColor: '#ffffff',
      padding: 16,
      marginBottom: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#ffcdb2', // Borde melocotón
      shadowColor: '#6d6875',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    postEmail: {
      fontSize: 14,
      fontWeight: '600',
      color: '#b5838d', // Rosa polvoriento
      marginBottom: 6,
    },
    postText: {
      fontSize: 16,
      color: '#6d6875', // Gris lavanda
      marginBottom: 8,
      lineHeight: 22,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#fafafa', // Mismo fondo
    },
    decoracionFondo: {
      position: 'absolute',
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: 'rgba(255, 205, 178, 0.15)', // Círculo melocotón
      top: -50,
      right: -50,
      zIndex: -1,
    },
    decoracionFondoSecundario: {
      position: 'absolute',
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: 'rgba(181, 131, 141, 0.1)', // Círculo rosa
      bottom: -30,
      left: -30,
      zIndex: -1,
    }
  });


export default Home;
