import React, { useEffect, useRef, useState } from 'react'
import { Text, Animated, View, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux';
import Collapsible from 'react-native-collapsible';
import styled from 'styled-components/native'
import MenuDrawer from 'react-native-side-drawer'
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Sidebar() {
    const sidebarOpen = useSelector((state) => state.Page.sidebarOpen);
    const [openedMenu, setOpenedmenu] = useState(-1)

    const Setting = {
        name: "Setting",
        text: "Ayarlar",
        Items: [
            { key: 1, name: "Units", text: "Birimler" },
            { key: 2, name: "Cases", text: "Durumlar" },
        ]
    }

    let Menu = []
    Menu.push(Setting)


    const drawerContent = () => {
        return (
            <Container style={{ height: '100%' }}>
                {Menu.map((menu, index) => {
                    return <View key={index}>
                        <TouchableOpacity onPress={() => { setOpenedmenu(openedMenu === index ? -1 : index) }}>
                            <Menucontainer>
                                <MenuHeaderText>{menu.text}</MenuHeaderText>
                            </Menucontainer>
                        </TouchableOpacity>
                        <Collapsible collapsed={!(openedMenu === index)}>
                            {menu.Items.map(submenu => {
                                return <TouchableOpacity key={`${index}${submenu.key}`}>
                                    <Subcontainer>
                                        <SubHeaderText >{submenu.text}</SubHeaderText>
                                    </Subcontainer>
                                </TouchableOpacity>
                            })}
                        </Collapsible>
                    </View>
                })}
            </Container>
        );
    };


    return (
        <MenuDrawer
            open={sidebarOpen}
            position={'left'}
            drawerContent={drawerContent()}
            drawerPercentage={45}
            animationTime={250}
            overlay={true}
            opacity={0.4}
        />
    )
}

const Container = styled.ScrollView({
    width: '150px',
    backgroundColor: 'white'

})

const Menucontainer = styled.View({
    width: '100%',
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'red'
})

const MenuHeaderText = styled.Text({
    color: 'black',
    fontWeight: 'bold'
})

const Subcontainer = styled.View({
    width: '100%',
    padding: '6px',
    paddingLeft: '25px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'green'
})

const SubHeaderText = styled.Text({
    color: 'black',
    fontWeight: 'bold'
})