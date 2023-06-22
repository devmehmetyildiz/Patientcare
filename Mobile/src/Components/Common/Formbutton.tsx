import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default class Formbutton extends Component<Buttonprops, {}> {
    render() {
        const { title, onPress } = this.props;
        return (
            <View style={style.signInbuttonwrapper}>
                <TouchableOpacity style={style.sigInbutton} onPress={onPress}>
                    <Text style={style.signInbuttontxt}>{title}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const style = StyleSheet.create({
    signInbuttonwrapper: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex'
    },
    sigInbutton: {
        width: '50%',
        margin: 5,
        padding: 10,
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: '#2E85B2',
        borderRadius: 15
    },
    signInbuttontxt: {
        color: 'white',
        fontWeight: 'bold'
    }
})

class Buttonprops {
    title?: string;
    onPress?: any;
}