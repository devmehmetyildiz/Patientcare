import React, { FC, ReactElement } from 'react'
import { Text } from 'react-native'
import { styled } from 'styled-components/native'


const Notification: FC<{ notification: notificationProps, remove: any }> = (): ReactElement => {

    return (<Wrapper>
        <Text>
            Ahmet
        </Text >
    </Wrapper>)
}

export default Notification

const Wrapper = styled.View({
    position: 'absolute',
    top: '5px',
    right: '10px',
    width: '50%',
    height: '10%',
    backgroundColor: 'red'
})

class notificationProps {
    code: string;
    type: string;
    description: string;
}

class notificationStates {
    notification: notificationProps;
    timer: number;
    isShowing: Boolean;
}