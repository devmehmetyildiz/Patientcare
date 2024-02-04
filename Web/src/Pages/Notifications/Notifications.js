import React, { useCallback, useEffect, useState } from 'react'
import { Button, Icon, Loader, Modal, Popup, Transition } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { NoDataScreen } from '../../Components'
import { useHistory } from 'react-router-dom'

export default function Notifications(props) {
    const { GetUsernotifications, handleViewmodal, EditUsernotifications, DeleteUsernotificationbyid, DeleteUsernotificationbyidreaded,
        EditRecordUsernotifications, DeleteUsernotifications, Usernotifications, Profile } = props
    const { isViewmodalopen, isLoading } = Usernotifications
    const list = (Usernotifications.list || []).filter(u => u.Isactive).reverse()
    const history = useHistory()
    const [detailModal, setdetailModal] = useState(false)
    const [deleteModal, setdeleteModal] = useState(false)
    const [deleteAllModal, setdeleteAllModal] = useState(false)
    const [deleteReadModal, setdeleteReadModal] = useState(false)
    const [open, setOpen] = useState(false)
    const [selectedNotification, setselectedNotification] = useState({})


    useEffect(() => {
        if (isViewmodalopen && (list || []).length > 0 && !isLoading) {
            const unshowednotifications = (list || []).filter(u => !u.Isshowed)
            if (unshowednotifications.length > 0) {
                let data = []
                for (const notification of unshowednotifications.slice(0, 1000)) {
                    data.push({
                        Uuid: notification?.Uuid,
                        Isshowed: true
                    })
                }
                EditRecordUsernotifications({
                    data: data,
                    dontShownotification: true
                })
            }
        }
    }, [isViewmodalopen])

    useEffect(() => {
        const notificationRefreshinterval = 1000 * 60
        setInterval(() => {
            const { meta } = Profile
            if (validator.isUUID(meta?.Uuid)) {
                GetUsernotifications(meta?.Uuid)
            }
        }, notificationRefreshinterval);
    }, [])

    useEffect(() => {
        const { meta } = Profile
        if (validator.isUUID(meta?.Uuid)) {
            GetUsernotifications(meta?.Uuid)
        }
    }, [isViewmodalopen])

    const Content = useCallback(() => {
        return <div className='w-[26rem] h-[90vh] flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden'>
            <div className='w-full flex justify-between items-center'>
                <div className='font-bold text-xl'>{Literals.Page.Pageheader[Profile.Language]}</div>
                <div onClick={() => { setOpen(!open) }} className='cursor-pointer'><Icon name={open ? 'arrow up' : 'arrow down'} className='text-gray-500' /></div>
            </div>
            <Transition visible={open} animation='fade down' duration={500}>
                <div className='mt-2 mb-2 flex flex-col justify-start items-center gap-4 w-full'>
                    <div
                        className='mt-2 cursor-pointer w-full py-1 px-2 rounded-lg bg-blue-300 hover:bg-blue-400 transition-all duration-500'
                        onClick={() => {
                            setdeleteAllModal(true)
                        }}>Tümünü Sil</div>
                    <div
                        className='mt-2 cursor-pointer w-full py-1 px-2 rounded-lg bg-blue-300 hover:bg-blue-400 transition-all duration-500'
                        onClick={() => {
                            setdeleteReadModal(true)
                        }}>Sadece Okunanları Sil</div>
                </div>
            </Transition>
            {isLoading
                ? <div className='w-full h-4'><Loader /></div>
                : ((list || []).length > 0
                    ? <div className='w-full flex flex-col justify-center items-center '>
                        {(list || []).map(notification => {
                            return <div key={Math.random()} className='w-full flex justify-between items-center flex-row'>
                                <div
                                    className='w-full justify-center items-center flex flex-col py-4 px-2 
                                        hover:bg-gray-300  cursor-pointer  transition-all ease-in-out duration-400 rounded-md'
                                    onClick={() => {
                                        EditUsernotifications({
                                            data: {
                                                Uuid: notification?.Uuid,
                                                Isreaded: true
                                            },
                                            dontShownotification: true
                                        })
                                        setselectedNotification(notification)
                                        setdetailModal(true)
                                    }}
                                >
                                    <div className=' w-full flex flex-row justify-start items-center '>
                                        <div><Icon name='attention' className='text-gray-600' /></div>
                                        <div className='font-bold whitespace-nowrap'>
                                            {notification?.Subject}
                                        </div>
                                        <div className='ml-4 overflow-hidden max-w-[180px] whitespace-nowrap text-ellipsis'>
                                            {notification?.Message}
                                        </div>
                                    </div>
                                    <div className='pl-4 w-full justify-start items-center'>
                                        {notification.Isreaded ? <div className='font-bold text-blue-500'>Okundu</div> : <div className='font-bold'>Okunmadı</div>}
                                    </div>
                                </div>
                                <div
                                    className='w-[10px] pr-6 group cursor-pointer'
                                    onClick={() => {
                                        setselectedNotification(notification)
                                        setdeleteModal(true)
                                    }}
                                >
                                    <Icon name='alternate trash' className='text-red-900 group-hover:text-red-500 transition-all ease-in-out duration-500' />
                                </div>
                            </div>
                        })}
                    </div>
                    : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} style={{ height: 'auto' }} />
                )
            }
        </div >
    })


    const unshowednotifications = (list || []).filter(u => !u.Isshowed)
    return (
        <React.Fragment>
            <Popup
                hideOnScroll={false}
                trigger={
                    <div className='cursor-pointer group relative'>
                        {unshowednotifications?.length > 0
                            ? <div className='-left-1 -top-4 absolute  rounded-full'>
                                <p className='  text-black font-extrabold  text-lg'>{unshowednotifications?.length}</p>
                            </div>
                            : null}
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
            <Modal
                onClose={() => setdetailModal(false)}
                onOpen={() => setdetailModal(true)}
                open={detailModal}
            >
                <Modal.Header>{selectedNotification?.Subject}</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <div>
                            {selectedNotification?.Message}
                        </div>
                        {validator.isString(selectedNotification?.Pushurl)
                            ? <div className='mt-4 w-full flex justify-end items-center'>
                                <Button color='green' onClick={() => {
                                    history.push(selectedNotification?.Pushurl)
                                    setdetailModal(false)
                                }}>
                                    {Literals.Button.Go[Profile.Language]}
                                </Button>
                            </div>
                            : null}
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        setdetailModal(false)
                        setselectedNotification({})
                    }}>
                        {Literals.Button.Close[Profile.Language]}
                    </Button>
                </Modal.Actions>
            </Modal>
            <Modal
                onClose={() => setdeleteModal(false)}
                onOpen={() => setdeleteModal(true)}
                open={deleteModal}
            >
                <Modal.Header>{selectedNotification?.Subject}</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <p>
                            {Literals.Messages.Deletecheck[Profile.Language]}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        setdeleteModal(false)
                        setselectedNotification({})
                    }}>
                        {Literals.Button.Close[Profile.Language]}
                    </Button>
                    <Button
                        content={Literals.Button.Delete[Profile.Language]}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            DeleteUsernotifications(selectedNotification)
                            setdeleteModal(false)
                            setselectedNotification({})
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
            <Modal
                onClose={() => setdeleteAllModal(false)}
                onOpen={() => setdeleteAllModal(true)}
                open={deleteAllModal}
            >
                <Modal.Header> {Literals.Page.Pagedeleteallheader[Profile.Language]}</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <p>
                            {Literals.Messages.Deleteallcheck[Profile.Language]}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        setdeleteAllModal(false)
                    }}>
                        {Literals.Button.Close[Profile.Language]}
                    </Button>
                    <Button
                        content={Literals.Button.Delete[Profile.Language]}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            const { meta } = Profile
                            if (validator.isUUID(meta?.Uuid)) {
                                DeleteUsernotificationbyid(meta?.Uuid)
                                setdeleteAllModal(false)
                            }
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
            <Modal
                onClose={() => setdeleteReadModal(false)}
                onOpen={() => setdeleteReadModal(true)}
                open={deleteReadModal}
            >
                <Modal.Header> {Literals.Page.PagedeleteReadedheader[Profile.Language]}</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <p>
                            {Literals.Messages.Deletereadcheck[Profile.Language]}
                        </p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        setdeleteReadModal(false)
                    }}>
                        {Literals.Button.Close[Profile.Language]}
                    </Button>
                    <Button
                        content={Literals.Button.Delete[Profile.Language]}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            const { meta } = Profile
                            if (validator.isUUID(meta?.Uuid)) {
                                DeleteUsernotificationbyidreaded(meta?.Uuid)
                                setdeleteReadModal(false)
                            }
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
}