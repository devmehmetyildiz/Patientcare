import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
export default class Units extends Component<{ navigation: any }, {}> {
    render() {

        const { navigation } = this.props;

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Unit Screen</Text>
                <Button title="to Case screen" onPress={() => {
                    navigation.navigate('Case');
                }} />
            </View>
        );
    }
}
