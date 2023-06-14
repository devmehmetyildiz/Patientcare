import { styled } from 'styled-components/native';

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
    justifyContent: 'center',
});

const LogoImage = styled.Image({
    width: 180,
    height: 180,
    marginVertical: 40

});

const Appnametext = styled.Text({
    fontSize: 20,
    padding: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2E85B2',
    marginBottom: 10
});

export {
    Footerview,
    Content,
    Container,
    LogoImage,
    Appnametext
}