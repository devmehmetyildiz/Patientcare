import React, { useState } from 'react'
import { Image, KeyboardAvoidingView, SafeAreaView, Text, TextInput, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'
import Images from '../../Assets/Images'
import Forminput from '../../Components/Forminput'
import Toast from 'react-native-toast-message'

export default function Login() {

    const [form, setForm] = useState({})
    console.log('form: ', form);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <Container>
                <LinearGradient
                    colors={['rgba(255,255,255,1)', 'rgba(195,195,195,1)', 'rgba(35,85,160,1)']}
                    style={{ flex: 1 }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Imageview>
                        <Appimage source={Images.patient}></Appimage>
                        <Appname>Patient Care Hasta Bakım Uygulaması</Appname>
                        <Form>
                            <Forminput label='Kullanıcı Adı' onChange={(e) => { setForm(prev => ({ ...prev, Username: e })) }} />
                            <Forminput label='Parola' onChange={(e) => { setForm(prev => ({ ...prev, Password: e })) }} />
                        </Form>
                        <Submit onPress={() => {
                            Toast.show({
                                type: 'success',
                                text1: 'Hello',
                                text2: 'This is some something 👋',
                                autoHide: true,
                                visibilityTime: 3000
                            });
                        }}>
                            <Submittext>GİRİŞ YAP</Submittext>
                        </Submit>
                    </Imageview>
                </LinearGradient>
            </Container>
        </KeyboardAvoidingView>
    )
}


const Container = styled.SafeAreaView({
    flex: 1,

})

const Imageview = styled.View({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    marginBottom: '10px',
    gap: '20px'
})

const Appimage = styled.Image({
    height: 100,
    width: 100,
})

const Appname = styled.Text({
    fontSize: '24px',
    textAlign: 'center',
    color: '#2355a0',
    fontWeight: 'bold'
})

const Form = styled.View({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: '20px'
})

const Submit = styled.TouchableOpacity({
    width: '80%',
    padding: '10px',
    backgroundColor: '#2355a0',
    textAlign: 'center',
    color: 'white',
    borderRadius: '15px'
})

const Submittext = styled.Text({
    color: 'white',
    textAlign: 'center'
})