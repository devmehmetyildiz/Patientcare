import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Tab } from 'semantic-ui-react'
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
            handleApprovemodal, handleSelectedTraining, Profile } = this.props

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
            { Header: t('Pages.Trainings.Column.Name'), accessor: 'Name' },
            { Header: t('Pages.Trainings.Column.Trainingdate'), accessor: row => this.dateCellhandler(row?.Trainingdate), },
            { Header: t('Pages.Trainings.Column.Description'), accessor: 'Description' },
            { Header: t('Pages.Trainings.Column.Place'), accessor: 'Place' },
            { Header: t('Pages.Trainings.Column.Duration'), accessor: 'Duration' },
            { Header: t('Pages.Trainings.Column.Companyname'), accessor: 'Companyname', keys: ['company'] },
            { Header: t('Pages.Trainings.Column.Educator'), accessor: 'Educator', keys: ['company'] },
            { Header: t('Pages.Trainings.Column.EducatoruserID'), accessor: row => this.userCellhandler(row?.EducatoruserID), keys: ['organization'] },
            { Header: t('Pages.Trainings.Column.Approvetime'), accessor: row => this.dateCellhandler(row?.Approvetime), keys: ['approved'] },
            { Header: t('Pages.Trainings.Column.Completedtime'), accessor: row => this.dateCellhandler(row?.Completedtime), keys: ['completed'] },
            { Header: t('Pages.Trainings.Column.Approveduser'), accessor: 'Approveduser', keys: ['approved'] },
            { Header: t('Pages.Trainings.Column.Completeduser'), accessor: 'Completeduser', keys: ['completed'] },
            { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
            { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
            { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
            { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
            { Header: t('Common.Column.savepreview'), accessor: 'savepreview', disableProps: true, keys: ['onpreview'] },
            { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true, keys: ['waitingapprove'] },
            { Header: t('Common.Column.complete'), accessor: 'complete', disableProps: true, keys: ['approved'] },
            { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, keys: ['onpreview', 'waitingapprove'] },
            { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, keys: ['onpreview', 'waitingapprove'] }
        ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

        const metaKey = "traning"
        let initialConfig = GetInitialconfig(Profile, metaKey)

        const list = (Trainings.list || []).filter(u => u.Isactive).map(item => {
            return {
                ...item,
                edit: <Link to={`/Trainings/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
                delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                    handleSelectedTraining(item)
                    handleDeletemodal(true)
                }} />,
                approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
                    handleSelectedTraining(item)
                    handleApprovemodal(true)
                }} />,
                complete: <Icon link size='large' color='blue' name='hand point left' onClick={() => {
                    handleSelectedTraining(item)
                    handleCompletemodal(true)
                }} />,
                savepreview: <Icon link size='large' color='green' name='save' onClick={() => {
                    handleSelectedTraining(item)
                    handleSavepreviewmodal(true)
                }} />,
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
                                                            content: this.renderView({ list: organizationlist.completed, Columns, keys: ['completed', 'organization'], initialConfig })
                                                        }
                                                    },
                                                    {
                                                        menuItem: `${t('Pages.Trainings.Tab.Approved')} (${(organizationlist.approved || []).length})`,
                                                        pane: {
                                                            key: 'approved_organization',
                                                            content: this.renderView({ list: organizationlist.approved, Columns, keys: ['approved', 'organization'], initialConfig })
                                                        }
                                                    },
                                                    {
                                                        menuItem: `${t('Pages.Trainings.Tab.Waitingapprove')} (${(organizationlist.waitingapprove || []).length})`,
                                                        pane: {
                                                            key: 'waitingapprove_organization',
                                                            content: this.renderView({ list: organizationlist.waitingapprove, Columns, keys: ['waitingapprove', 'organization'], initialConfig })
                                                        }
                                                    },
                                                    {
                                                        menuItem: `${t('Pages.Trainings.Tab.Onpreview')} (${(organizationlist.onpreview || []).length})`,
                                                        pane: {
                                                            key: 'onpreview_organization',
                                                            content: this.renderView({ list: organizationlist.onpreview, Columns, keys: ['onpreview', 'organization'], initialConfig })
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
                                                        menuItem: `${t('Pages.Trainings.Tab.Completed')} (${(companylist.completed || []).length})`,
                                                        pane: {
                                                            key: 'completed_organization',
                                                            content: this.renderView({ list: companylist.completed, Columns, keys: ['completed', 'company'], initialConfig })
                                                        }
                                                    },
                                                    {
                                                        menuItem: `${t('Pages.Trainings.Tab.Approved')} (${(companylist.approved || []).length})`,
                                                        pane: {
                                                            key: 'approved_organization',
                                                            content: this.renderView({ list: companylist.approved, Columns, keys: ['approved', 'company'], initialConfig })
                                                        }
                                                    },
                                                    {
                                                        menuItem: `${t('Pages.Trainings.Tab.Waitingapprove')} (${(companylist.waitingapprove || []).length})`,
                                                        pane: {
                                                            key: 'waitingapprove_organization',
                                                            content: this.renderView({ list: companylist.waitingapprove, Columns, keys: ['waitingapprove', 'company'], initialConfig })
                                                        }
                                                    },
                                                    {
                                                        menuItem: `${t('Pages.Trainings.Tab.Onpreview')} (${(companylist.onpreview || []).length})`,
                                                        pane: {
                                                            key: 'onpreview_organization',
                                                            content: this.renderView({ list: companylist.onpreview, Columns, keys: ['onpreview', 'company'], initialConfig })
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

    renderView = ({ list, Columns, keys, initialConfig }) => {
        const { Profile } = this.props
        const t = Profile?.i18n?.t

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

    userCellhandler = (value) => {
        const { Users } = this.props
        if (Users.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const user = (Users.list || []).find(u => u.Uuid === value)
            return user ? `${user?.Name} ${user?.Surname}` : ''
        }
    }
}