import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Confirm, Grid, GridColumn, Icon, Label, LabelDetail, Menu, Modal, Sidebar, Transition, TransitionGroup } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { Headerwrapper, LoadingPage, Pagedivider, Pagewrapper } from '../../Components'
import Literals from './Literals'
import { Formatfulldate } from '../../Utils/Formatdate'
import { useHistory } from 'react-router-dom'

export default function Usernotifications(props) {
    const [viewopen, setViewopen] = useState(false)
    const [record, setRecord] = useState(null)
    const history = useHistory()
    const { GetUsernotifications, EditRecordUsernotifications, DeleteUsernotifications, handleOpen, Usernotifications, Profile } = props
    const { open, isLoading, list } = Usernotifications
    const { meta } = Profile


    useEffect(() => {
        if (open && validator.isUUID(meta?.Uuid)) {
            GetUsernotifications(meta?.Uuid)
        }
    }, [meta, open])


    useEffect(() => {
        if (open && !isLoading && (list || []).length > 0 && (list || []).filter(u => !u.Isshowed).slice(0, 1000).length > 0) {
            let data = []
            for (const notification of (list || []).filter(u => !u.Isshowed).slice(0, 1000)) {
                data.push({
                    Uuid: notification?.Uuid,
                    Showedtime: new Date(),
                    Isshowed: true
                })
            }
            EditRecordUsernotifications({
                data: data,
                dontShownotification: true
            })
        }

    }, [open, isLoading, list])


    return (
        <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            vertical
            direction='right'
            visible={open}
            width='wide'
        >
            {isLoading ? <LoadingPage />
                : <Pagewrapper>
                    <Headerwrapper>
                        <Grid columns='2' className='relative' >
                            <GridColumn width={8}>
                                <Breadcrumb size='big'>
                                    <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                                </Breadcrumb>
                            </GridColumn>
                            <GridColumn width={8}>
                                <div
                                    className='absolute right-1 cursor-pointer'
                                    onClick={() => {
                                        handleOpen(false)
                                    }}>
                                    <Icon size='small' name='sign-out' className='text-[#2355a0]' />
                                </div>
                            </GridColumn>
                        </Grid>
                    </Headerwrapper>
                    <Pagedivider />
                    <TransitionGroup animation='slide right' duration={500}>
                        {(list || []).map((notification, index) => {
                            return <Notification
                                notification={notification}
                                key={index}
                                setOpen={setViewopen}
                                setRecord={setRecord}
                                DeleteUsernotifications={DeleteUsernotifications}
                            />
                        })}
                    </TransitionGroup>
                    <Viewnotification
                        open={viewopen}
                        setOpen={setViewopen}
                        handleSidebaropen={handleOpen}
                        setRecord={setRecord}
                        notification={record}
                        Profile={Profile}
                        history={history}
                        EditRecordUsernotifications={EditRecordUsernotifications}
                    />
                </Pagewrapper>
            }
        </Sidebar>
    )
}




function Notification({ notification, setOpen, setRecord, DeleteUsernotifications }) {

    const [confirmopen, setConfirmopen] = useState(false)

    const onConfirm = () => {
        DeleteUsernotifications(notification)
        setRecord(null)
        setConfirmopen(false)
    }

    const onCancel = () => {
        setRecord(null)
        setConfirmopen(false)
    }

    return (
        <Transition visible={notification ? true : false} animation='slide right' duration={500} >
            <div className='w-full flex justify-center items-center '  >
                <div className='cursor-pointer w-[300px] flex flex-row items-center justify-between shadow-md h-16  m-4 p-2 rounded-lg shadow-[#DDDD] border-[#DDDD] hover:border-[#2355a0] border-[1px]  transition-all ease-in-out duration-300  border-b-[#2355a0] border-b-4 hover:border-b-4'>
                    <div className='flex flex-row justify-center items-center'
                        onClick={() => {
                            setRecord(notification)
                            setOpen(true)
                        }}>
                        {notification.Isreaded
                            ? <Icon name='checkmark' className='text-[#2355a0]' />
                            : <Icon name='attention' className='text-[#2355a0]' />
                        }
                        <div className=' flex flex-col justify-start items-start'>
                            <div className='font-bold'>{notification?.Subject}</div>
                            <div className='text-[#868686dd] text-sm'>{Formatfulldate(notification?.Createtime)}</div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-center items-center'>
                        <div onClick={() => {
                            setRecord(notification)
                            setConfirmopen(true)
                        }}>
                            <Icon name='delete' className='text-[#2355a0]' />
                        </div>
                    </div>
                </div>
                <Confirm
                    open={confirmopen}
                    content="Bildirimi silmek istediğinize eminmisiniz?"
                    header="Bildirimi silme"
                    cancelButton="Vazgeç"
                    confirmButton="Sil"
                    onCancel={() => { onCancel() }}
                    onConfirm={() => { onConfirm() }}
                />
            </div>
        </Transition>
    )
}



function Viewnotification({ open, notification, setOpen, Profile, history, setRecord, handleSidebaropen, EditRecordUsernotifications }) {

    useEffect(() => {
        if (open && notification && !notification?.Isreaded && Object.keys(notification).length > 0) {
            EditRecordUsernotifications({
                data: [{
                    Uuid: notification?.Uuid,
                    Readtime: new Date(),
                    Isreaded: true
                }],
                UserID: Profile?.meta?.user?.Uuid,
                dontShownotification: true
            })
        }
    }, [open, EditRecordUsernotifications, notification])

    return (notification && Object.keys(notification).length > 0 &&
        <Modal
            onClose={() => {
                setOpen(false)
                setRecord(null)
            }}
            onOpen={() => {
                setOpen(true)

            }}
            open={open}
        >
            <Modal.Header>{Literals.Page.Pageheader[Profile.Language]}</Modal.Header>
            <Modal.Content image>
                <Modal.Description>
                    <div className='w-full justify-start items-start flex flex-col gap-6'>
                        <div className='font-bold w-full flex justify-between items-center'>
                            <div>
                                {notification.Subject}
                            </div>
                            <div className='flex flex-col justify-end items-end gap-2'>
                                {notification.Createtime && <Label as='a' className='!bg-[#2355a0] !text-white' image>  Oluşturma Tarihi :  <Label.Detail>{Formatfulldate(notification.Createtime)}</Label.Detail></Label>}
                                {notification.Showedtime && <Label as='a' className='!bg-[#2355a0] !text-white' image>  Görülme Tarihi :  <Label.Detail>{Formatfulldate(notification.Showedtime)}</Label.Detail></Label>}
                                {notification.Readtime && <Label as='a' className='!bg-[#2355a0] !text-white' image>  Okunma Tarihi :  <Label.Detail>{Formatfulldate(notification.Readtime)}</Label.Detail></Label>}
                            </div>
                        </div>
                        <div>
                            {notification.Message}
                        </div>
                    </div>
                </Modal.Description>
            </Modal.Content>
            {validator.isString(notification?.Pushurl) && history &&
                <Modal.Actions>
                    <Button color='black'
                        onClick={() => {
                            setOpen(false)
                            setRecord(null)
                        }}>
                        {Literals.Button.Giveup[Profile.Language]}
                    </Button>
                    <Button
                        content={Literals.Button.Go[Profile.Language]}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            history && history.push(notification.Pushurl)
                            setOpen(false)
                            handleSidebaropen(false)
                            setRecord(null)
                        }}
                        positive
                    />
                </Modal.Actions>
            }
        </Modal>
    )
}
