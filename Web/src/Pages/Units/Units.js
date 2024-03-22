import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import UnitsDelete from '../../Containers/Units/UnitsDelete'
import { getInitialconfig } from '../../Utils/Constants'
export default class Units extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedrecord: {},
      departmentStatus: []
    }
  }


  componentDidMount() {
    const { GetUnits, GetDepartments } = this.props
    GetUnits()
    GetDepartments()
  }

  render() {



    const { Units, Profile, handleDeletemodal, handleSelectedUnit } = this.props
    const { isLoading } = Units

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', Title: true },
      { Header: Literals.Columns.Unittype[Profile.Language], accessor: row => this.unittypeCellhandler(row?.Unittype), Subtitle: true, Withtext: true, },
      { Header: Literals.Columns.Department[Profile.Language], accessor: (row, freeze) => this.departmentCellhandler(row, freeze) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "unit"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Units.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Units/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedUnit(item)
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
                    <Link to={"/Units"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Units/Create"}
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
          <UnitsDelete />
        </React.Fragment>
    )
  }

  expandDepartments = (rowid) => {
    const prevData = this.state.departmentStatus
    prevData.push(rowid)
    this.setState({ departmentStatus: [...prevData] })
  }

  shrinkDepartments = (rowid) => {
    const index = this.state.departmentStatus.indexOf(rowid)
    const prevData = this.state.departmentStatus
    if (index > -1) {
      prevData.splice(index, 1)
      this.setState({ departmentStatus: [...prevData] })
    }
  }

  departmentCellhandler = (row, freeze) => {
    const { Departments } = this.props
    const itemId = row?.Id
    const itemDepartments = (row.Departmentuuids || []).map(u => { return (Departments.list || []).find(departmen => departmen.Uuid === u.DepartmentID) })
    const itemDepartmentstxt = itemDepartments.map(u => u?.Name).join(',')
    if (freeze) {
      return itemDepartmentstxt
    }
    return itemDepartmentstxt.length - 35 > 20 ?
      (
        !this.state.departmentStatus.includes(itemId) ?
          [itemDepartmentstxt.slice(0, 35) + ' ...(' + itemDepartments.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandDepartments(itemId)}> ...Daha Fazla Göster</Link>] :
          [itemDepartmentstxt, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkDepartments(itemId)}> ...Daha Az Göster</Link>]
      ) : itemDepartmentstxt
  }

  unittypeCellhandler = (value) => {
    const unitstatusOption = [
      {
        key: '0',
        text: 'Number',
        value: 0,
      },
      {
        key: '1',
        text: 'String',
        value: 1,
      }
    ]
    return unitstatusOption.find(u => u.value === value) ? unitstatusOption.find(u => u.value === value).text : (value ? "tanımsız" : '')
  }
}

