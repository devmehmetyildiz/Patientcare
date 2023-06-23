import React, { Component } from 'react'
import { View, Text } from 'react-native';
import { ProfileService } from '../../Services';
import Notification from '../Common/Notification';
import { styled } from 'styled-components/native';

export default class Home extends Component<{}, { isDatafetched: Boolean }> {

    private _profileservice: ProfileService;

    constructor(props: any) {
        super(props)
        this._profileservice = ProfileService.getInstance()
        this.state = {
            isDatafetched: false
        }
    }


    async componentDidMount(): Promise<void> {
        await this._profileservice.GetActiveUser()
        this.setState({ isDatafetched: true })
    }


    render() {
        return (
            <Wrapper>
                <Notification notification/>
                <Text>Home</Text>
                {(this._profileservice._notifications || []).map((element: any, index: number) => {
                    return <Text key={index}>{element.code}</Text>
                })}
            </Wrapper>
        )
    }
}

const Wrapper = styled.View({
    flex: 1,
    position: 'relative',
})