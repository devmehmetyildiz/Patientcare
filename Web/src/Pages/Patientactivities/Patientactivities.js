import React, { useEffect, useState } from 'react'
import { Breadcrumb, Grid, GridColumn, Icon, Loader, Tab } from 'semantic-ui-react'
import { COL_PROPS } from '../../Utils/Constants'
import { Contentwrapper, DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import PatientactivitiesSavepreview from '../../Containers/Patientactivities/PatientactivitiesSavepreview'
import PatientactivitiesDelete from '../../Containers/Patientactivities/PatientactivitiesDelete'
import PatientactivitiesApprove from '../../Containers/Patientactivities/PatientactivitiesApprove'
import PatientactivitiesComplete from '../../Containers/Patientactivities/PatientactivitiesComplete'
import PatientactivitiesDetail from '../../Containers/Patientactivities/PatientactivitiesDetail'
import { Formatfulldate } from '../../Utils/Formatdate'
import useTabNavigation from '../../Hooks/useTabNavigation'
import privileges from '../../Constants/Privileges'

export default function Patientactivities(props) {
    const { Profile, Users, Patientactivities, Patients, Patientdefines, history } = props
    const { GetPatientactivities, GetUsers, GetPatientdefines, GetPatients } = props

    const t = Profile?.i18n?.t

    const [userStatus, setUserStatus] = useState([])
    const [patientStatus, setPatientStatus] = useState([])
    const [detailOpen, setDetailOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [completeOpen, setCompleteOpen] = useState(false)
    const [approveOpen, setApproveOpen] = useState(false)
    const [record, setRecord] = useState(null)

    const dateCellhandler = (value) => {
        if (value) {
            return Formatfulldate(value, true)
        }
        return value
    }

    const userCellhandler = (row, freeze) => {
        if (Users.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        }
        const itemId = row?.Uuid
        const itemUsers = (row.Participatedusers || []).map(u => { return (Users.list || []).find(user => user.Uuid === u.UserID) }).filter(u => u)
        const itemUserstxt = itemUsers.map(u => `${u?.Name} ${u?.Surname}`).join(' , ')
        if (freeze) {
            return itemUserstxt
        }
        return itemUserstxt.length - 35 > 20 ?
            (
                !userStatus.includes(itemId) ?
                    [itemUserstxt.slice(0, 35) + ' ...(' + itemUsers.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => setUserStatus(prev => [...prev, itemId])}> ...Daha Fazla Göster</Link >] :
                    [itemUserstxt, <Link to='#' className='showMoreOrLess' onClick={() => setUserStatus(prev => [...prev.filter(u => u !== itemId)])}> ...Daha Az Göster</Link >]
            ) : itemUserstxt
    }

    const patientCellhandler = (row, freeze) => {
        if (Patients.isLoading || Patientdefines.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        }
        const itemId = row?.Uuid
        const itemPatients = (row.Participatedpatients || []).map(u => { return (Patients.list || []).find(patient => patient.Uuid === u.PatientID) }).filter(u => u)
        const itemPatientstxt = itemPatients.map(patient => {
            const patientdefine = (Patientdefines.list || []).find(define => define.Uuid === patient.PatientdefineID)
            return `${patientdefine?.Firstname} ${patientdefine?.Lastname}`
        }).join(' , ')
        if (freeze) {
            return itemPatientstxt
        }
        return itemPatientstxt.length - 35 > 20 ?
            (
                !patientStatus.includes(itemId) ?
                    [itemPatientstxt.slice(0, 35) + ' ...(' + itemPatients.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => setPatientStatus(prev => [...prev, itemId])}> ...Daha Fazla Göster</Link >] :
                    [itemPatientstxt, <Link to='#' className='showMoreOrLess' onClick={() => setPatientStatus(prev => [...prev.filter(u => u !== itemId)])}> ...Daha Az Göster</Link >]
            ) : itemPatientstxt
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


    const Columns = [
        { Header: t('Common.Column.Id'), accessor: 'Id' },
        { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
        { Header: t('Pages.Patientactivities.Column.Name'), accessor: 'Name' },
        { Header: t('Pages.Patientactivities.Column.Place'), accessor: 'Place' },
        { Header: t('Pages.Patientactivities.Column.Starttime'), accessor: row => dateCellhandler(row?.Starttime) },
        { Header: t('Pages.Patientactivities.Column.Endtime'), accessor: row => dateCellhandler(row?.Endtime) },
        { Header: t('Pages.Patientactivities.Column.Budget'), accessor: 'Budget' },
        { Header: t('Pages.Patientactivities.Column.Participatedpatients'), accessor: row => patientCellhandler(row) },
        { Header: t('Pages.Patientactivities.Column.Participatedusers'), accessor: row => userCellhandler(row) },
        { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
        { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
        { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
        { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
        { Header: t('Common.Column.savepreview'), accessor: 'savepreview', disableProps: true, keys: ['onpreview'], role: privileges.patientactivitysavepreview },
        { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true, keys: ['waitingapprove'], role: privileges.patientactivityapprove },
        { Header: t('Common.Column.complete'), accessor: 'complete', disableProps: true, keys: ['approved'], role: privileges.patientactivitycomplete },
        { Header: t('Common.Column.detail'), accessor: 'detail', disableProps: true },
        { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, keys: ['onpreview'], role: privileges.patientactivityupdate },
        { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, keys: ['onpreview', 'waitingapprove'], role: privileges.patientactivitydelete }
    ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

    const metaKey = "patientactivity"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Patientactivities.list || []).filter(u => u.Isactive).map(item => {
        return {
            ...item,
            edit: <Link to={`/Patientactivities/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
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
                setPreviewOpen(true)
            }} />,
            detail: <Icon link size='large' color='grey' name='refresh' onClick={() => {
                setRecord(item)
                setDetailOpen(true)
            }} />,
        }
    })

    const completedList = list.filter(u => u.Iscompleted && u.Isapproved && !u.Isonpreview)
    const approvedList = list.filter(u => !u.Iscompleted && u.Isapproved && !u.Isonpreview)
    const waitingapproveList = list.filter(u => !u.Iscompleted && !u.Isapproved && !u.Isonpreview)
    const onpreviewList = list.filter(u => !u.Iscompleted && !u.Isapproved && u.Isonpreview)

    const tabOrder = [
        'completed',
        'approved',
        'waitingapprove',
        'onpreview',
    ]

    const { activeTab, setActiveTab } = useTabNavigation({
        history,
        tabOrder,
        mainRoute: 'Patientactivities'
    })

    useEffect(() => {
        GetPatientactivities()
        GetUsers()
        GetPatients()
        GetPatientdefines()
    }, [])


    return (
        Patientactivities.isLoading ? <LoadingPage /> :
            <Pagewrapper>
                <Headerwrapper>
                    <Grid columns='2' >
                        <GridColumn width={8}>
                            <Breadcrumb size='big'>
                                <Link to={"/Patientactivities"}>
                                    <Breadcrumb.Section>{t('Pages.Patientactivities.Page.Header')}</Breadcrumb.Section>
                                </Link>
                            </Breadcrumb>
                        </GridColumn>
                        <Settings
                            Profile={Profile}
                            Pagecreateheader={t('Pages.Patientactivities.Page.CreateHeader')}
                            Pagecreatelink={"/Patientactivities/Create"}
                            Columns={Columns}
                            list={list}
                            initialConfig={initialConfig}
                            metaKey={metaKey}
                            Showcreatebutton
                            Showcolumnchooser
                            Showexcelexport
                            CreateRole={privileges.patientactivityadd}
                            ReportRole={privileges.patientactivitygetreport}
                            ViewRole={privileges.patientactivitymanageview}
                        />
                    </Grid>
                </Headerwrapper>
                <Pagedivider />
                <Contentwrapper>
                    <Tab
                        onTabChange={(_, { activeIndex }) => {
                            setActiveTab(activeIndex)
                        }}
                        activeIndex={activeTab}
                        className="w-full !bg-transparent"
                        panes={[
                            {
                                menuItem: `${t('Pages.Patientactivities.Tab.Completed')} (${(completedList || []).length})`,
                                pane: {
                                    key: 'completed',
                                    content: renderView({ list: completedList, Columns, keys: ['completed'], initialConfig })
                                }
                            },
                            {
                                menuItem: `${t('Pages.Patientactivities.Tab.Approved')} (${(approvedList || []).length})`,
                                pane: {
                                    key: 'approved',
                                    content: renderView({ list: approvedList, Columns, keys: ['approved'], initialConfig })
                                }
                            },
                            {
                                menuItem: `${t('Pages.Patientactivities.Tab.Waitingapprove')} (${(waitingapproveList || []).length})`,
                                pane: {
                                    key: 'waitingapprove',
                                    content: renderView({ list: waitingapproveList, Columns, keys: ['waitingapprove'], initialConfig })
                                }
                            },
                            {
                                menuItem: `${t('Pages.Patientactivities.Tab.Onpreview')} (${(onpreviewList || []).length})`,
                                pane: {
                                    key: 'onpreview',
                                    content: renderView({ list: onpreviewList, Columns, keys: ['onpreview'], initialConfig })
                                }
                            },


                        ]}
                        renderActiveOnly={false}
                    />
                </Contentwrapper>
                <PatientactivitiesDetail
                    open={detailOpen}
                    setOpen={setDetailOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <PatientactivitiesDelete
                    open={deleteOpen}
                    setOpen={setDeleteOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <PatientactivitiesSavepreview
                    open={previewOpen}
                    setOpen={setPreviewOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <PatientactivitiesApprove
                    open={approveOpen}
                    setOpen={setApproveOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <PatientactivitiesComplete
                    open={completeOpen}
                    setOpen={setCompleteOpen}
                    record={record}
                    setRecord={setRecord}
                />
            </Pagewrapper>

    )
}
