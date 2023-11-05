import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn } from 'semantic-ui-react'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Notification from '../../Utils/Notification'
import Literals from './Literals'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import DepartmentDelete from "../../Containers/Departments/DepartmentsDelete"
import Settings from '../../Common/Settings'
import MobileTable from '../../Utils/MobileTable'
export class Departments extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedrecord: {},
      stationsStatus: []
    }
  }


  componentDidMount() {
    const { GetDepartments, GetStations } = this.props
    GetDepartments()
    GetStations()
  }

  componentDidUpdate() {
    const { Departments, Stations, removeStationnotification, removeDepartmentnotification } = this.props
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Stations.notifications, removeStationnotification)
  }

  render() {

    const { Departments, Stations, Profile, handleSelectedDepartment, handleDeletemodal } = this.props
    const { isLoading, isDispatching } = Departments

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', sortable: true, canGroupBy: true, canFilter: true, Firstheader: true },
      { Header: Literals.Columns.stationstxt[Profile.Language], accessor: 'Stationstxt', sortable: true, canGroupBy: true, Subheader: true, canFilter: true, isOpen: false, Cell: col => this.stationCellhandler(col) },
      { Header: Literals.Columns.Ishavepatients[Profile.Language], accessor: 'Ishavepatients', sortable: true, canGroupBy: true, Finalheader: true, canFilter: true, isOpen: false, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

    const metaKey = "Departments"
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

    const list = (Departments.list || []).map(item => {
      var text = (item.Stationuuids || []).map(u => {
        return (Stations.list || []).find(station => station.Uuid === u.StationID)?.Name
      }).join(", ")
      return {
        ...item,
        Stationstxt: text,
        edit: <Link to={`/Departments/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedDepartment(item)
          handleDeletemodal(true)
        }} />,
      }

    })

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8} className="">
                  <Breadcrumb size='big'>
                    <Link to={"/Departments"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Departments/Create"}
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
                  Showcreatebutton
                  Showcolumnchooser
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
          <DepartmentDelete />
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

  stationCellhandler = (col) => {

    const { Stations, Profile } = this.props

    if (col.value) {
      if (!col.cell?.isGrouped && !Profile.Ismobile) {
        const itemId = col.row.original.Id
        const itemStations = (col.row.original.Stationuuids || []).map(u => { return (Stations.list || []).find(station => station.Uuid === u.StationID) })
        return col.value.length - 35 > 20 ?
          (
            !this.state.stationsStatus.includes(itemId) ?
              [col.value.slice(0, 35) + ' ...(' + itemStations.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandStations(itemId)}> ...Daha Fazla Göster</Link>] :
              [col.value, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkStations(itemId)}> ...Daha Az Göster</Link>]
          ) : col.value
      }
      return col.value
    }
    return null
  }

  boolCellhandler = (col) => {
    return col.value !== null && (col.value === 1 ? "EVET" : "HAYIR")
  }
}
export default Departments