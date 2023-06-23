import React, { Component } from 'react';
import { Platform, Text } from 'react-native';
import Images from '../../Assets/Images';
import { Formbutton, Forminput } from '../../Components/Common';
import { ProfileService } from '../../Services';
import { styled } from 'styled-components/native';
export default class Login extends Component<{ redirectPage: string }, LoginStates> {

    private _profileService: ProfileService;

    constructor(props: any) {
        super(props);
        this._profileService = ProfileService.getInstance();
        this.state = {
            Username: '',
            Password: ''
        };
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
                    <Forminput icon="user" placeholder="Kullanıcı Adı" onChangeText={(text: string) => this.setState({ Username: text })} value={this.state.Username} />
                    <Forminput icon="lock" placeholder="Parola" password onChangeText={(text: string) => this.setState({ Password: text })} value={this.state.Password} />
                    <Formbutton title="Giriş Yap" onPress={this.handleSubmit} />
                </Content>
                <Footerview>
                    <Text>Terms of Use</Text>
                    <Text>ARMS Teknoloji 2023</Text>
                </Footerview>
            </Container>
        );
    }

    handleSubmit = () => {
        this._profileService.Login(this.state.Username, this.state.Password, this.props.redirectPage);
    };
}

interface LoginStates {
    Username: string;
    Password: string;
}


const Footerview = styled.View({
    alignItems: 'center',
    fontWeight: '300',
    zIndex: 0
});

const Content = styled.View({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
});

const Container = styled.KeyboardAvoidingView({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
});

const LogoImage = styled.Image({
    width: 180,
    height: 180,
    marginTop: 40,
    marginBottom: 40
});

const Appnametext = styled.Text({
    fontSize: '20px',
    padding: '5px',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2E85B2',
    marginBottom: '10px'
});
