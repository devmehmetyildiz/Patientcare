import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Tab } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Contentwrapper, DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import validator from '../../Utils/Validator'
import { Formatfulldate } from '../../Utils/Formatdate'
import { TRAINING_TYPE_COMPANY, TRAINING_TYPE_ORGANIZATION } from '../../Utils/Constants'
import TrainingsSavepreview from '../../Containers/Trainings/TrainingsSavepreview'
import TrainingsApprove from '../../Containers/Trainings/TrainingsApprove'
import TrainingsComplete from '../../Containers/Trainings/TrainingsComplete'
import TrainingsDelete from '../../Containers/Trainings/TrainingsDelete'

export default class Trainings extends Component {

    componentDidMount() {
        const { GetTrainings, GetUsers } = this.props
        GetTrainings()
        GetUsers()
    }

    render() {
        const { Trainings, handleDeletemodal, handleCompletemodal, handleSavepreviewmodal,
            handleApprovemodal, handleSelectedTraining, } = this.props
        const t = Profile?.i18n?.t
        const { isLoading } = Trainings

        const colProps = {
            sortable: true,
            canGroupBy: true,
            canFilter: true
        }

        const Columns = [
            { Header: t('Common.Column.Id'), accessor: 'Id' },
            { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
            { Header: t('Pages.Trainings.Column.Type'), accessor: 'Type' },
            { Header: t('Pages.Trainings.Column.Name'), accessor: 'Name' },
            { Header: t('Pages.Trainings.Column.Trainingdate'), accessor: 'Trainingdate' },
            { Header: t('Pages.Trainings.Column.Description'), accessor: 'Description' },
            { Header: t('Pages.Trainings.Column.Place'), accessor: 'Place' },
            { Header: t('Pages.Trainings.Column.Duration'), accessor: 'Duration' },
            { Header: t('Pages.Trainings.Column.Companyname'), accessor: 'Companyname' },
            { Header: t('Pages.Trainings.Column.Educator'), accessor: 'Educator' },
            { Header: t('Pages.Trainings.Column.EducatoruserID'), accessor: 'EducatoruserID' },
            { Header: t('Pages.Trainings.Column.Approvetime'), accessor: 'Approvetime' },
            { Header: t('Pages.Trainings.Column.Completedtime'), accessor: 'Completedtime' },
            { Header: t('Pages.Trainings.Column.Approveduser'), accessor: 'Approveduser' },
            { Header: t('Pages.Trainings.Column.Completeduser'), accessor: 'Completeduser' },
            { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
            { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
            { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
            { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
        ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

        const metaKey = "traning"
        let initialConfig = GetInitialconfig(Profile, metaKey)

        const list = (Trainings.list || []).filter(u => u.Isactive).map(item => {
            return {
                ...item,

            }
        })

        const organizationPrelist = list.filter(u => u.Type === TRAINING_TYPE_ORGANIZATION)
        const companyPrelist = list.filter(u => u.Type === TRAINING_TYPE_COMPANY)

        const organizationlist = {
            completed: organizationPrelist.filter(u => u.Iscompleted && u.Isapproved && !u.Isonpreview),
            approved: organizationPrelist.filter(u => !u.Iscompleted && u.Isapproved && !u.Isonpreview),
            waitingapprove: organizationPrelist.filter(u => !u.Iscompleted && !u.Isapproved && !u.Isonpreview),
            onpreview: organizationPrelist.filter(u => !u.Iscompleted && !u.Isapproved && u.Isonpreview),
        }
        const companylist = {
            completed: companyPrelist.filter(u => u.Iscompleted && u.Isapproved && !u.Isonpreview),
            approved: companyPrelist.filter(u => !u.Iscompleted && u.Isapproved && !u.Isonpreview),
            waitingapprove: companyPrelist.filter(u => !u.Iscompleted && !u.Isapproved && !u.Isonpreview),
            onpreview: companyPrelist.filter(u => !u.Iscompleted && !u.Isapproved && u.Isonpreview),
        }

        return (
            isLoading ? <LoadingPage /> :
                <React.Fragment>
                    <Pagewrapper>
                        <Headerwrapper>
                            <Grid columns='2' >
                                <GridColumn width={8}>
                                    <Breadcrumb size='big'>
                                        <Link to={"/Trainings"}>
                                            <Breadcrumb.Section>{t('Pages.Trainings.Page.Header')}</Breadcrumb.Section>
                                        </Link>
                                    </Breadcrumb>
                                </GridColumn>
                                <Settings
                                    Profile={Profile}
                                    Pagecreateheader={t('Pages.Trainings.Page.CreateHeader')}
                                    Pagecreatelink={"/Trainings/Create"}
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
                                        menuItem: `${t('Pages.Trainings.Tab.Organization')} (${(organizationPrelist || []).length})`,
                                        pane: {
                                            key: 'organization',
                                            content: <Tab
                                                className="w-full !bg-transparent"
                                                panes={[
                                                    {
                                                        menuItem: `${t('Pages.Trainings.Tab.Completed')} (${(organizationlist.completed || []).length})`,
                                                        pane: {
                                                            key: 'completed_organization',
                                                            content: this.renderView(organizationlist.completed, Columns.filter(u => u.key === 'approved' || u.key1 === 'approved' || !u.key), initialConfig)
                                                        }
                                                    },
                                                    {
                                                        menuItem: `${t('Pages.Trainings.Tab.Approved')} (${(organizationlist.approved || []).length})`,
                                                        pane: {
                                                            key: 'approved_organization',
                                                            content: this.renderView(organizationlist.approved, Columns.filter(u => u.key === 'approved' || u.key1 === 'approved' || !u.key), initialConfig)
                                                        }
                                                    },
                                                    {
                                                        menuItem: `${t('Pages.Trainings.Tab.Waitingapprove')} (${(organizationlist.waitingapprove || []).length})`,
                                                        pane: {
                                                            key: 'waitingapprove_organization',
                                                            content: this.renderView(organizationlist.waitingapprove, Columns.filter(u => u.key === 'approved' || u.key1 === 'approved' || !u.key), initialConfig)
                                                        }
                                                    },
                                                    {
                                                        menuItem: `${t('Pages.Trainings.Tab.Onpreview')} (${(organizationlist.onpreview || []).length})`,
                                                        pane: {
                                                            key: 'onpreview_organization',
                                                            content: this.renderView(organizationlist.onpreview, Columns.filter(u => u.key === 'approved' || u.key1 === 'approved' || !u.key), initialConfig)
                                                        }
                                                    },


                                                ]}
                                                renderActiveOnly={false}
                                            />
                                        }
                                    },
                                    {
                                        menuItem: `${t('Pages.Trainings.Tab.Company')} (${(companyPrelist || []).length})`,
                                        pane: {
                                            key: 'company',
                                            content: <Tab
                                                className="w-full !bg-transparent"
                                                panes={[
                                                    {
                                                        menuItem: `${t('Pages.Trainings.Tab.Completed')} (${(companyPrelist.completed || []).length})`,
                                                        pane: {
                                                            key: 'completed_organization',
                                                            content: this.renderView(companyPrelist.completed, Columns.filter(u => u.key === 'approved' || u.key1 === 'approved' || !u.key), initialConfig)
                                                        }
                                                    },
                                                    {
                                                        menuItem: `${t('Pages.Trainings.Tab.Approved')} (${(companyPrelist.approved || []).length})`,
                                                        pane: {
                                                            key: 'approved_organization',
                                                            content: this.renderView(companyPrelist.approved, Columns.filter(u => u.key === 'approved' || u.key1 === 'approved' || !u.key), initialConfig)
                                                        }
                                                    },
                                                    {
                                                        menuItem: `${t('Pages.Trainings.Tab.Waitingapprove')} (${(companyPrelist.waitingapprove || []).length})`,
                                                        pane: {
                                                            key: 'waitingapprove_organization',
                                                            content: this.renderView(companyPrelist.waitingapprove, Columns.filter(u => u.key === 'approved' || u.key1 === 'approved' || !u.key), initialConfig)
                                                        }
                                                    },
                                                    {
                                                        menuItem: `${t('Pages.Trainings.Tab.Onpreview')} (${(companyPrelist.onpreview || []).length})`,
                                                        pane: {
                                                            key: 'onpreview_organization',
                                                            content: this.renderView(companyPrelist.onpreview, Columns.filter(u => u.key === 'approved' || u.key1 === 'approved' || !u.key), initialConfig)
                                                        }
                                                    },


                                                ]}
                                                renderActiveOnly={false}
                                            />
                                        }
                                    },
                                ]}
                                renderActiveOnly={false}
                            />
                        </Contentwrapper>
                        <TrainingsSavepreview />
                        <TrainingsApprove />
                        <TrainingsComplete />
                        <TrainingsDelete />
                    </Pagewrapper>
                </React.Fragment>
        )
    }

    renderView = (list, Columns, initialConfig) => {
        const { Profile } = this.props
        const t = Profile?.i18n?.t

        return list.length > 0 ?
            <div className='w-full mx-auto '>
                {Profile.Ismobile ?
                    <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                    <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
            </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
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

    dateCellhandler = (value) => {
        if (value) {
            return Formatfulldate(value, true)
        }
        return value
    }

    currencyCellhandler = (value) => {
        if (value) {
            return this.CurrencyLabel({ value: value })
        }
        return value
    }
}