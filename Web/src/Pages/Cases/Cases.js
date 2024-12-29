import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import CasesDelete from '../../Containers/Cases/CasesDelete'
import { CASE_STATUS_COMPLETE, CASE_STATUS_DEACTIVE, CASE_STATUS_PASSIVE, CASE_STATUS_START, PATIENTMOVEMENTTYPE, PERSONEL_CASE_TYPE_ANNUALPERMIT, PERSONEL_CASE_TYPE_PASSIVE, PERSONEL_CASE_TYPE_PERMIT, PERSONEL_CASE_TYPE_START, PERSONEL_CASE_TYPE_WORK } from '../../Utils/Constants'
import {
  DataTable, Headerwrapper, LoadingPage,
  MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings
} from '../../Components'
import GetInitialconfig from '../../Utils/GetInitialconfig'

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

    const t = Profile?.i18n?.t

    const { isLoading } = Cases


    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Cases.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Cases.Column.Shortname'), accessor: 'Shortname', Subtitle: true },
      { Header: t('Pages.Cases.Column.CaseStatus'), accessor: row => this.casesstatusCellhandler(row?.CaseStatus) },
      { Header: t('Pages.Cases.Column.Casecolor'), accessor: 'Casecolor', Cell: col => this.casecolorCellhandler(col) },
      { Header: t('Pages.Cases.Column.Departments'), accessor: (row, freeze) => this.departmentCellhandler(row, freeze), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Cases.Column.Patientstatus'), accessor: row => this.patientmovementCellhandler(row?.Patientstatus) },
      { Header: t('Pages.Cases.Column.Personelstatus'), accessor: row => this.personelmovementCellhandler(row?.Personelstatus) },
      { Header: t('Pages.Cases.Column.Iscalculateprice'), accessor: row => this.boolCellhandler(row?.Iscalculateprice) },
      { Header: t('Pages.Cases.Column.Isroutinework'), accessor: row => this.boolCellhandler(row?.Isroutinework) },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "case"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Cases.list || []).filter(u => u.Isactive).map(item => {
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
      isLoading ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Cases"}>
                      <Breadcrumb.Section>{t('Pages.Cases.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Cases.Page.CreateHeader')}
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
              </div> : <NoDataScreen message={t('Common.NoDataFound')} />
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
    const t = Profile?.i18n?.t
    const casestatusOption = [
      {
        key: 0,
        text: t('Common.Cases.Type.Deactivate'),
        value: CASE_STATUS_DEACTIVE,
      },
      {
        key: 1,
        text: t('Common.Cases.Type.Passive'),
        value: CASE_STATUS_PASSIVE,
      },
      {
        key: 2,
        text: t('Common.Cases.Type.Complete'),
        value: CASE_STATUS_COMPLETE,
      },
      {
        key: 3,
        text: t('Common.Cases.Type.Start'),
        value: CASE_STATUS_START,
      },
    ]

    return casestatusOption.find(u => u.value === value) ? casestatusOption.find(u => u.value === value).text : ''
  }

  casecolorCellhandler = (col) => {
    if (col.value) {
      return <div className='flex flex-row justify-start items-center gap-2'>
        {col.value}
        <div>
          <Icon style={{ color: col.value }} name='circle' />
        </div>
      </div>
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
    const t = Profile?.i18n?.t
    return value !== null && (value ? t('Common.Yes') : t('Common.No'))
  }

  patientmovementCellhandler = (value) => {
    return PATIENTMOVEMENTTYPE.find(u => u.value === value) ? PATIENTMOVEMENTTYPE.find(u => u.value === value).Name : value
  }
  personelmovementCellhandler = (value) => {
    const { Profile } = this.props
    const t = Profile?.i18n?.t
    const personelstatusOption = [
      {
        key: 0,
        text: t('Common.Cases.Personel.Type.Passive'),
        value: PERSONEL_CASE_TYPE_PASSIVE,
      },
      {
        key: 1,
        text: t('Common.Cases.Personel.Type.Start'),
        value: PERSONEL_CASE_TYPE_START,
      },
      {
        key: 2,
        text: t('Common.Cases.Personel.Type.Work'),
        value: PERSONEL_CASE_TYPE_WORK,
      },
      {
        key: 3,
        text: t('Common.Cases.Personel.Type.Permit'),
        value: PERSONEL_CASE_TYPE_PERMIT,
      },
      {
        key: 4,
        text: t('Common.Cases.Personel.Type.Annualpermit'),
        value: PERSONEL_CASE_TYPE_ANNUALPERMIT,
      },
    ]
    return personelstatusOption.find(u => u.value === value) ? personelstatusOption.find(u => u.value === value).text : value
  }
}