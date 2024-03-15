import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import Literals from './Literals'
import CasesDelete from '../../Containers/Cases/CasesDelete'
import { PATIENTMOVEMENTTYPE, getInitialconfig } from '../../Utils/Constants'
import {
  DataTable, Headerwrapper, LoadingPage,
  MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings
} from '../../Components'

export default class Cases extends Component {

  constructor(props) {
    super(props)
    this.state = {
      departmentStatus: []
    }
  }


  componentDidMount() {
    const { GetCases, GetDepartments } = this.props
    GetCases()
    GetDepartments()
  }


  render() {


    const { Cases, Profile, handleSelectedCase, handleDeletemodal } = this.props
    const { isLoading} = Cases


    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', Title: true },
      { Header: Literals.Columns.Shortname[Profile.Language], accessor: 'Shortname', Subtitle: true },
      { Header: Literals.Columns.CaseStatus[Profile.Language], accessor: row => this.casesstatusCellhandler(row?.CaseStatus) },
      { Header: Literals.Columns.Casecolor[Profile.Language], accessor: 'Casecolor', Cell: col => this.casecolorCellhandler(col) },
      { Header: Literals.Columns.Departmentstxt[Profile.Language], accessor: (row, freeze) => this.departmentCellhandler(row, freeze), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Patientstatus[Profile.Language], accessor: row => this.movementCellhandler(row?.Patientstatus) },
      { Header: Literals.Columns.Iscalculateprice[Profile.Language], accessor: row => this.boolCellhandler(row?.Iscalculateprice) },
      { Header: Literals.Columns.Isroutinework[Profile.Language], accessor: row => this.boolCellhandler(row?.Isroutinework) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Cases"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Cases.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Cases/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedCase(item)
          handleDeletemodal(true)
        }} />,
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
                    <Link to={"/Cases"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Cases/Create"}
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
              </div> : <NoDataScreen message={Literals.Messages.Nocasefind[Profile.Language]} />
            }
          </Pagewrapper>
          <CasesDelete />
        </React.Fragment >
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

  casesstatusCellhandler = (value) => {
    const { Profile } = this.props
    const casestatusOption = [
      {
        key: '-1',
        text: Literals.Options.caseStatusoption.value0[Profile.Language],
        value: -1,
      },
      {
        key: '0',
        text: Literals.Options.caseStatusoption.value1[Profile.Language],
        value: 0,
      },
      {
        key: '1',
        text: Literals.Options.caseStatusoption.value2[Profile.Language],
        value: 1,
      },
      {
        key: '2',
        text: Literals.Options.caseStatusoption.value3[Profile.Language],
        value: 2,
      },
    ]

    return casestatusOption.find(u => u.value === value) ? casestatusOption.find(u => u.value === value).text : ''
  }

  casecolorCellhandler = (col) => {
    if (col.value) {
      return <div className='flex flex-row justify-center items-center text-center'><p className='m-0 p-0'>{col.value}</p><Icon style={{ color: col.value }} className="ml-2" name='circle' /></div>
    }
    return null
  }

  departmentCellhandler = (row, freeze) => {

    const { Departments } = this.props
    const itemId = row?.Id
    const itemDepartments = (row.Departmentuuids || []).map(u => { return (Departments.list || []).find(department => department.Uuid === u.DepartmentID) })
    const itemDepartmentstxt = (itemDepartments || []).map(u => u?.Name).join(',')
    if (freeze === true) {
      return itemDepartmentstxt
    }
    return itemDepartmentstxt.length - 35 > 20 ?
      (
        !this.state.departmentStatus.includes(itemId) ?
          [itemDepartmentstxt.slice(0, 35) + ' ...(' + itemDepartments.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandDepartments(itemId)}> ...Daha Fazla Göster</Link>] :
          [itemDepartmentstxt, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkDepartments(itemId)}> ...Daha Az Göster</Link>]
      ) : itemDepartmentstxt
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    return value !== null && (value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }

  movementCellhandler = (value) => {
    return PATIENTMOVEMENTTYPE.find(u => u.value === value) ? PATIENTMOVEMENTTYPE.find(u => u.value === value).Name : value
  }
}