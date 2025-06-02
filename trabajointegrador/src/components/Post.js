import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

function Post(props) {
    const { texto, emailCreador, createdAt, likes, onLikePress, mostrarLikes, onEliminarPress } = props;

    return (
        <View style={styles.contenedor}>
            <Text style={styles.email}>{emailCreador}</Text>
            <Text style={styles.texto}>{texto}</Text>

            {mostrarLikes && (
                <View style={styles.likesContainer}>
                    <Text>Cantidad de likes: {likes ? likes.length : 0}</Text>
                    <TouchableOpacity style={styles.likeButtonContainer} onPress={onLikePress}>
                        <AntDesign
                            name={likes && likes.includes(props.emailUsuarioActual) ? 'heart' : 'hearto'}
                            size={20}
                            color="pink"
                            style={{ marginRight: 5 }}
                    />
                    <Text
                        style={styles.likeButton}
                        onPress={onLikePress}
                    >
                        {likes && likes.includes(props.emailUsuarioActual) ? 'No Me Gusta' : 'Me gusta'}
                    </Text>
                    </TouchableOpacity>
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
        backgroundColor: '#fff0f5', // rosa pálido estilizado
        padding: 16,
        marginBottom: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    email: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3d3d3d',
        marginBottom: 6,
    },
    texto: {
        fontSize: 16,
        color: '#4a4a4a',
        marginBottom: 12,
        lineHeight: 22,
    },
    likesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    iconoLike: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    textoLike: {
        marginLeft: 8,
        fontSize: 16,
        color: '#1e3d59',
        fontWeight: '500',
    },
    cantidadLikes: {
        fontSize: 14,
        color: '#888',
    },
    botonBorrar: {
        marginTop: 12,
        padding: 10,
        backgroundColor: '#ffe0e0',
        borderRadius: 8,
        alignItems: 'center',
    },
    textoBorrar: {
        color: '#d62828',
        fontWeight: 'bold',
    },
});

export default Post;