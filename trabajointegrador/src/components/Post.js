import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function Post(props) {
    const { texto, emailCreador, createdAt, likes, onLikePress, mostrarLikes, onEliminarPress } = props;

    return (
        <View style={styles.contenedor}>
            <Text style={styles.email}>{emailCreador}</Text>
            <Text style={styles.texto}>{texto}</Text>

            {mostrarLikes && (
                <View style={styles.likesContainer}>
                    <Text>Cantidad de likes: {likes ? likes.length : 0}</Text>
                    <Text
                        style={styles.likeButton}
                        onPress={onLikePress}
                    >
                        {likes && likes.includes(props.emailUsuarioActual) ? 'No Me Gusta' : 'Me gusta'}
                    </Text>
                </View>
            )}

            {onEliminarPress && (
                <TouchableOpacity style={styles.botonBorrar} onPress={onEliminarPress}>
                    <Text style={styles.textoBorrar}>Borrar</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    email: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    texto: {
        fontSize: 16,
        marginBottom: 8,
    },
    botonesContainer: {
        flexDirection: 'row',          
        justifyContent: 'flex-end',
        gap: 10                       
    },
    likeButton: {
        color: 'black',
        marginRight: 10,   
        textAlign: 'right'           
    },
    botonBorrar: {
        backgroundColor: 'grey',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    textoBorrar: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',

    }
});

export default Post;