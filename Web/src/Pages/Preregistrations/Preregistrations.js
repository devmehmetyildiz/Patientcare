import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon, Loader, Popup } from 'semantic-ui-react'
import { ROUTES } from '../../Utils/Constants'
import config from '../../Config'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
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
    const { GetPatients, GetWarehouses, GetCases,
      GetPatientdefines, GetRooms, GetBeds, GetFloors,
      GetFiles, GetPatientstocks, GetPatientstockmovements,
      GetStockdefines } = this.props
    GetPatients()
    GetWarehouses()
    GetCases()
    GetPatientdefines()
    GetRooms()
    GetBeds()
    GetFloors()
    GetFiles()
    GetPatientstocks()
    GetPatientstockmovements()
    GetStockdefines()
  }



  render() {

    const { Patients, Profile, handleSelectedPatient, Patientdefines, handleDeletemodal, handleCompletemodal, history } = this.props
    const { isLoading, isDispatching } = Patients

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.nameCellhandler(col) },
      { Header: Literals.Columns.CountryID[Profile.Language], accessor: 'PatientdefineID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.patientdefineCellhandler(col) },
      { Header: Literals.Columns.Registerdate[Profile.Language], accessor: 'Registerdate', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Approvaldate[Profile.Language], accessor: 'Approvaldate', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Case[Profile.Language], accessor: 'CaseID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.caseCellhandler(col) },
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
      }) : [],
      groupBy: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isGroup === true).map(item => {
        return item.key
      }) : [],
    };

    const list = (Patients.list || []).filter(u => u.Isactive).filter(u => u.Iswaitingactivation).map(item => {
      return {
        ...item,
        Filestxt: "",
        Stockstxt: "",
        actions: <React.Fragment key={Math.random()}>
          <Popup
            trigger={<Icon className='cursor-pointer' name='ellipsis vertical' />}
            content={<div className='flex flex-col justify-start items-start w-full gap-2'>
              <Link to={`/Preregistrations/${item.Uuid}/edit`} ><Icon color='black' className='row-edit' name='edit' /> {Literals.Columns.edit[Profile.Language]} </Link>
              <span className='text-[#4183c4] cursor-pointer' onClick={() => { history.push(`/Patientdefines/${(Patientdefines.list || []).find(u => u.Uuid === item.PatientdefineID)?.Uuid}/edit`, { redirectUrl: "/Preregistrations" }) }} ><Icon color='black' className='row-edit' name='clipboard' />{Literals.Columns.editDefine[Profile.Language]}</span>
              <Link to={`/Preregistrations/${item.Uuid}/Editfile`} ><Icon color='black' className='row-edit' name='folder open' /> {Literals.Columns.editFiles[Profile.Language]}</Link>
              <Link to={`/Preregistrations/${item.Uuid}/Editstock`} ><Icon color='black' className='row-edit' name='cart' /> {Literals.Columns.editStocks[Profile.Language]}</Link>
              <span className='text-[#4183c4] cursor-pointer'>  <Icon color='black' name='alternate trash' className='row-edit' onClick={() => {
                handleSelectedPatient(item)
                handleDeletemodal(true)
              }} /> {Literals.Columns.delete[Profile.Language]}</span>,
            </div>
            }
            on='click'
            hideOnScroll
            position='left center'
          />
        </React.Fragment >,
        enter: <Link to={`/Preregistrations/${item.Uuid}/Complete`} ><Icon size='large' color='black' className='row-edit' name='blind' /></Link>
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
                    <Link to={"/Preregistrations"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Preregistrations/Create"}
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
          <PreregistrationsDelete />
        </React.Fragment>
    )
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
    const { Files, Patientdefines } = this.props
    const patient = col.row.original
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
    let file = (Files.list || []).filter(u => u.ParentID === patient?.Uuid).find(u => u.Usagetype === 'PP')
    return <div className='flex justify-center items-center flex-row flex-nowrap whitespace-nowrap'>{file ? <img alt='pp' src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${file?.Uuid}`} className="rounded-full" style={{ width: '40px', height: '40px' }} />
      : null}{patientdefine?.Firstname ? `${patientdefine?.Firstname} ${patientdefine?.Lastname}` : `${patientdefine?.CountryID}`}</div>
  }

  dateCellhandler = (col) => {
    if (col.value) {
      return col.value.split('T')[0]
    }
    return null
  }

  stockCellhandler = (col) => {

    const { Patientstocks, Stockdefines } = this.props

    const itemId = col?.row?.original?.Uuid
    const itemStocks = (Patientstocks.list || []).filter(u => u.PatientID === itemId)
    let stockstext = (itemStocks || []).map((stock) => {
      return (Stockdefines.list || []).find(u => u.Uuid === stock.StockdefineID)?.Name
    }).join(", ")

    if (!col.cell.isGrouped) {
      return stockstext.length - 35 > 20 ?
        (
          !this.state.stocksStatus.includes(itemId) ?
            [stockstext.slice(0, 35) + ' ...(' + itemStocks.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandStocks(itemId)}> ...Daha Fazla Göster</Link>] :
            [stockstext, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkStocks(itemId)}> ...Daha Az Göster</Link>]
        ) : stockstext
    }
    return stockstext
  }

  filesCellhandler = (col) => {

    const { Files } = this.props
    const itemId = col?.row?.original?.Uuid
    const itemFiles = (Files.list || []).filter(u => u.ParentID === itemId)
    let filestext = (itemFiles || []).map((file) => {
      return file.Name;
    }).join(", ")

    if (!col.cell.isGrouped) {

      return filestext.length - 35 > 20 ?
        (
          !this.state.filesStatus.includes(itemId) ?
            [filestext.slice(0, 35) + ' ...(' + itemFiles.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandFiles(itemId)}> ...Daha Fazla Göster</Link>] :
            [filestext, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkFiles(itemId)}> ...Daha Az Göster</Link>]
        ) : filestext
    }
    return filestext
  }

  patientdefineCellhandler = (col) => {
    const { Patientdefines } = this.props
    if (Patientdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Patientdefines.list || []).find(u => u.Uuid === col.value)?.CountryID
    }
  }

  caseCellhandler = (col) => {
    const { Cases } = this.props
    if (Cases.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Cases.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }
}
