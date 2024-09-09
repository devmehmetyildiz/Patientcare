import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import SupportplanlistsDelete from '../../Containers/Supportplanlists/SupportplanlistsDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'

export default class Supportplanlists extends Component {

    constructor(props) {
        super(props)
        this.state = {
            supportplanStatus: []
        }
    }

    componentDidMount() {
        const { GetSupportplanlists, GetSupportplans, GetDepartments } = this.props
        GetSupportplanlists()
        GetSupportplans()
        GetDepartments()
    }

    render() {
        const { Supportplanlists, Profile, handleDeletemodal, handleSelectedSupportplanlist } = this.props
        const { isLoading } = Supportplanlists

        const colProps = {
            sortable: true,
            canGroupBy: true,
            canFilter: true
        }

        const Columns = [
            { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', },
            { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', },
            { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', Title: true },
            { Header: Literals.Columns.Supportplans[Profile.Language], accessor: (row, freeze) => this.supportplanCellhandler(row, freeze), },
            { Header: Literals.Columns.Department[Profile.Language], accessor: row => this.departmentCellhandler(row?.DepartmentID), Subtitle: true, Withtext: true },
            { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', },
            { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', },
            { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', },
            { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', },
            { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
            { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
        ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

        const metaKey = "supportplanlist"
        let initialConfig = GetInitialconfig(Profile, metaKey)

        const list = (Supportplanlists.list || []).map(item => {
            return {
                ...item,
                edit: <Link to={`/Supportplanlists/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
                delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                    handleSelectedSupportplanlist(item)
                    handleDeletemodal(true)
                }} />
            }
        })

        return (
            isLoading  ? <LoadingPage /> :
                <React.Fragment>
                    <Pagewrapper>
                        <Headerwrapper>
                            <Grid columns='2' >
                                <GridColumn width={8}>
                                    <Breadcrumb size='big'>
                                        <Link to={"/Supportplanlists"}>
                                            <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                                        </Link>
                                    </Breadcrumb>
                                </GridColumn>
                                <Settings
                                    Profile={Profile}
                                    Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                                    Pagecreatelink={"/Supportplanlists/Create"}
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
                        {list.length > 0 ?
                            <div className='w-full mx-auto '>
                                {Profile.Ismobile ?
                                    <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                                    <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
                            </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
                        }
                    </Pagewrapper>
                    <SupportplanlistsDelete />
                </React.Fragment>
        )
    }

    expandSupportplans = (rowid) => {
        const prevData = this.state.supportplanStatus
        prevData.push(rowid)
        this.setState({ supportplanStatus: [...prevData] })
    }

    shrinkSupportplans = (rowid) => {
        const index = this.state.supportplanStatus.indexOf(rowid)
        const prevData = this.state.supportplanStatus
        if (index > -1) {
            prevData.splice(index, 1)
            this.setState({ supportplanStatus: [...prevData] })
        }
    }

    supportplanCellhandler = (row, freeze) => {
        const { Supportplans } = this.props
        const itemId = row?.Id
        const itemSupportplans = (row?.Supportplanuuids || []).map(u => { return (Supportplans.list || []).find(plan => plan.Uuid === u.PlanID) })
        const itemSupportplanstxt = itemSupportplans.map(u => u?.Name).join(',')
        if (freeze === true) {
            return itemSupportplanstxt
        }
        return itemSupportplanstxt.length - 35 > 20 ?
            (
                !this.state.supportplanStatus.includes(itemId) ?
                    [itemSupportplanstxt.slice(0, 35) + ' ...(' + itemSupportplans.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandSupportplans(itemId)}> ...Daha Fazla Göster</Link>] :
                    [itemSupportplanstxt, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkSupportplans(itemId)}> ...Daha Az Göster</Link>]
            ) : itemSupportplanstxt
    }

    departmentCellhandler = (value) => {
        const { Departments } = this.props
        if (Departments.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            return (Departments.list || []).find(u => u.Uuid === value)?.Name
        }
    }
}