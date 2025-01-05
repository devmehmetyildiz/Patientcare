import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import UnitsDelete from '../../Containers/Units/UnitsDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'
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

    const t = Profile?.i18n?.t

    const { isLoading } = Units

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Units.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Units.Column.Unittype'), accessor: row => this.unittypeCellhandler(row?.Unittype), Subtitle: true, Withtext: true, },
      { Header: t('Pages.Units.Column.Department'), accessor: (row, freeze) => this.departmentCellhandler(row, freeze) },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "unit"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Units.list || []).filter(u => u.Isactive).map(item => {
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
      <React.Fragment>
        <Pagewrapper dimmer isLoading={isLoading}>
          <Headerwrapper>
            <Grid columns='2' >
              <GridColumn width={8}>
                <Breadcrumb size='big'>
                  <Link to={"/Units"}>
                    <Breadcrumb.Section>{t('Pages.Units.Page.Header')}</Breadcrumb.Section>
                  </Link>
                </Breadcrumb>
              </GridColumn>
              <Settings
                Profile={Profile}
                Pagecreateheader={t('Pages.Units.Page.CreateHeader')}
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
            </div> : <NoDataScreen message={t('Common.NoDataFound')} />
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

