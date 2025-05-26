import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, {Component} from 'react';
import { auth, db } from '../firebase/config';
import Usuario from '../components/Usuario';

class Perfil extends Component {
    constructor(props){
    super(props)
    this.state = {
      usuarios: []
    }
  }



};

export default Perfil;