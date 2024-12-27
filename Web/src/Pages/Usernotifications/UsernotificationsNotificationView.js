import React, { useEffect } from 'react'
import { Button, Label, Modal } from 'semantic-ui-react'
import { Formatfulldate } from '../../Utils/Formatdate'
import validator from '../../Utils/Validator'
import { useHistory } from 'react-router-dom'

const UsernotificationsNotificationView = (props) => {

    const { Profile, EditRecordUsernotifications, closeSidebar, GetLastUsernotificationsbyUseridFreezed, GetUsernotificationsFreezed, willFetchFullLayout } = props
    const { open, setOpen, record, setRecord } = props

    const history = useHistory()

    const t = Profile?.i18n?.t
    const notification = record || {}

    const onClose = () => {
        setRecord(null)
        setOpen(false)
    }

    useEffect(() => {
        if (open && notification && EditRecordUsernotifications) {
            if (!notification?.Isreaded) {
                EditRecordUsernotifications({
                    data: [{
                        Uuid: notification?.Uuid,
                        Readtime: new Date(),
                        Isreaded: true
                    }],
                    onSuccess: () => {
                        if (Profile?.meta?.Uuid) {
                            if (willFetchFullLayout) {
                                GetUsernotificationsFreezed({
                                    guid: Profile?.meta?.Uuid
                                })
                            } else {
                                GetLastUsernotificationsbyUseridFreezed({
                                    guid: Profile?.meta?.Uuid
                                })

                            }
                        }
                    },
                    UserID: Profile?.meta?.Uuid,
                    dontShownotification: true
                })
            }
        }
    }, [open, EditRecordUsernotifications, notification, Profile])

    return <React.Fragment>
        <Modal
            onClose={() => onClose()}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Modal.Header>{`${t('Pages.Usernotifications.Page.Header')}`}</Modal.Header>
            <Modal.Content image>
                <Modal.Description>
                    <div className='w-full justify-start items-start flex flex-col gap-6'>
                        <div className='font-bold w-full flex justify-between items-center'>
                            <div>
                                {notification.Subject}
                            </div>
                            <div className='flex flex-col justify-end items-end gap-2'>
                                {notification.Createtime && <Label as='a' className='!bg-[#2355a0] !text-white' image>{`${t('Pages.Usernotifications.UsernotificationsNotificationView.Creattime')} :  `}<Label.Detail>{Formatfulldate(notification.Createtime)}</Label.Detail></Label>}
                                {notification.Showedtime && <Label as='a' className='!bg-[#2355a0] !text-white' image>{`${t('Pages.Usernotifications.UsernotificationsNotificationView.Showtime')} :  `}<Label.Detail>{Formatfulldate(notification.Showedtime)}</Label.Detail></Label>}
                                {notification.Readtime && <Label as='a' className='!bg-[#2355a0] !text-white' image>{`${t('Pages.Usernotifications.UsernotificationsNotificationView.Readtime')} :  `}<Label.Detail>{Formatfulldate(notification.Readtime)}</Label.Detail></Label>}
                            </div>
                        </div>
                        <div>
                            {notification.Message}
                        </div>
                    </div>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    color='black'
                    onClick={() => onClose()}>
                    {t('Common.Button.Giveup')}
                </Button>
                {validator.isString(notification?.Pushurl) && history &&
                    <Button
                        content={t('Common.Button.GoToDetail')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {
                            history && history.push(notification.Pushurl)
                            onClose()
                            closeSidebar()
                        }}
                        positive
                    />
                }
            </Modal.Actions>
        </Modal>

    </React.Fragment>
}

export default UsernotificationsNotificationView