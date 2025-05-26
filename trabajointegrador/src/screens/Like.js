import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { db, auth } from '../firebase/config'
import firebase from 'firebase'

export default class Post extends Component {
    constructor(props){
        super(props)
        this.state = {
            liked: false,
            likeCount: this.props.data.likes ? this.props.data.likes.length : 0
        }
    }

    componentDidMount(){
        if(this.props.data.likes){
            const likeCount = this.props.data.likes.length
            const liked = this.props.data.likes.includes(auth.currentUser.email)
            
            this.setState({
                likeCount: likeCount,
                liked: liked
            })
        }
    }

    likePost(){
        db
        .collection('posts')
        .doc(this.props.id)
        .update({
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
        })
        .then(() => this.setState({
            liked: true,
            likeCount: this.state.likeCount + 1
        }))
        .catch(err => console.log(err))
    }

    unlikePost(){
        db
        .collection('posts')
        .doc(this.props.id)
        .update({
            likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
        })
        .then(() => this.setState({
            liked: false,
            likeCount: this.state.likeCount - 1
        }))
        .catch(err => console.log(err))
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.props.data.texto}</Text>
                <Text>Publicado por: {this.props.data.emailCreador}</Text>
                <Text>Likes: {this.state.likeCount}</Text>
                
                {
                    this.state.liked ?
                    <TouchableOpacity
                        onPress={() => this.unlikePost()}
                        style={styles.likeButton}
                    >
                        <Text style={styles.likedText}>Quitar Me gusta</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        onPress={() => this.likePost()}
                        style={styles.likeButton}
                    >
                        <Text style={styles.likeText}>Me gusta</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8
    },
    likeButton: {
        marginTop: 10,
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        alignSelf: 'flex-start'
    },
    likeText: {
        color: '#3897f0',
        fontWeight: 'bold'
    },
    likedText: {
        color: '#ff0000',
        fontWeight: 'bold'
    }
})