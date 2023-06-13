import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Images from '../../Assets/Images';
import { SafeAreaView } from 'react-native-safe-area-context';
import Forminput from '../../Components/Forminput';
import Formbutton from '../../Components/Formbutton';

export default class Login extends Component {
    render() {
        return (
            <SafeAreaView style={style.container}>
                <Image
                    style={style.icon}
                    source={Images.patient}
                />
                <Text style={style.appnametxt}>Patient Care Hasta Bakım Sistemi</Text>
                <Forminput icon="user" placeholder="Kullanıcı Adı" />
                <Forminput icon="lock" placeholder="Parola" password />
                <Formbutton title="Giriş Yap" />
                <View style={style.footerwrapper}>
                    <Text>Terms of Use</Text>
                    <Text>ARMS Teknoloji 2023</Text>
                </View>
            </SafeAreaView>
        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    icon: {
        width: 180,
        height: 180,
        marginVertical: 40
    },
    appnametxt: {
        fontSize: 20,
        padding: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#2E85B2',
        marginBottom: 10
    },
    footerwrapper: {
        gap: 5,
        alignItems: 'center',
        fontWeight: '300',
        zIndex: 0
    }
})