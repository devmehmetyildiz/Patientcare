import React, { useEffect } from 'react'
import { Label, Menu, Sidebar } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { LoadingPage } from '../../Components'

export default function Usernotifications(props) {
    const { GetUsernotifications, handleOpen, Usernotifications, Profile } = props
    const { open, isLoading } = Usernotifications
    const { meta } = Profile

    useEffect(() => {
        if (open && validator.isUUID(meta?.Uuid)) {
            GetUsernotifications(meta?.Uuid)
        }
    }, [meta, open])


    return (
        <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            onHide={() => handleOpen(false)}
            vertical
            direction='right'
            visible={open}
            width='wide'
        >
            {isLoading ? <LoadingPage />
                : <div className='w-full'>
                    <Label>
                        hello
                    </Label>
                </div>}
        </Sidebar>
    )
}
