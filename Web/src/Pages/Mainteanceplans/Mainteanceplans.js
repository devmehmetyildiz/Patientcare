import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon, Loader, Tab } from 'semantic-ui-react'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { Contentwrapper, DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import { Formatfulldate } from '../../Utils/Formatdate'
import { COL_PROPS } from '../../Utils/Constants'
import MainteanceplansApprove from '../../Containers/Mainteanceplans/MainteanceplansApprove'
import MainteanceplansComplete from '../../Containers/Mainteanceplans/MainteanceplansComplete'
import MainteanceplansSavepreview from '../../Containers/Mainteanceplans/MainteanceplansSavepreview'
import MainteanceplansWork from '../../Containers/Mainteanceplans/MainteanceplansWork'
import MainteanceplansStop from '../../Containers/Mainteanceplans/MainteanceplansStop'
import MainteanceplansDelete from '../../Containers/Mainteanceplans/MainteanceplansDelete'

export default function Mainteanceplans(props) {

    const { GetMainteanceplans, GetEquipments, GetEquipmentgroups, GetUsers, Users, Mainteanceplans, Equipments, Equipmentgroups, Profile } = props

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [savepreviewOpen, setSavepreviewOpen] = useState(false)
    const [approveOpen, setApproveOpen] = useState(false)
    const [completeOpen, setCompleteOpen] = useState(false)
    const [workOpen, setWorkOpen] = useState(false)
    const [stopOpen, setStopOpen] = useState(false)
    const [record, setRecord] = useState(null)

    const statusCellhandler = (value) => {
        return <Icon style={{ color: value === 1 ? 'green' : 'red' }} className="ml-2" name='circle' />
    }

    const equipmentCellhandler = (value) => {
        if (Equipmentgroups.isLoading || Equipments.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const equipment = (Equipments?.list || []).find(u => u.Uuid === value)
            const equipmentgroup = (Equipmentgroups?.list || []).find(u => u.Uuid === equipment?.EquipmentgroupID)
            return `${equipment?.Name} - ${equipmentgroup?.Name}`
        }
    }

    const userCellhandler = (value) => {
        if (Users.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const user = (Users?.list || []).find(u => u.Uuid === value)
            return `${user?.Name} ${user?.Surname}`
        }
    }

    const dateCellhandler = (value) => {
        if (value) {
            return Formatfulldate(value, true)
        }
        return value
    }

    const renderView = ({ list, Columns, keys, initialConfig }) => {

        const searchbykey = (data, searchkeys) => {
            let ok = false
            searchkeys.forEach(key => {

                if (!ok) {
                    if (data.includes(key)) {
                        ok = true
                    }
                }
            });

            return ok
        }

        const columns = Columns.filter(u => searchbykey((u?.keys || []), keys) || !(u?.keys))

        return list.length > 0 ?
            <div className='w-full mx-auto '>
                {Profile.Ismobile ?
                    <MobileTable Columns={columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                    <DataTable Columns={columns} Data={list} Config={initialConfig} />}
            </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
    }

    const t = Profile?.i18n?.t

    const isLoading = Equipments.isLoading || Equipmentgroups.isLoading || Mainteanceplans.isLoading

    const Columns = [
        { Header: t('Common.Column.Id'), accessor: 'Id' },
        { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
        { Header: t('Pages.Mainteanceplans.Column.Status'), accessor: row => statusCellhandler(row?.Isworking), disableProps: true, keys: ['completed'] },
        { Header: t('Pages.Mainteanceplans.Column.User'), accessor: row => userCellhandler(row?.UserID) },
        { Header: t('Pages.Mainteanceplans.Column.Equipment'), accessor: row => equipmentCellhandler(row?.EquipmentID) },
        { Header: t('Pages.Mainteanceplans.Column.Startdate'), accessor: row => dateCellhandler(row?.Startdate) },
        { Header: t('Pages.Mainteanceplans.Column.Dayperiod'), accessor: 'Dayperiod' },
        { Header: t('Pages.Mainteanceplans.Column.Info'), accessor: 'Info' },
        { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
        { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
        { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
        { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
        { Header: t('Common.Column.work'), accessor: 'work', disableProps: true, keys: ['completed'] },
        { Header: t('Common.Column.stop'), accessor: 'stop', disableProps: true, keys: ['completed'] },
        { Header: t('Common.Column.savepreview'), accessor: 'savepreview', disableProps: true, keys: ['onpreview'] },
        { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true, keys: ['waitingapprove'] },
        { Header: t('Common.Column.complete'), accessor: 'complete', disableProps: true, keys: ['approved'] },
        { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, keys: ['onpreview'] },
        { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, keys: ['onpreview', 'waitingapprove'] }
    ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

    const metaKey = "mainteanceplan"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Mainteanceplans.list || []).filter(u => u.Isactive).map(item => {
        return {
            ...item,
            edit: <Link to={`/Mainteanceplans/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
            delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                setRecord(item)
                setDeleteOpen(true)
            }} />,
            approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                setRecord(item)
                setApproveOpen(true)
            }} />,
            complete: <Icon link size='large' color='blue' name='hand point left' onClick={() => {
                setRecord(item)
                setCompleteOpen(true)
            }} />,
            savepreview: <Icon link size='large' color='green' name='save' onClick={() => {
                setRecord(item)
                setSavepreviewOpen(true)
            }} />,
            work: item.Isworking ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='blue' name='share' onClick={() => {
                setRecord(item)
                setWorkOpen(true)
            }} />,
            stop: !item.Isworking ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand paper' onClick={() => {
                setRecord(item)
                setStopOpen(true)
            }} />,
        }
    })

    const completedList = list.filter(u => u.Iscompleted && u.Isapproved && !u.Isonpreview)
    const approvedList = list.filter(u => !u.Iscompleted && u.Isapproved && !u.Isonpreview)
    const waitingapproveList = list.filter(u => !u.Iscompleted && !u.Isapproved && !u.Isonpreview)
    const onpreviewList = list.filter(u => !u.Iscompleted && !u.Isapproved && u.Isonpreview)

    useEffect(() => {
        GetMainteanceplans()
        GetEquipmentgroups()
        GetEquipments()
        GetUsers()
    }, [])

    return (
        isLoading ? <LoadingPage /> :
            <Pagewrapper>
                <Headerwrapper>
                    <Grid columns='2' >
                        <GridColumn width={8}>
                            <Breadcrumb size='big'>
                                <Link to={"/Mainteanceplans"}>
                                    <Breadcrumb.Section>{t('Pages.Mainteanceplans.Page.Header')}</Breadcrumb.Section>
                                </Link>
                            </Breadcrumb>
                        </GridColumn>
                        <Settings
                            Profile={Profile}
                            Pagecreateheader={t('Pages.Mainteanceplans.Page.CreateHeader')}
                            Pagecreatelink={"/Mainteanceplans/Create"}
                            Columns={Columns}
                            list={list}
                            initialConfig={initialConfig}
                            metaKey={metaKey}
                            Showcreatebutton
                            Showcolumnchooser
                            Showexcelexport
                        />
                    </Grid>
                </Headerwrapper>
                <Pagedivider />
                <Contentwrapper>
                    <Tab
                        className="w-full !bg-transparent"
                        panes={[
                            {
                                menuItem: `${t('Pages.Mainteanceplans.Tab.Completed')} (${(completedList || []).length})`,
                                pane: {
                                    key: 'completed',
                                    content: renderView({ list: completedList, Columns, keys: ['completed'], initialConfig })
                                }
                            },
                            {
                                menuItem: `${t('Pages.Mainteanceplans.Tab.Approved')} (${(approvedList || []).length})`,
                                pane: {
                                    key: 'approved',
                                    content: renderView({ list: approvedList, Columns, keys: ['approved'], initialConfig })
                                }
                            },
                            {
                                menuItem: `${t('Pages.Mainteanceplans.Tab.Waitingapprove')} (${(waitingapproveList || []).length})`,
                                pane: {
                                    key: 'waitingapprove',
                                    content: renderView({ list: waitingapproveList, Columns, keys: ['waitingapprove'], initialConfig })
                                }
                            },
                            {
                                menuItem: `${t('Pages.Mainteanceplans.Tab.Onpreview')} (${(onpreviewList || []).length})`,
                                pane: {
                                    key: 'onpreview',
                                    content: renderView({ list: onpreviewList, Columns, keys: ['onpreview'], initialConfig })
                                }
                            },


                        ]}
                        renderActiveOnly={false}
                    />
                </Contentwrapper>
                <MainteanceplansDelete
                    open={deleteOpen}
                    setOpen={setDeleteOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <MainteanceplansApprove
                    open={approveOpen}
                    setOpen={setApproveOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <MainteanceplansComplete
                    open={completeOpen}
                    setOpen={setCompleteOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <MainteanceplansSavepreview
                    open={savepreviewOpen}
                    setOpen={setSavepreviewOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <MainteanceplansWork
                    open={workOpen}
                    setOpen={setWorkOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <MainteanceplansStop
                    open={stopOpen}
                    setOpen={setStopOpen}
                    record={record}
                    setRecord={setRecord}
                />
            </Pagewrapper>

    )
}