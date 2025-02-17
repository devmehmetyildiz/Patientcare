import React, { useEffect, useState } from 'react'
import { Breadcrumb, Grid, GridColumn, Icon, Loader, Tab } from 'semantic-ui-react'
import { COL_PROPS } from '../../Utils/Constants'
import {
    Contentwrapper, DataTable, Headerwrapper, LoadingPage,
    MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings
} from '../../Components'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import PatientvisitsDelete from '../../Containers/Patientvisits/PatientvisitsDelete'
import PatientvisitsSavepreview from '../../Containers/Patientvisits/PatientvisitsSavepreview'
import PatientvisitsApprove from '../../Containers/Patientvisits/PatientvisitsApprove'
import PatientvisitsComplete from '../../Containers/Patientvisits/PatientvisitsComplete'
import { Formatfulldate } from '../../Utils/Formatdate'
import useTabNavigation from '../../Hooks/useTabNavigation'
import privileges from '../../Constants/Privileges'

export default function Patientvisits(props) {
    const { Profile, Users, Patientvisits, Patients, Patientdefines, history } = props
    const { GetPatientvisits, GetUsers, GetPatientdefines, GetPatients, } = props

    const t = Profile?.i18n?.t

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [completeOpen, setCompleteOpen] = useState(false)
    const [approveOpen, setApproveOpen] = useState(false)
    const [record, setRecord] = useState(null)


    const userCellhandler = (value) => {
        if (Users.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const user = (Users?.list || []).find(u => u.Uuid === value)
            return `${user?.Name} ${user?.Surname}`
        }
    }

    const patientCellhandler = (value) => {
        if (Patients.isLoading || Patientdefines.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const patient = (Patients?.list || []).find(u => u.Uuid === value)
            const patientdefine = (Patientdefines?.list || []).find(u => u.Uuid === patient?.PatientdefineID)
            return `${patientdefine?.Firstname} ${patientdefine?.Lastname}`
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


    const Columns = [
        { Header: t('Common.Column.Id'), accessor: 'Id' },
        { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
        { Header: t('Pages.Patientvisits.Column.Patient'), accessor: row => patientCellhandler(row?.PatientID) },
        { Header: t('Pages.Patientvisits.Column.Contactname'), accessor: 'Contactname' },
        { Header: t('Pages.Patientvisits.Column.Contactstatus'), accessor: 'Contactstatus' },
        { Header: t('Pages.Patientvisits.Column.Starttime'), accessor: row => dateCellhandler(row?.Starttime) },
        { Header: t('Pages.Patientvisits.Column.Endtime'), accessor: row => dateCellhandler(row?.Endtime) },
        { Header: t('Pages.Patientvisits.Column.Info'), accessor: 'Info' },
        { Header: t('Pages.Patientvisits.Column.Participateuser'), accessor: row => userCellhandler(row?.ParticipateuserID) },
        { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
        { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
        { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
        { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
        { Header: t('Common.Column.savepreview'), accessor: 'savepreview', disableProps: true, keys: ['onpreview'], role: privileges.patientvisitsavepreview },
        { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true, keys: ['waitingapprove'], role: privileges.patientvisitapprove },
        { Header: t('Common.Column.complete'), accessor: 'complete', disableProps: true, keys: ['approved'], role: privileges.patientvisitcomplete },
        { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, keys: ['onpreview'], role: privileges.patientvisitupdate },
        { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, keys: ['onpreview', 'waitingapprove'], role: privileges.patientvisitdelete }
    ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

    const metaKey = "patientvisit"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Patientvisits.list || []).filter(u => u.Isactive).map(item => {
        return {
            ...item,
            edit: <Link to={`/Patientvisits/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
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
        mainRoute: 'Patientvisits'
    })

    useEffect(() => {
        GetPatientvisits()
        GetUsers()
        GetPatients()
        GetPatientdefines()
    }, [])


    return (
        Patientvisits.isLoading ? <LoadingPage /> :
            <Pagewrapper>
                <Headerwrapper>
                    <Grid columns='2' >
                        <GridColumn width={8}>
                            <Breadcrumb size='big'>
                                <Link to={"/Patientvisits"}>
                                    <Breadcrumb.Section>{t('Pages.Patientvisits.Page.Header')}</Breadcrumb.Section>
                                </Link>
                            </Breadcrumb>
                        </GridColumn>
                        <Settings
                            Profile={Profile}
                            Pagecreateheader={t('Pages.Patientvisits.Page.CreateHeader')}
                            Pagecreatelink={"/Patientvisits/Create"}
                            Columns={Columns}
                            list={list}
                            initialConfig={initialConfig}
                            metaKey={metaKey}
                            Showcreatebutton
                            Showcolumnchooser
                            Showexcelexport
                            CreateRole={privileges.patientvisitadd}
                            ReportRole={privileges.patientvisitgetreport}
                            ViewRole={privileges.patientvisitmanageview}
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
                                menuItem: `${t('Pages.Patientvisits.Tab.Completed')} (${(completedList || []).length})`,
                                pane: {
                                    key: 'completed',
                                    content: renderView({ list: completedList, Columns, keys: ['completed'], initialConfig })
                                }
                            },
                            {
                                menuItem: `${t('Pages.Patientvisits.Tab.Approved')} (${(approvedList || []).length})`,
                                pane: {
                                    key: 'approved',
                                    content: renderView({ list: approvedList, Columns, keys: ['approved'], initialConfig })
                                }
                            },
                            {
                                menuItem: `${t('Pages.Patientvisits.Tab.Waitingapprove')} (${(waitingapproveList || []).length})`,
                                pane: {
                                    key: 'waitingapprove',
                                    content: renderView({ list: waitingapproveList, Columns, keys: ['waitingapprove'], initialConfig })
                                }
                            },
                            {
                                menuItem: `${t('Pages.Patientvisits.Tab.Onpreview')} (${(onpreviewList || []).length})`,
                                pane: {
                                    key: 'onpreview',
                                    content: renderView({ list: onpreviewList, Columns, keys: ['onpreview'], initialConfig })
                                }
                            },


                        ]}
                        renderActiveOnly={false}
                    />
                </Contentwrapper>
                <PatientvisitsDelete
                    open={deleteOpen}
                    setOpen={setDeleteOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <PatientvisitsSavepreview
                    open={previewOpen}
                    setOpen={setPreviewOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <PatientvisitsApprove
                    open={approveOpen}
                    setOpen={setApproveOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <PatientvisitsComplete
                    open={completeOpen}
                    setOpen={setCompleteOpen}
                    record={record}
                    setRecord={setRecord}
                />
            </Pagewrapper>

    )
}
