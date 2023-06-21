import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Icon, Modal, Popup } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn, Header } from 'semantic-ui-react'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import { ROUTES } from '../../Utils/Constants'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import PreregistrationsComplete from './PreregistrationsComplete'
import Notification from '../../Utils/Notification'
import config from '../../Config'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import PreregistrationsDelete from '../../Containers/Preregistrations/PreregistrationsDelete'

export default class Preregistrations extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedrecord: {},
      stocksStatus: [],
      filesStatus: [],
    }
  }

  componentDidMount() {
    const { Getpreregistrations, GetWarehouses } = this.props
    Getpreregistrations()
    GetWarehouses()
  }

  componentDidUpdate() {
    const { Patients, removePatientnotification, Warehouses, removeWarehousenotification } = this.props
    Notification(Patients.notifications, removePatientnotification)
    Notification(Warehouses.notifications, removeWarehousenotification)
  }

  render() {

    const { Patients, Warehouses, DeletePatients, removePatientnotification, Profile, history, fillPatientnotification, CompletePrepatients } = this.props
    const { isLoading, isDispatching } = Patients

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.nameCellhandler(col) },
      { Header: Literals.Columns.CountryID[Profile.Language], accessor: 'Patientdefine.CountryID', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Registerdate[Profile.Language], accessor: 'Registerdate', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Approvaldate[Profile.Language], accessor: 'Approvaldate', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Case[Profile.Language], accessor: 'Case.Name', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Stocks[Profile.Language], accessor: 'Stockstxt', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.stockCellhandler(col) },
      { Header: Literals.Columns.Files[Profile.Language], accessor: 'Filestxt', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.filesCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.enter[Profile.Language], accessor: 'enter', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.actions[Profile.Language], accessor: 'actions', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }
    ]

    const metaKey = "Preregistrations"
    let tableMeta = (Profile.tablemeta || []).find(u => u.Meta === metaKey)
    const initialConfig = {
      hiddenColumns: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isVisible === false).map(item => {
        return item.key
      }) : ["Uuid", "Createduser", "Updateduser", "Createtime", "Updatetime"],
      columnOrder: tableMeta ? JSON.parse(tableMeta.Config).sort((a, b) => a.order - b.order).map(item => {
        return item.key
      }) : []
    };

    const list = (Patients.list || []).map(item => {
      let filestext = item.Files.map((file) => {
        return file.Name;
      }).join(", ")
      let stockstext = item.Stocks.map((stock) => {
        return stock.Stockdefine?.Name;
      }).join(", ")
      return {
        ...item,
        Filestxt: filestext,
        Stockstxt: stockstext,
        actions: <React.Fragment>
          <Popup
            trigger={<Icon className='cursor-pointer' name='ellipsis vertical' />}
            content={<div className='flex flex-col justify-start items-start w-full gap-2'>
              <Link to={`/Preregistrations/${item.Uuid}/edit`} ><Icon className='row-edit' name='edit' /> {Literals.Columns.edit[Profile.Language]} </Link>
              <Link to={`/Patientdefines/${item.Patientdefine?.Uuid}/edit`} ><Icon color='black' className='row-edit' name='clipboard' />{Literals.Columns.editDefine[Profile.Language]}</Link>
              <Link to={`/Preregistrations/${item.Uuid}/Editfile`} ><Icon color='black' className='row-edit' name='folder open' /> {Literals.Columns.editFiles[Profile.Language]}</Link>
              <Link to={`/Preregistrations/${item.Uuid}/Editstock`} ><Icon color='black' className='row-edit' name='cart' /> {Literals.Columns.editStocks[Profile.Language]}</Link>
              <span><Icon link color='red' name='alternate trash' onClick={() => { this.setState({ selectedrecord: item, open: true }) }} /> {Literals.Columns.delete[Profile.Language]}</span>
            </div>}
            on='click'
            hideOnScroll
            position='left center'
          />
        </React.Fragment>,
        enter: <React.Fragment>
          <PreregistrationsComplete Warehouseslist={Warehouses.list} data={item} history={history} CompletePrepatients={CompletePrepatients} fillPatientnotification={fillPatientnotification} removePatientnotification={removePatientnotification} />
        </React.Fragment>
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
                    <Link to={"/Preregistrations"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <GridColumn width={8} >
                  <Link to={"/Preregistrations/Create"}>
                    <Button color='blue' floated='right' className='list-right-green-button'>
                      {Literals.Page.Pagecreateheader[Profile.Language]}
                    </Button>
                  </Link>
                  <ColumnChooser meta={Profile.tablemeta} columns={Columns} metaKey={metaKey} />
                </GridColumn>
              </Grid>
            </Headerwrapper>
            <Pagedivider />
            {list.length > 0 ?
              <div className='w-full mx-auto '>
                <DataTable Columns={Columns} Data={list} Config={initialConfig} />
              </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
            }
          </Pagewrapper>
          <PreregistrationsDelete />
        </React.Fragment>
    )
  }

  handleChangeModal = (value) => {
    this.setState({ modal: value })
  }

  expandStocks = (rowid) => {
    const prevData = this.state.stocksStatus
    prevData.push(rowid)
    this.setState({ stocksStatus: [...prevData] })
  }

  shrinkStocks = (rowid) => {
    const index = this.state.stocksStatus.indexOf(rowid)
    const prevData = this.state.stocksStatus
    if (index > -1) {
      prevData.splice(index, 1)
      this.setState({ stocksStatus: [...prevData] })
    }
  }
  expandFiles = (rowid) => {
    const prevData = this.state.filesStatus
    prevData.push(rowid)
    this.setState({ filesStatus: [...prevData] })
  }

  shrinkFiles = (rowid) => {
    const index = this.state.filesStatus.indexOf(rowid)
    const prevData = this.state.filesStatus
    if (index > -1) {
      prevData.splice(index, 1)
      this.setState({ filesStatus: [...prevData] })
    }
  }

  nameCellhandler = (col) => {
    const patient = col.row.original
    let file = patient.Files.find(u => u.Usagetype === 'PP')
    return <div className='flex justify-center items-center flex-row flex-nowrap whitespace-nowrap'>{file ? <img alt='pp' src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${file.Uuid}`} className="rounded-full" style={{ width: '40px', height: '40px' }} />
      : null}{`${patient?.Patientdefine?.Firstname} ${patient?.Patientdefine?.Lastname}`}</div>
  }

  dateCellhandler = (col) => {
    if (col.value) {
      return col.value.split('T')[0]
    }
    return null
  }

  stockCellhandler = (col) => {
    if (col.value) {
      if (!col.cell.isGrouped) {
        const itemId = col.row.original.Id
        const itemStocks = col.row.original.Stocks
        return col.value.length - 35 > 20 ?
          (
            !this.state.stocksStatus.includes(itemId) ?
              [col.value.slice(0, 35) + ' ...(' + itemStocks.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandStocks(itemId)}> ...Daha Fazla Göster</Link>] :
              [col.value, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkStocks(itemId)}> ...Daha Az Göster</Link>]
          ) : col.value
      }
      return col.value
    }
    return null
  }

  filesCellhandler = (col) => {
    if (col.value) {
      if (!col.cell.isGrouped) {
        const itemId = col.row.original.Id
        const itemFiles = col.row.original.Files
        return col.value.length - 35 > 20 ?
          (
            !this.state.filesStatus.includes(itemId) ?
              [col.value.slice(0, 35) + ' ...(' + itemFiles.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandFiles(itemId)}> ...Daha Fazla Göster</Link>] :
              [col.value, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkFiles(itemId)}> ...Daha Az Göster</Link>]
          ) : col.value
      }
      return col.value
    }
    return null
  }
}