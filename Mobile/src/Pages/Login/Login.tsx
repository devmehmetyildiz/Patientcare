import React, { Component } from 'react';
import { Platform, Text } from 'react-native';
import Images from '../../Assets/Images';
import { Appnametext, Container, Content, Footerview, LogoImage } from '../../Components/Logincomponents';
import { Formbutton, Forminput } from '../../Components/Common';
import { Webservice } from '../../Utils/Webservice';

export default class Login extends Component {

    private _webservice: Webservice;

    constructor(props: any) {
        super(props);

    }


    async componentDidMount(): Promise<void> {

        let baseurl: string = "http://172.16.30.183:8000/";
        let path: string = "Oauth/TestServer"
        await Webservice.doGet(baseurl, path)
    }

    render() {
        return (
            <Container
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust the value according to your layout
            >
                <Content>
                    <LogoImage source={Images.patient} />
                    <Appnametext>Patient Care Hasta Bakım Sistemi</Appnametext>
                    <Forminput icon="user" placeholder="Kullanıcı Adı" />
                    <Forminput icon="lock" placeholder="Parola" password />
                    <Formbutton title="Giriş Yap" />
                </Content>
                <Footerview>
                    <Text>Terms of Use</Text>
                    <Text>ARMS Teknoloji 2023</Text>
                </Footerview>
            </Container>
        );
    }
}


