import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

export default class Forminput extends Component<Formprops, {}> {
    render() {
        const {
            placeholder,
            password,
            icon
        } = this.props;

        return (
            <View style={style.container}>
                <Text style={style.formlabel}>{placeholder}</Text>
                <View style={style.forminputwrapper}>
                    <Icon name={icon} size={20} color="#2E85B2" />
                    <TextInput placeholder={placeholder} style={style.forminput} secureTextEntry={password} />
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create({
    container: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    forminputwrapper: {
        height: 40,
        marginHorizontal: 10,
        marginTop: 2,
        marginBottom: 10,
        borderWidth: 1,
        padding: 0,
        width: '100%',
        borderRadius: 10,
        borderColor: '#CDC9C9',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    forminput: {
        borderWidth: 0,
        height:40,
        width:'90%',
        textAlign:'left'
    },
    formlabel: {
        textAlign: 'left',
        width: '100%',
        fontWeight: 'bold',
        paddingLeft: 4
    }
});



class Formprops {
    placeholder?: string;
    password?: boolean;
    icon?:string;
}
