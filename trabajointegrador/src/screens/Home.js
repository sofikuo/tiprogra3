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
                    <ActivityIndicator size="large" color="blue" />
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
        backgroundColor: '#f4f4f4',
        padding: 16,
    },
    postContainer: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    postEmail: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 6,
    },
    postText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    }
});


export default Home;
