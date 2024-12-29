import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import CostumertypesDelete from "../../Containers/Costumertypes/CostumertypesDelete"
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
export default class Costumertypes extends Component {

  constructor(props) {
    super(props)
    this.state = {
      departmentStatus: []
    }
  }

  componentDidMount() {
    const { GetCostumertypes, GetDepartments } = this.props
    GetCostumertypes()
    GetDepartments()
  }

  render() {

    const { Costumertypes, Departments, Profile, handleSelectedCostumertype, handleDeletemodal } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Costumertypes

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Costumertypes.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Costumertypes.Column.Department'), accessor: row => this.departmentCellhandler(row), Lowtitle: true, Withtext: true },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "costumertype"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Costumertypes.list || []).filter(u => u.Isactive).map(item => {
      var text = (item.Departmentuuids || []).map(u => {
        return (Departments.list || []).find(department => department.Uuid === u.DepartmentID)?.Name
      }).join(", ")

      return {
        ...item,
        Departmentstxt: text,
        edit: <Link to={`/Costumertypes/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedCostumertype(item)
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
                <GridColumn width={8} >
                  <Breadcrumb size='big'>
                    <Link to={"/Costumertypes"}>
                      <Breadcrumb.Section>{t('Pages.Costumertypes.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Costumertypes.Page.CreateHeader')}
                  Pagecreatelink={"/Costumertypes/Create"}
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
          <CostumertypesDelete />
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

  departmentCellhandler = (row) => {

    const { Departments, Profile } = this.props

    const itemId = row?.Id
    const itemDepartments = (row.Departmentuuids || []).map(u => { return (Departments.list || []).find(department => department.Uuid === u.DepartmentID) })
    const itemDepartmentstxt = itemDepartments.map(u => u?.Name).join(',')
    return itemDepartmentstxt.length - 35 > 20 ?
      (
        !this.state.departmentStatus.includes(itemId) ?
          [itemDepartmentstxt.slice(0, 35) + ' ...(' + itemDepartments.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandDepartments(itemId)}> ...Daha Fazla Göster</Link>] :
          [itemDepartmentstxt, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkDepartments(itemId)}> ...Daha Az Göster</Link>]
      ) : itemDepartmentstxt
  }
}