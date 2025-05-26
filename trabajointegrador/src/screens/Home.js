import React, {Component} from "react";
import {
    View, 
    Text, 
    Image, 
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native'

class Home extends Component{
    constructor(props){
        super(props)
    }

    redireccionar(nombrePantalla, params = {}){
        this.props.navigation.navigate(nombrePantalla, params)
    }

    render(){
        return(
            <View style={styles.contenedor}>

                <TouchableOpacity
                    onPress={() => this.redireccionar('Registro')}
                >
                    <Text>Ir a Registro</Text>
                </TouchableOpacity>


                <ActivityIndicator 
                    color={'red'}
                    size={40}
                />

                <TouchableOpacity
                    onPress={()=> this.redireccionar('TabNavigation')}
                >
                    <Text>
                        Entrar a la aplicacion
                    </Text>
                </TouchableOpacity>

                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contenedor:{
        flex:1
    }
})

export default Home;