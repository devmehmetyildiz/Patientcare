import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { useCasesQuery } from '../../Redux/Setting/Cases'
import Pageheader from '../../Components/Pageheader'
import Toast from 'react-native-toast-message'
import styled from 'styled-components/native'
import Handleerror from '../../Utils/Error'
import { NavigationProvider } from '../../Provider/NavigationProvider'


export default function Cases() {

    const pageName = "Durumlar"

    const { data, isError, error, isLoading, isFetching, isSuccess } = useCasesQuery()
    useEffect(() => {
        /*  Toast.show({
            type: 'success',
            text1: 'Hello',
            text2: 'This is some something 👋',
            autoHide: true,
            visibilityTime: 3000
        }); */
        // NavigationProvider.GoTo('')
        if (isError) {
            Handleerror(error, NavigationProvider)
            console.log(error)
        }
    }, [isError])

    return (
        <Pageheader pageName={pageName}>
            {isSuccess &&
                (data || []).map(item => {
                    return <Text>{item?.Name}</Text>
                })
            }
        </Pageheader>
    )
}