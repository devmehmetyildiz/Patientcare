import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { useCasesQuery } from '../../Redux/Setting/Cases'
import Pageheader from '../../Components/Pageheader'
import Toast from 'react-native-toast-message'
import styled from 'styled-components/native'

export default function Cases() {

    const { data, error } = useCasesQuery()

    useEffect(() => {
        Toast.show({
            type: 'success',
            text1: 'Hello',
            text2: 'This is some something 👋',
            autoHide: true,
            visibilityTime: 3000
        });
    }, [])

    return (
        <Pageheader>
                <Text>Case</Text>
        </Pageheader>
    )
}