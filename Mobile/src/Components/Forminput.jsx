import React from 'react'
import { TextInput } from 'react-native'
import styled from 'styled-components/native'

export default function Forminput(props) {
    const { label, value, onChange } = props
    return (
        <Container>
            {label && <Labelcontainer>
                <Formlabel>
                    {label}
                </Formlabel>
            </Labelcontainer>}
            <Input
                onChangeText={onChange}
                value={value}
            />
        </Container>
    )
}

const Container = styled.View({
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '5px',
    padding: '0px 20px',
})

const Labelcontainer = styled.View({
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
})

const Formlabel = styled.Text({
    color: 'black',
    fontSize: '16px'
})

const Input = styled.TextInput({
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '15px'
})