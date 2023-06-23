import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { Component } from 'react';
import { navigationRef } from './Services/Navigationservice';
import Login from './Pages/Login/Login';
import Cases from './Pages/Cases/Cases';
import Home from './Pages/Home/Home';


const Stack = createNativeStackNavigator();
export default class Routes extends Component {

    render() {
        return (
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Case" component={Cases} />
                    <Stack.Screen name="Home" component={Home} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}
