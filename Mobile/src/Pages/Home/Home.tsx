import React, { Component } from 'react'
import { View, Text } from 'react-native';
import { ProfileService } from '../../Services';

export default class Home extends Component {

    private _profileservice: ProfileService;

    constructor(props: any) {
        super(props)
        this._profileservice = ProfileService.getInstance()
    }


    componentDidMount(): void {
        this._profileservice.GetActiveUser()
    }

    render() {
        return (
            <Text>Home</Text>
        )
    }
}
