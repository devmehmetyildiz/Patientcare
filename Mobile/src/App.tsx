import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cases from './Pages/Cases/Cases';
import Units from './Pages/Units/Units';
import Login from './Pages/Login/Login';

const Stack = createNativeStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Case" component={Cases} />
          <Stack.Screen name="Unit" component={Units} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
