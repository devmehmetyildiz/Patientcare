import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cases from './Pages/Cases/Cases';
import Units from './Pages/Units/Units';
import Login from './Pages/Login/Login';
import { Webservice } from './Utils/Webservice';
import { Webserviceconfig } from './Models';
import Routes from './Routes';
import { View } from 'react-native';
import { styled } from 'styled-components/native';


export default class App extends Component {

  constructor(props: any) {
    super(props)
    let config = new Webserviceconfig();
    config.authUrl = 'http://172.16.30.183:8000/';
    config.userroleUrl = 'http://172.16.30.183:7996/';
    config.settingUrl = 'http://172.16.30.183:7998/';
    config.systemUrl = 'http://172.16.30.183:7997/';
    config.warehouseUrl = 'http://172.16.30.183:7995/';
    config.fileUrl = 'http://172.16.30.183:7994/';
    config.businessUrl = 'http://172.16.30.183:7999/';
    Webservice.Configure(config);
  }


  componentDidMount(): void {
  }

  render() {
    return (
      <Mainview>
        <Routes />
      </Mainview>
    )
  }
}

const Mainview = styled.View({
  flex: 1,
});