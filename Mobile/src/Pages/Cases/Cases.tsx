/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
export default class Cases extends Component<{ navigation: any }, {}> {
    render() {

        const { navigation } = this.props;

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Case Screen</Text>
                <Button title="to Unit screen" onPress={() => {
                    navigation.navigate('Unit');
                }} />
            </View>
        );
    }
}
