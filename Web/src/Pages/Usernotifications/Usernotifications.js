import React, { useEffect, useState } from 'react'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import { Breadcrumb, Button, Confirm, Grid, GridColumn, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { COL_PROPS } from '../../Utils/Constants'
import validator from '../../Utils/Validator'
import { Formatfulldate } from '../../Utils/Formatdate'
import UsernotificationsNotificationView from '../../Containers/Usernotifications/UsernotificationsNotificationView'

const Usernotifications = (props) => {

    const { Usernotifications, Profile, GetUsernotifications, DeleteUsernotifications, DeleteByUserID, DeleteReadByUserID } = props

    const t = Profile?.i18n?.t
    const meta = Profile?.meta
    
    const [record, setRecord] = useState(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteAllOpen, setDeleteAllOpen] = useState(false)
    const [deleteReadOpen, setDeleteReadOpen] = useState(false)

    const dateCellhandler = (value) => {
        if (value) {
            return Formatfulldate(value, true)
        }
        return value
    }

    const Columns = [
        { Header: t('Common.Column.Id'), accessor: 'Id' },
        { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
        { Header: t('Pages.Usernotifications.Column.Notificationtime'), accessor: row => dateCellhandler(row?.Notificationtime), },
        { Header: t('Pages.Usernotifications.Column.Subject'), accessor: 'Subject', },
        { Header: t('Pages.Usernotifications.Column.Message'), accessor: 'Message', },
        { Header: t('Pages.Usernotifications.Column.Showedtime'), accessor: row => dateCellhandler(row?.Showedtime), },
        { Header: t('Pages.Usernotifications.Column.Readtime'), accessor: row => dateCellhandler(row?.Readtime), },
        { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
        { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
        { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
        { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
        { Header: t('Common.Column.view'), accessor: 'view', disableProps: true },
        { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

    const metaKey = "usernotification"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Usernotifications.list || []).filter(u => u.Isactive).map(item => {
        return {
            ...item,
            view: <Icon link size='large' color='blue' name='sticky note' onClick={() => {
                setRecord(item)
                setViewOpen(true)
            }} />,
            delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                setRecord(item)
                setDeleteOpen(true)
            }} />
        }
    })

    useEffect(() => {
        if (validator.isUUID(Profile?.meta?.Uuid)) {
            GetUsernotifications({
                guid: Profile?.meta?.Uuid
            })
        }
    }, [])

    const buttons = [
        <Button onClick={() => setDeleteAllOpen(true)} className='!bg-[#2355a0] !text-white' floated='right'  >{t('Pages.Usernotifications.Column.DeleteAllNotification')}</Button>,
        <Button onClick={() => setDeleteReadOpen(true)} className='!bg-[#2355a0] !text-white' floated='right'  >{t('Pages.Usernotifications.Column.DeleteReadedNotification')}</Button>
    ]

    return (Usernotifications.isLoading ? <LoadingPage />
        : <React.Fragment>
            <Pagewrapper>
                <Headerwrapper>
                    <Grid columns='2' >
                        <GridColumn width={8}>
                            <Breadcrumb size='big'>
                                <Link to={"/Usernotifications"}>
                                    <Breadcrumb.Section>{t('Pages.Usernotifications.Page.Header')}</Breadcrumb.Section>
                                </Link>
                            </Breadcrumb>
                        </GridColumn>
                        <Settings
                            Profile={Profile}
                            ExtendedButtons={buttons}
                        />
                    </Grid>
                </Headerwrapper>
                <Pagedivider />
                {list.length > 0 ?
                    <div className='w-full mx-auto '>
                        {Profile.Ismobile ?
                            <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                            <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
                    </div> : <NoDataScreen message={t('Common.NoDataFound')} />
                }
            </Pagewrapper>
            <UsernotificationsNotificationView
                willFetchFullLayout
                open={viewOpen}
                setOpen={setViewOpen}
                record={record}
                setRecord={setRecord}
            />
            <Confirm
                open={deleteOpen}
                content={t('Pages.Usernotifications.Column.DeleteNotificationContent')}
                header={t('Pages.Usernotifications.Column.DeleteNotificationHeader')}
                cancelButton={t('Common.Button.Cancel')}
                confirmButton={t('Common.Button.Delete')}
                onCancel={() => { setConfirmopen(false) }}
                onConfirm={() => {
                    DeleteUsernotifications({
                        data: record,
                    })
                    setDeleteOpen(false)
                }}
            />
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
                                    GetUsernotifications({
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
                                    GetUsernotifications({
                                        guid: meta?.Uuid
                                    })
                                }
                                setDeleteReadOpen(false)
                            }
                        })
                    }
                }}
            />
        </React.Fragment>
    )
}

export default Usernotifications