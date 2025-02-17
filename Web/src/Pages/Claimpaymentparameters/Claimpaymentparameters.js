import React, { Component, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Tab } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Contentwrapper, DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import ClaimpaymentparametersDelete from '../../Containers/Claimpaymentparameters/ClaimpaymentparametersDelete'
import ClaimpaymentparametersApprove from '../../Containers/Claimpaymentparameters/ClaimpaymentparametersApprove'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { CLAIMPAYMENT_TYPE_BHKS, CLAIMPAYMENT_TYPE_KYS, CLAIMPAYMENT_TYPE_PATIENT, COL_PROPS } from '../../Utils/Constants'
import ClaimpaymentparametersActivate from '../../Containers/Claimpaymentparameters/ClaimpaymentparametersActivate'
import ClaimpaymentparametersDeactivate from '../../Containers/Claimpaymentparameters/ClaimpaymentparametersDeactivate'
import ClaimpaymentparametersSavepreview from '../../Containers/Claimpaymentparameters/ClaimpaymentparametersSavepreview'
import useTabNavigation from '../../Hooks/useTabNavigation'
import privileges from '../../Constants/Privileges'

export default function Claimpaymentparameters(props) {

    const { GetClaimpaymentparameters, GetCostumertypes } = props
    const { Claimpaymentparameters, Profile, history, Costumertypes, } = props

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [approveOpen, setApproveOpen] = useState(false)
    const [savepreviewOpen, setSavepreviewOpen] = useState(false)
    const [deactivateOpen, setDeactivateOpen] = useState(false)
    const [activateOpen, setActivateOpen] = useState(false)
    const [record, setRecord] = useState(null)

    const t = Profile?.i18n?.t
    const { isLoading } = Claimpaymentparameters

    const renderView = (list, Columns, initialConfig) => {
        return list.length > 0 ?
            <div className='w-full mx-auto '>
                {Profile.Ismobile ?
                    <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                    <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
            </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
    }

    const costumertypeCellhandler = (value) => {
        if (Costumertypes.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const costumertype = (Costumertypes.list || []).find(u => u.Uuid === value)
            return costumertype?.Name || ''
        }
    }

    const typeCellhandler = (value) => {
        const Claimpaymenttypes = [
            { key: 1, text: t('Common.Claimpayments.Type.Patient'), value: CLAIMPAYMENT_TYPE_PATIENT },
            { key: 2, text: t('Common.Claimpayments.Type.Bhks'), value: CLAIMPAYMENT_TYPE_BHKS },
            { key: 3, text: t('Common.Claimpayments.Type.Kys'), value: CLAIMPAYMENT_TYPE_KYS },
        ]

        const type = Claimpaymenttypes.find(u => u.value === value)?.text || t('Common.NoDataFound')
        return type
    }

    const Columns = [
        { Header: t('Common.Column.Id'), accessor: 'Id' },
        { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
        { Header: t('Pages.Claimpaymentparameters.Column.Type'), accessor: row => typeCellhandler(row?.Type), Title: true },
        { Header: t('Pages.Claimpaymentparameters.Column.Costumertype'), accessor: row => costumertypeCellhandler(row?.CostumertypeID), Subtitle: true, Withtext: true },
        { Header: t('Pages.Claimpaymentparameters.Column.Patientclaimpaymentperpayment'), accessor: 'Patientclaimpaymentperpayment' },
        { Header: t('Pages.Claimpaymentparameters.Column.Perpaymentkdvpercent'), accessor: 'Perpaymentkdvpercent' },
        { Header: t('Pages.Claimpaymentparameters.Column.Perpaymentkdvwithholdingpercent'), accessor: 'Perpaymentkdvwithholdingpercent' },
        { Header: t('Pages.Claimpaymentparameters.Column.Approveduser'), accessor: 'Approveduser', key: 'working', key1: 'nonworking' },
        { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
        { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
        { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
        { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
        { Header: t('Common.Column.activate'), accessor: 'activate', disableProps: true, key: 'nonworking', role: privileges.claimpaymentparameterupdate },
        { Header: t('Common.Column.deactivate'), accessor: 'deactivate', disableProps: true, key: 'working', role: privileges.claimpaymentparameterupdate },
        { Header: t('Common.Column.savepreview'), accessor: 'savepreview', disableProps: true, key: 'onpreview', role: privileges.claimpaymentparametersavepreview },
        { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true, key: 'waitingapprove', role: privileges.claimpaymentparameterapprove },
        { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, key: 'onpreview', role: privileges.claimpaymentparameterupdate },
        { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, role: privileges.claimpaymentparameterdelete }
    ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

    const metaKey = "claimpaymentperpayment"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Claimpaymentparameters.list || []).filter(u => u.Isactive).map(item => {
        return {
            ...item,
            edit: <Link to={`/Claimpaymentparameters/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
            delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                setRecord(item)
                setDeleteOpen(true)
            }} />,
            approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                setRecord(item)
                setApproveOpen(true)
            }} />,
            activate: <Icon link size='large' color='blue' name='hand point left' onClick={() => {
                setRecord(item)
                setActivateOpen(true)
            }} />,
            deactivate: <Icon link size='large' color='blue' name='hand point right' onClick={() => {
                setRecord(item)
                setDeactivateOpen(true)
            }} />,
            savepreview: <Icon link size='large' color='green' name='save' onClick={() => {
                setRecord(item)
                setSavepreviewOpen(true)
            }} />,
        }
    })

    const workingList = list.filter(u => u.Issettingactive && u.Isapproved && !u.Isonpreview)
    const nonworkingList = list.filter(u => !u.Issettingactive && u.Isapproved && !u.Isonpreview)
    const waitingapproveList = list.filter(u => !u.Isapproved && !u.Isonpreview)
    const onpreviewList = list.filter(u => !u.Isapproved && u.Isonpreview)

    const tabOrder = [
        'working',
        'nonworking',
        'waitingapprove',
        'onpreview',
    ]

    const { activeTab, setActiveTab } = useTabNavigation({
        history,
        tabOrder,
        mainRoute: 'Claimpaymentparameters'
    })

    useEffect(() => {
        GetClaimpaymentparameters()
        GetCostumertypes()
    }, [])

    return (
        isLoading ? <LoadingPage /> :
            <React.Fragment>
                <Pagewrapper>
                    <Headerwrapper>
                        <Grid columns='2' >
                            <GridColumn width={8}>
                                <Breadcrumb size='big'>
                                    <Link to={"/Claimpaymentparameters"}>
                                        <Breadcrumb.Section>{t('Pages.Claimpaymentparameters.Page.Header')}</Breadcrumb.Section>
                                    </Link>
                                </Breadcrumb>
                            </GridColumn>
                            <Settings
                                Profile={Profile}
                                Pagecreateheader={t('Pages.Claimpaymentparameters.Page.CreateHeader')}
                                Pagecreatelink={"/Claimpaymentparameters/Create"}
                                Columns={Columns}
                                list={list}
                                initialConfig={initialConfig}
                                metaKey={metaKey}
                                Showcreatebutton
                                Showcolumnchooser
                                Showexcelexport
                                CreateRole={privileges.claimpaymentparameteradd}
                                ReportRole={privileges.claimpaymentparametergetreport}
                                ViewRole={privileges.claimpaymentparametermanageview}
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
                                    menuItem: `${t('Pages.Claimpaymentparameters.Tab.Working')} (${(workingList || []).length})`,
                                    pane: {
                                        key: 'working',
                                        content: renderView(workingList, Columns.filter(u => u.key === 'working' || u.key1 === 'working' || !u.key), initialConfig)
                                    }
                                },
                                {
                                    menuItem: `${t('Pages.Claimpaymentparameters.Tab.Nonworking')} (${(nonworkingList || []).length})`,
                                    pane: {
                                        key: 'nonworking',
                                        content: renderView(nonworkingList, Columns.filter(u => u.key === 'nonworking' || u.key1 === 'nonworking' || !u.key), initialConfig)
                                    }
                                },
                                {
                                    menuItem: `${t('Pages.Claimpaymentparameters.Tab.Waitingapprove')} (${(waitingapproveList || []).length})`,
                                    pane: {
                                        key: 'waitingapprove',
                                        content: renderView(waitingapproveList, Columns.filter(u => u.key === 'waitingapprove' || !u.key), initialConfig)
                                    }
                                },
                                {
                                    menuItem: `${t('Pages.Claimpaymentparameters.Tab.Onpreview')} (${(onpreviewList || []).length})`,
                                    pane: {
                                        key: 'onpreview',
                                        content: renderView(onpreviewList, Columns.filter(u => u.key === 'onpreview' || !u.key), initialConfig)
                                    }
                                },
                            ]}
                            renderActiveOnly={false}
                        />
                    </Contentwrapper>
                </Pagewrapper>
                <ClaimpaymentparametersDelete
                    open={deleteOpen}
                    setOpen={setDeleteOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <ClaimpaymentparametersApprove
                    open={approveOpen}
                    setOpen={setApproveOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <ClaimpaymentparametersActivate
                    open={activateOpen}
                    setOpen={setActivateOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <ClaimpaymentparametersDeactivate
                    open={deactivateOpen}
                    setOpen={setDeactivateOpen}
                    record={record}
                    setRecord={setRecord}
                />
                <ClaimpaymentparametersSavepreview
                    open={savepreviewOpen}
                    setOpen={setSavepreviewOpen}
                    record={record}
                    setRecord={setRecord}
                />
            </React.Fragment>
    )
}
