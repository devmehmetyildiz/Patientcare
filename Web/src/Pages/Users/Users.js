import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import UsersDelete from '../../Containers/Users/UsersDelete'
export default class Users extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedrecord: {},
      stationsStatus: [],
      rolesStatus: [],
      departmentsStatus: [],
    }
  }

  componentDidMount() {
    const { GetUsers, GetRoles, GetStations, GetDepartments } = this.props
    GetUsers()
    GetRoles()
    GetStations()
    GetDepartments()
  }

  render() {
    const { Users, Profile, handleDeletemodal, handleSelectedUser, Departments, Stations, Roles } = this.props
    const { isLoading, isDispatching } = Users

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Username[Profile.Language], accessor: 'Username', sortable: true, canGroupBy: true, canFilter: true, Firstheader: true },
      { Header: Literals.Columns.NormalizedUsername[Profile.Language], accessor: 'NormalizedUsername', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Email[Profile.Language], accessor: 'Email', sortable: true, canGroupBy: true, canFilter: true, Subheader: true },
      { Header: Literals.Columns.EmailConfirmed[Profile.Language], accessor: 'EmailConfirmed', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.AccessFailedCount[Profile.Language], accessor: 'AccessFailedCount', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Surname[Profile.Language], accessor: 'Surname', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.PhoneNumber[Profile.Language], accessor: 'PhoneNumber', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.PhoneNumberConfirmed[Profile.Language], accessor: 'PhoneNumberConfirmed', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.City[Profile.Language], accessor: 'City', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Town[Profile.Language], accessor: 'Town', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Address[Profile.Language], accessor: 'Address', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Language[Profile.Language], accessor: 'Language', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.UserID[Profile.Language], accessor: 'UserID', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Defaultdepartment[Profile.Language], accessor: 'Defaultdepartment', sortable: true, canGroupBy: true, canFilter: true, Finalheader: true },
      { Header: Literals.Columns.Stations[Profile.Language], accessor: 'Stationstxt', sortable: true, canGroupBy: true, canFilter: true, isOpen: false, Cell: col => this.stationCellhandler(col) },
      { Header: Literals.Columns.Departments[Profile.Language], accessor: 'Departmentstxt', sortable: true, canGroupBy: true, canFilter: true, isOpen: false, Cell: col => this.departmentCellhandler(col) },
      { Header: Literals.Columns.Roles[Profile.Language], accessor: 'Rolestxt', sortable: true, canGroupBy: true, canFilter: true, isOpen: false, Cell: col => this.rolesCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

    const metaKey = "Users"
    let tableMeta = (Profile.tablemeta || []).find(u => u.Meta === metaKey)
    const initialConfig = {
      hiddenColumns: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isVisible === false).map(item => {
        return item.key
      }) : ["Uuid", "Createduser", "Updateduser", "Createtime", "Updatetime"],
      columnOrder: tableMeta ? JSON.parse(tableMeta.Config).sort((a, b) => a.order - b.order).map(item => {
        return item.key
      }) : [],
      groupBy: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isGroup === true).map(item => {
        return item.key
      }) : [],
    };

    const list = (Users.list || []).map(item => {
      var rolestext = (item.Roleuuids || []).map(u => {
        return (Roles.list || []).find(role => role.Uuid === u.RoleID)?.Name
      }).join(", ")
      var stationtext = (item.Stationuuids || []).map(u => {
        return (Stations.list || []).find(station => station.Uuid === u.StationID)?.Name
      }).join(", ")
      var departmentext = (item.Departmentuuids || []).map(u => {
        return (Departments.list || []).find(department => department.Uuid === u.DepartmentID)?.Name
      }).join(", ")
      return {
        ...item,
        Stationstxt: stationtext,
        Rolestxt: rolestext,
        Departmentstxt: departmentext,
        edit: <Link to={`/Users/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedUser(item)
          handleDeletemodal(true)
        }} />
      }
    })

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Users"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Users/Create"}
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
          <UsersDelete />
        </React.Fragment>
    )
  }

  expandStations = (rowid) => {
    const prevData = this.state.stationsStatus
    prevData.push(rowid)
    this.setState({ stationsStatus: [...prevData] })
  }

  shrinkStations = (rowid) => {
    const index = this.state.stationsStatus.indexOf(rowid)
    const prevData = this.state.stationsStatus
    if (index > -1) {
      prevData.splice(index, 1)
      this.setState({ stationsStatus: [...prevData] })
    }
  }
  expandRoles = (rowid) => {
    const prevData = this.state.rolesStatus
    prevData.push(rowid)
    this.setState({ rolesStatus: [...prevData] })
  }

  shrinkRoles = (rowid) => {
    const index = this.state.rolesStatus.indexOf(rowid)
    const prevData = this.state.rolesStatus
    if (index > -1) {
      prevData.splice(index, 1)
      this.setState({ rolesStatus: [...prevData] })
    }
  }
  expandDepartments = (rowid) => {
    const prevData = this.state.rolesStatus
    prevData.push(rowid)
    this.setState({ rolesStatus: [...prevData] })
  }

  shrinkDepartments = (rowid) => {
    const index = this.state.departmentsStatus.indexOf(rowid)
    const prevData = this.state.departmentsStatus
    if (index > -1) {
      prevData.splice(index, 1)
      this.setState({ departmentsStatus: [...prevData] })
    }
  }

  rolesCellhandler = (col) => {

    const { Profile, Roles } = this.props

    if (col.value) {
      if (!col.cell?.isGrouped && !Profile.Ismobile) {
        const itemId = col?.row?.original?.Id
        const itemRoles = (col.row.original.Roleuuids || []).map(u => { return (Roles.list || []).find(role => role.Uuid === u.RoleID) })
        return col.value.length - 35 > 20 ?
          (
            !this.state.rolesStatus.includes(itemId) ?
              [col.value.slice(0, 35) + ' ...(' + itemRoles.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandRoles(itemId)}> ...Daha Fazla Göster</Link>] :
              [col.value, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkRoles(itemId)}> ...Daha Az Göster</Link>]
          ) : col.value
      }
      return col.value
    }
    return col.value
  }

  departmentCellhandler = (col) => {
    const { Profile, Departments } = this.props

    if (col.value) {
      if (!col.cell?.isGrouped && !Profile.Ismobile) {
        const itemId = col?.row?.original?.Id
        const itemDepartments = (col.row.original.Departmentuuids || []).map(u => { return (Departments.list || []).find(department => department.Uuid === u.DepartmentID) })
        return col.value.length - 35 > 20 ?
          (
            !this.state.departmentsStatus.includes(itemId) ?
              [col.value.slice(0, 35) + ' ...(' + itemDepartments.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandDepartments(itemId)}> ...Daha Fazla Göster</Link>] :
              [col.value, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkDepartments(itemId)}> ...Daha Az Göster</Link>]
          ) : col.value
      }
      return col.value
    }
    return col.value
  }

  stationCellhandler = (col) => {
    const { Profile, Stations } = this.props

    if (col.value) {
      if (!col.cell?.isGrouped && !Profile.Ismobile) {
        const itemId = col?.row?.original?.Id
        const itemStations = (col.row.original.Stationuuids || []).map(u => { return (Stations.list || []).find(station => station.Uuid === u.DepartmentID) })
        return col.value.length - 35 > 20 ?
          (
            !this.state.stationsStatus.includes(itemId) ?
              [col.value.slice(0, 35) + ' ...(' + itemStations.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandStations(itemId)}> ...Daha Fazla Göster</Link>] :
              [col.value, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkStations(itemId)}> ...Daha Az Göster</Link>]
          ) : col.value
      }
      return col.value
    }
    return col.value
  }

}
