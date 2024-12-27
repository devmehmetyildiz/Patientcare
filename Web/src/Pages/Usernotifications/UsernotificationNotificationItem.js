import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Confirm, Icon } from 'semantic-ui-react'
import { Formatfulldate } from '../../Utils/Formatdate'

const UsernotificationNotificationItem = (props) => {

    const { notification, DeleteUsernotifications, Profile, setOpenView, setRecord } = props

    const [confirmopen, setConfirmopen] = useState(false)

    const t = Profile?.i18n?.t

    const onConfirm = () => {
        DeleteUsernotifications({
            data: notification
        })
        setConfirmopen(false)
    }

    const onCancel = () => {
        setConfirmopen(false)
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 400 }}
                animate={{ x: 0 }}
                exit={{ x: 400 }}
                transition={{ duration: 1 }}
                className='w-full flex justify-center items-center'
            >
                <div className='cursor-pointer w-[300px] flex flex-row items-center justify-between shadow-md h-16  m-4 p-2 rounded-lg shadow-[#DDDD] border-[#DDDD] hover:border-[#2355a0] border-[1px]  transition-all ease-in-out duration-300  border-b-[#2355a0] border-b-4 hover:border-b-4'>
                    <div className='flex flex-row justify-center items-center'
                        onClick={() => {
                            setOpenView(true)
                            setRecord(notification)
                        }}>
                        {notification?.Isreaded
                            ? <Icon name='checkmark' className='text-[#2355a0]' />
                            : <Icon name='attention' className='text-[#2355a0]' />
                        }
                        <div className=' text-left flex flex-col justify-start items-start'>
                            <div className='font-bold'>{notification?.Subject}</div>
                            <div className='text-[#868686dd] text-sm'>{Formatfulldate(notification?.Createtime)}</div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-center items-center'>
                        <div onClick={() => {
                            setConfirmopen(true)
                        }}>
                            <Icon name='delete' className='text-[#2355a0]' />
                        </div>
                    </div>
                </div>
                <Confirm
                    open={confirmopen}
                    content={t('Pages.Usernotifications.Column.DeleteNotificationContent')}
                    header={t('Pages.Usernotifications.Column.DeleteNotificationHeader')}
                    cancelButton={t('Common.Button.Cancel')}
                    confirmButton={t('Common.Button.Delete')}
                    onCancel={() => { onCancel() }}
                    onConfirm={() => { onConfirm() }}
                />
            </motion.div>
        </AnimatePresence>
    )
}

export default UsernotificationNotificationItem