import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    FlatList
} from 'react-native'
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
                    <Text>Cargando posts...</Text>
                ) : (
                    <FlatList
                        data={this.state.posts}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.postContainer}>
                                <Text style={styles.postEmail}>{item.data.emailCreador}</Text>
                                <Text style={styles.postText}>{item.data.texto}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={styles.postLikes}>
                                        Cantidad de likes: {item.data.likes ? item.data.likes.length : 0}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => this.likePosteo(item.id, item.data.likes || [])}
                                    >
                                        <Text style={{ color: 'grey' }}>
                                            {item.data.likes && item.data.likes.includes(auth.currentUser.email) ? 'No Me Gusta' : 'Me gusta'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
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
    },
    postLikes: {
        fontSize: 13,
        color: '#888',
        textAlign: 'right',
    },
});


export default Home;
