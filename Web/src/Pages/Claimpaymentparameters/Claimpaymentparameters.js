import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Tab } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Contentwrapper, DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import ClaimpaymentparametersDelete from '../../Containers/Claimpaymentparameters/ClaimpaymentparametersDelete'
import ClaimpaymentparametersApprove from '../../Containers/Claimpaymentparameters/ClaimpaymentparametersApprove'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { CLAIMPAYMENT_TYPE_BHKS, CLAIMPAYMENT_TYPE_KYS, CLAIMPAYMENT_TYPE_PATIENT } from '../../Utils/Constants'
import validator from '../../Utils/Validator'
import ClaimpaymentparametersActivate from '../../Containers/Claimpaymentparameters/ClaimpaymentparametersActivate'
import ClaimpaymentparametersDeactivate from '../../Containers/Claimpaymentparameters/ClaimpaymentparametersDeactivate'

export default class Claimpaymentparameters extends Component {

    componentDidMount() {
        const { GetClaimpaymentparameters, GetCostumertypes } = this.props
        GetClaimpaymentparameters()
        GetCostumertypes()
    }

    render() {
        const { Claimpaymentparameters, Profile, handleDeletemodal, handleSelectedClaimpaymentparameter, handleApprovemodal, handleActivatemodal, handleDeactivatemodal, } = this.props
        const t = Profile?.i18n?.t
        const { isLoading } = Claimpaymentparameters

        const colProps = {
            sortable: true,
            canGroupBy: true,
            canFilter: true
        }

        const Columns = [
            { Header: t('Common.Column.Id'), accessor: 'Id' },
            { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
            { Header: t('Pages.Claimpaymentparameters.Column.Type'), accessor: row => this.typeCellhandler(row?.Type), Title: true },
            { Header: t('Pages.Claimpaymentparameters.Column.Costumertype'), accessor: row => this.costumertypeCellhandler(row?.CostumertypeID), Subtitle: true, Withtext: true },
            { Header: t('Pages.Claimpaymentparameters.Column.Patientclaimpaymentperpayment'), accessor: 'Patientclaimpaymentperpayment' },
            { Header: t('Pages.Claimpaymentparameters.Column.Perpaymentkdvpercent'), accessor: 'Perpaymentkdvpercent' },
            { Header: t('Pages.Claimpaymentparameters.Column.Perpaymentkdvwithholdingpercent'), accessor: 'Perpaymentkdvwithholdingpercent' },
            { Header: t('Pages.Claimpaymentparameters.Column.Issettingactive'), accessor: row => this.boolCellhandler(row?.Issettingactive) },
            { Header: t('Pages.Claimpaymentparameters.Column.Isapproved'), accessor: row => this.boolCellhandler(row?.Isapproved) },
            { Header: t('Pages.Claimpaymentparameters.Column.Approveduser'), accessor: 'Approveduser' },
            { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
            { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
            { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
            { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
            { Header: t('Common.Column.activate'), accessor: 'activate', disableProps: true },
            { Header: t('Common.Column.deactivate'), accessor: 'deactivate', disableProps: true },
            { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true },
            { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
            { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
        ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

        const metaKey = "claimpaymentperpayment"
        let initialConfig = GetInitialconfig(Profile, metaKey)

        const list = (Claimpaymentparameters.list || []).filter(u => u.Isactive).map(item => {
            return {
                ...item,
                edit: item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Link to={`/Claimpaymentparameters/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
                delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                    handleSelectedClaimpaymentparameter(item)
                    handleDeletemodal(true)
                }} />,
                approve: item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    handleSelectedClaimpaymentparameter(item)
                    handleApprovemodal(true)
                }} />,
                activate: item.Issettingactive || !item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    handleSelectedClaimpaymentparameter(item)
                    handleActivatemodal(true)
                }} />,
                deactivate: !item.Issettingactive ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    handleSelectedClaimpaymentparameter(item)
                    handleDeactivatemodal(true)
                }} />,
            }
        })

        const workingList = list.filter(u => u.Issettingactive && u.Isactive)

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
                                />
                            </Grid>
                        </Headerwrapper>
                        <Pagedivider />
                        <Contentwrapper>
                            <Tab
                                className="w-full !bg-transparent"
                                panes={[
                                    {
                                        menuItem: `${t('Pages.Claimpaymentparameters.Tab.Onlyactive')} (${(workingList || []).length})`,
                                        pane: {
                                            key: 'onlyactive',
                                            content: <React.Fragment>
                                                {workingList.length > 0 ?
                                                    <div className='w-full mx-auto '>
                                                        {Profile.Ismobile ?
                                                            <MobileTable Columns={Columns} Data={workingList} Config={initialConfig} Profile={Profile} /> :
                                                            <DataTable Columns={Columns} Data={workingList} Config={initialConfig} />}
                                                    </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
                                                }
                                            </React.Fragment>
                                        }
                                    },
                                    {
                                        menuItem: `${t('Pages.Claimpaymentparameters.Tab.All')} (${(list || []).length})`,
                                        pane: {
                                            key: 'all',
                                            content: <React.Fragment>
                                                {list.length > 0 ?
                                                    <div className='w-full mx-auto '>
                                                        {Profile.Ismobile ?
                                                            <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                                                            <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
                                                    </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
                                                }
                                            </React.Fragment>
                                        }
                                    },
                                ]}
                                renderActiveOnly={false}
                            />
                        </Contentwrapper>
                    </Pagewrapper>
                    <ClaimpaymentparametersDelete />
                    <ClaimpaymentparametersApprove />
                    <ClaimpaymentparametersActivate />
                    <ClaimpaymentparametersDeactivate />
                </React.Fragment>
        )
    }

    costumertypeCellhandler = (value) => {
        const { Costumertypes } = this.props
        if (Costumertypes.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const costumertype = (Costumertypes.list || []).find(u => u.Uuid === value)
            return costumertype?.Name || ''
        }
    }

    typeCellhandler = (value) => {
        const { Profile } = this.props

        const t = Profile?.i18n?.t

        const Claimpaymenttypes = [
            { key: 1, text: t('Common.Claimpayments.Type.Patient'), value: CLAIMPAYMENT_TYPE_PATIENT },
            { key: 2, text: t('Common.Claimpayments.Type.Bhks'), value: CLAIMPAYMENT_TYPE_BHKS },
            { key: 3, text: t('Common.Claimpayments.Type.Kys'), value: CLAIMPAYMENT_TYPE_KYS },
        ]

        const type = Claimpaymenttypes.find(u => u.value === value)?.text || t('Common.NoDataFound')
        return type
    }

    boolCellhandler = (value) => {
        const { Profile } = this.props
        const t = Profile?.i18n?.t
        return value !== null && validator.isBoolean(value)
            ? (value
                ? t('Common.Yes')
                : t('Common.No'))
            : t('Common.No')
    }
}