import React from 'react'
import Navbar from './Navbar'
import styled from 'styled-components/native'
import Sidebar from './Sidebar'
import LinearGradient from 'react-native-linear-gradient';

export default function Pageheader({ children }) {
    return (
        <Container>
            <LinearGradient
                colors={['rgba(255,255,255,1)', 'rgba(195,195,195,1)', 'rgba(35,85,160,1)']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Navbar />
                <Lowercontainer>
                    <Sidebar />
                    <Childcontainer>
                        {children}
                    </Childcontainer>
                </Lowercontainer>
            </LinearGradient>
        </Container>
    )
}

const Container = styled.View({
    flex: 1,
})

const Lowercontainer = styled.View({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%'
})

const Childcontainer = styled.View({
    width: '100%'
})