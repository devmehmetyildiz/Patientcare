import React, { useCallback, useEffect } from 'react'
import { Icon, Loader, Popup } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { NoDataScreen } from '../../Components'
export default function Notifications(props) {
    const { GetUsernotifications, handleViewmodal, handleDeletemodal, handleSelectedUsernotification, Usernotifications, Profile } = props
    const { isViewmodalopen, isLoading, list } = Usernotifications

    useEffect(() => {
        const { meta } = Profile
        if (validator.isUUID(meta?.Uuid)) {
            GetUsernotifications(meta?.Uuid)
        }
    }, [isViewmodalopen])

    const Content = useCallback(() => {
        return <div className='w-96 max-h-[90vh] flex flex-col justify-start items-center'>
            <div className='w-full flex justify-between items-center'>
                <div className='font-bold text-xl'>{Literals.Page.Pageheader[Profile.Language]}</div>
                <div className='cursor-pointer'><Icon name='bars' className='text-gray-500' /></div>
            </div>
            {isLoading
                ? <div className='w-full h-4'><Loader /></div>
                : ((list || []).length > 0
                    ? <div>
                        {(list || []).map(notification => {
                            return notification?.Uuid
                        })}
                    </div>
                    : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} style={{ height: 'auto' }} />
                )
            }
        </div>
    })


    return (
        <Popup
            trigger={
                <div className='cursor-pointer group'>
                    <Icon name='bell' className='text-white group-hover:text-gray-300 transition-all duration-500' />
                </div>
            }
            className='notificationpopup'
            content={Content}
            on='click'
            open={isViewmodalopen}
            onClose={() => { handleViewmodal(false) }}
            onOpen={() => { handleViewmodal(true) }}
            position='bottom right'
        />
    )
}