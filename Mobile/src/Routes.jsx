import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { Component } from 'react';
import { navigationRef } from './Provider/NavigationProvider';
import Cases from './Pages/Cases/Cases';
import Login from './Pages/Login/Login';
import Units from './Pages/Units/Units';

const Stack = createNativeStackNavigator();
export default class Routes extends Component {

    render() {
        return (
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator
                    initialRouteName="Cases"
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    <Stack.Screen name="Cases" component={Cases} />
                    <Stack.Screen name="Units" component={Units} />
                    <Stack.Screen name="Login" component={Login} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}