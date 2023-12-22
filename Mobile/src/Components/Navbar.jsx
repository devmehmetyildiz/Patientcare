import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { handleSidebaropen } from '../Redux/Page/Page';

export default function Navbar() {
    const dispatch = useDispatch()
    const sidebarOpen = useSelector((state) => state.Page.sidebarOpen);

    return (
        <Container>
            <TouchableOpacity onPress={() => {
                dispatch(handleSidebaropen(!sidebarOpen))
            }}>
                <Icon name="bars" size={20} color="white" />
            </TouchableOpacity>
            <Textcontainer>
                <Primarytext>Patient</Primarytext>
                <Secondarytext>Care</Secondarytext>
            </Textcontainer>
            <TouchableOpacity>
                <Icon name="user" size={20} color="white" />
            </TouchableOpacity>
        </Container>
    )
}

const Container = styled.View({
    height: 40,
    backgroundColor: '#2355a0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 5px'
})

const Textcontainer = styled.View({
    display: 'flex',
    flexDirection: 'row'
})

const Primarytext = styled.Text({
    color: 'white',
    fontWeight: 'bold',
    paddingRight: '2px'
})

const Secondarytext = styled.Text({
    color: '#7eabc5',
    fontWeight: 'bold'
})
