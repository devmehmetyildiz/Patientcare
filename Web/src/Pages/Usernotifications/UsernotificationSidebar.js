import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Confirm, Dropdown, Grid, GridColumn, Icon, Menu, Sidebar } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { Headerwrapper, LoadingPage, Pagedivider, Pagewrapper } from '../../Components'
import UsernotificationNotificationItem from '../../Containers/Usernotifications/UsernotificationNotificationItem'
import UsernotificationsNotificationView from '../../Containers/Usernotifications/UsernotificationsNotificationView'
import { useHistory } from 'react-router-dom'

export default function UsernotificationSidebar(props) {

    const { GetLastUsernotificationsbyUserid, GetLastUsernotificationsbyUseridFreezed, closeSidebar, Usernotifications, Profile, DeleteByUserID, DeleteReadByUserID, ShowAllNotificationByUser } = props

    const { open, isModalListLoading, modalList } = Usernotifications

    const history = useHistory()
    const [openView, setOpenView] = useState(false)
    const [record, setRecord] = useState(null)
    const [deleteAllOpen, setDeleteAllOpen] = useState(false)
    const [deleteReadOpen, setDeleteReadOpen] = useState(false)

    const meta = Profile?.meta
    const t = Profile?.i18n?.t

    useEffect(() => {
        if (open && validator.isUUID(meta?.Uuid)) {
            GetLastUsernotificationsbyUserid({
                guid: meta?.Uuid
            })
        }
    }, [meta, open])


    useEffect(() => {
        if (open && (modalList || []).filter(u => !u.Isshowed && u.Isactive).length > 0 && !isModalListLoading && validator.isUUID(meta?.Uuid)) {
            ShowAllNotificationByUser({
                guid: meta?.Uuid
            })
        }
    }, [isModalListLoading, modalList, open, meta, ShowAllNotificationByUser])

    return (
        <Sidebar
            className='notificationContainer'
            as={Menu}
            animation={'overlay'}
            icon='labeled'
            vertical
            direction='right'
            visible={open}
            width='wide'
        >
            {isModalListLoading ? <LoadingPage />
                : <Pagewrapper additionalStyle={'overflow-y-hidden'}>
                    <Headerwrapper>
                        <Grid columns='1' className='relative' >
                            <GridColumn>
                                <div
                                    className='absolute left-3 cursor-pointer'
                                    onClick={() => {
                                        closeSidebar()
                                    }}>
                                    <Icon size='small' name='sign-out' className='text-[#2355a0]' />
                                </div>
                                <div className='w-full flex justify-center items-center'>
                                    <Breadcrumb size='big'>
                                        <Breadcrumb.Section>{t('Pages.Usernotifications.Page.Header')}</Breadcrumb.Section>
                                    </Breadcrumb>
                                </div>
                            </GridColumn>
                        </Grid>
                    </Headerwrapper>
                    <Pagedivider />
                    <div className='w-full max-h-[calc(90vh-60px-100px)]  pr-4 overflow-y-hidden'>
                        <div className='max-h-[calc(90vh-60px-100px)] overflow-y-auto overflow-x-hidden '>
                            {(modalList || []).map((notification, index) => {
                                return <UsernotificationNotificationItem
                                    key={index}
                                    notification={notification}
                                    setRecord={setRecord}
                                    setOpenView={setOpenView}
                                />
                            })}
                        </div>
                    </div>
                    <Pagedivider />
                    <div className='w-full flex flex-row justify-center items-center gap-2'>
                        <Dropdown
                            text={t('Pages.Usernotifications.Column.Process')}
                            icon='filter'
                            floating
                            labeled
                            button
                            className='icon !bg-[#2355a0] !text-white'
                        >
                            <Dropdown.Menu>
                                <Dropdown.Header icon='tags' content={t('Pages.Usernotifications.Column.Processdetail')} />
                                <Dropdown.Item onClick={() => setDeleteAllOpen(true)}>
                                    {t('Pages.Usernotifications.Column.DeleteAllNotification')}
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setDeleteReadOpen(true)}>
                                    {t('Pages.Usernotifications.Column.DeleteReadedNotification')}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Button
                            onClick={() => {
                                history.push('/Usernotifications')
                                closeSidebar()
                            }}
                            className='!bg-[#2355a0] !text-white whitespace-nowrap'
                            content={t('Pages.Usernotifications.Column.AllNotification')}
                        />
                    </div>
                </Pagewrapper>
            }
            <Confirm
                open={deleteAllOpen}
                content={t('Pages.Usernotifications.UsernotificationsNotificationView.DeleteAllContent')}
                header={t('Pages.Usernotifications.UsernotificationsNotificationView.DeleteHeader')}
                cancelButton={t('Common.Button.Cancel')}
                confirmButton={t('Common.Button.Delete')}
                onCancel={() => { setDeleteAllOpen(false) }}
                onConfirm={() => {
                    if (validator.isUUID(meta?.Uuid)) {
                        DeleteByUserID({
                            data: meta?.Uuid,
                            onSuccess: () => {
                                if (validator.isUUID(meta?.Uuid)) {
                                    GetLastUsernotificationsbyUseridFreezed({
                                        guid: meta?.Uuid
                                    })
                                }
                                setDeleteAllOpen(false)
                            }
                        })
                    }
                }}
            />
            <Confirm
                open={deleteReadOpen}
                content={t('Pages.Usernotifications.UsernotificationsNotificationView.DeleteReadedContent')}
                header={t('Pages.Usernotifications.UsernotificationsNotificationView.DeleteHeader')}
                cancelButton={t('Common.Button.Cancel')}
                confirmButton={t('Common.Button.Delete')}
                onCancel={() => { setDeleteReadOpen(false) }}
                onConfirm={() => {
                    if (validator.isUUID(meta?.Uuid)) {
                        DeleteReadByUserID({
                            data: meta?.Uuid,
                            onSuccess: () => {
                                if (validator.isUUID(meta?.Uuid)) {
                                    GetLastUsernotificationsbyUseridFreezed({
                                        guid: meta?.Uuid
                                    })
                                }
                                setDeleteReadOpen(false)
                            }
                        })
                    }
                }}
            />
            <UsernotificationsNotificationView
                record={record}
                setRecord={setRecord}
                open={openView}
                setOpen={setOpenView}
            />
        </Sidebar>
    )
}