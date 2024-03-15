import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import UsersDelete from '../../Containers/Users/UsersDelete'
import { getInitialconfig, getSidebarroutes } from '../../Utils/Constants'
import validator from '../../Utils/Validator'
export default class Users extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedrecord: {},
      rolesStatus: [],
      departmentsStatus: [],
    }
  }

  componentDidMount() {
    const { GetUsers, GetRoles, GetDepartments, GetProfessions } = this.props
    GetUsers()
    GetRoles()
    GetDepartments()
    GetProfessions()
  }

  render() {
    const { Users, Profile, handleDeletemodal, handleSelectedUser, } = this.props
    const { isLoading } = Users

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', },
      { Header: Literals.Columns.Username[Profile.Language], accessor: 'Username', Title: true },
      { Header: Literals.Columns.Email[Profile.Language], accessor: 'Email', Subheader: true, Subtitle: true },
      { Header: Literals.Columns.EmailConfirmed[Profile.Language], accessor: 'EmailConfirmed', },
      { Header: Literals.Columns.AccessFailedCount[Profile.Language], accessor: 'AccessFailedCount', },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', },
      { Header: Literals.Columns.Surname[Profile.Language], accessor: 'Surname', },
      { Header: Literals.Columns.Language[Profile.Language], accessor: 'Language', },
      { Header: Literals.Columns.UserID[Profile.Language], accessor: 'UserID', },
      { Header: Literals.Columns.Defaultdepartment[Profile.Language], accessor: 'Defaultdepartment', },
      { Header: Literals.Columns.Departments[Profile.Language], accessor: row => this.departmentCellhandler(row), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Roles[Profile.Language], accessor: row => this.rolesCellhandler(row) },
      { Header: Literals.Columns.Profession[Profile.Language], accessor: row => this.professionCellhandler(row?.ProfessionID) },
      { Header: Literals.Columns.Includeshift[Profile.Language], accessor: row => this.boolCellhandler(row?.Includeshift) },
      { Header: Literals.Columns.Defaultpage[Profile.Language], accessor: row => this.pageCellhandler(row?.Defaultpage) },
      { Header: Literals.Columns.CountryID[Profile.Language], accessor: 'CountryID' },
      { Header: Literals.Columns.Workstarttime[Profile.Language], accessor: row => this.dateCellhandler(row?.Workstarttime) },
      { Header: Literals.Columns.Workendtime[Profile.Language], accessor: row => this.dateCellhandler(row?.Workendtime) },
      { Header: Literals.Columns.Gender[Profile.Language], accessor: row => this.genderCellhandler(row?.Gender) },
      { Header: Literals.Columns.Phonenumber[Profile.Language], accessor: 'Phonenumber', },
      { Header: Literals.Columns.Adress[Profile.Language], accessor: 'Adress', },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Users"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Users.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Users/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedUser(item)
          handleDeletemodal(true)
        }} />
      }
    })

    return (
      isLoading ? <LoadingPage /> :
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

  rolesCellhandler = (row) => {

    const { Roles } = this.props

    const itemId = row?.Id
    const itemRoles = (row.Roleuuids || []).map(u => { return (Roles.list || []).find(role => role.Uuid === u.RoleID) })
    const itemRolestxt = itemRoles.map(u => u?.Name).join(',')
    return itemRolestxt.length - 35 > 20 ?
      (
        !this.state.rolesStatus.includes(itemId) ?
          [itemRolestxt.slice(0, 35) + ' ...(' + itemRoles.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandRoles(itemId)}> ...Daha Fazla Göster</Link>] :
          [itemRolestxt, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkRoles(itemId)}> ...Daha Az Göster</Link>]
      ) : itemRolestxt
  }

  pageCellhandler = (value) => {
    const { Profile } = this.props
    const Sidebaroption = (getSidebarroutes(Profile) || []).flatMap(section => {
      return section.items.filter(u => u.permission)
    }).map(item => {
      return { text: item.subtitle, value: item.url, key: item.subtitle }
    })
    return (Sidebaroption || []).find(u => u?.value === value)?.text || ''
  }

  departmentCellhandler = (row) => {
    const { Departments } = this.props

    const itemId = row?.Id
    const itemDepartments = (row.Departmentuuids || []).map(u => { return (Departments.list || []).find(department => department.Uuid === u.DepartmentID) })
    const itemDepartmentstxt = itemDepartments.map(u => u?.Name).join(',')
    return itemDepartmentstxt.length - 35 > 20 ?
      (
        !this.state.departmentsStatus.includes(itemId) ?
          [itemDepartmentstxt.slice(0, 35) + ' ...(' + itemDepartments.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandDepartments(itemId)}> ...Daha Fazla Göster</Link>] :
          [itemDepartmentstxt, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkDepartments(itemId)}> ...Daha Az Göster</Link>]
      ) : itemDepartmentstxt
  }

  professionCellhandler = (value) => {
    const { Professions } = this.props
    if (Professions.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Professions.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    return validator.isBoolean(value) ? (value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language]) : Literals.Messages.No[Profile.Language]
  }

  dateCellhandler = (value) => {
    console.log('value: ', value);
    if (value) {
      return value.split('T').length > 0 ? value.split('T')[0] : value
    }
    return null
  }

  genderCellhandler = (value) => {
    const { Profile } = this.props
    const Genderoptions = [
      { key: 0, text: Literals.Options.Genderoptions.value0[Profile.Language], value: "0" },
      { key: 1, text: Literals.Options.Genderoptions.value1[Profile.Language], value: "1" }
    ]
    return Genderoptions.find(u => u.value === value)?.text || value
  }
}
