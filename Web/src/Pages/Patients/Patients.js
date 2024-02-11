import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon, Loader } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import { ROUTES, getInitialconfig } from '../../Utils/Constants'
import config from '../../Config'
export default class Patients extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedrecord: {},
      stocksStatus: [],
      filesStatus: [],
      collapseStatus: []
    }
  }


  componentDidMount() {
    const {
      GetPatients,
      GetPatientdefines,
      GetRooms,
      GetBeds,
      GetFloors,
      GetCases,
      GetFiles,
      GetPatientstocks,
      GetStockdefines,
      GetUsagetypes
    } = this.props
    GetPatients()
    GetPatientdefines()
    GetRooms()
    GetBeds()
    GetFloors()
    GetCases()
    GetFiles()
    GetPatientstocks()
    GetUsagetypes()
    GetStockdefines()
  }


  render() {
    const { Patients, Profile } = this.props
    const { isLoading, isDispatching } = Patients

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Name[Profile.Language], accessor: row => this.nameCellhandler(row), Cell: (col, row) => this.imageCellhandler(col, row), Title: true },
      { Header: Literals.Columns.Registerdate[Profile.Language], accessor: row => this.dateCellhandler(row?.Registerdate) },
      { Header: Literals.Columns.Approvaldate[Profile.Language], accessor: row => this.dateCellhandler(row?.Approvaldate) },
      { Header: Literals.Columns.Floor[Profile.Language], accessor: row => this.floorCellhandler(row?.FloorID), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Room[Profile.Language], accessor: row => this.roomCellhandler(row?.RoomID), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Bed[Profile.Language], accessor: row => this.bedCellhandler(row?.BedID), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Case[Profile.Language], accessor: row => this.caseCellhandler(row?.CaseID), Subtitle: true },
      { Header: Literals.Columns.Stocks[Profile.Language], accessor: row => this.stockCellhandler(row) },
      { Header: Literals.Columns.Files[Profile.Language], accessor: row => this.filesCellhandler(row) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.actions[Profile.Language], accessor: 'actions', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Patients"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Patients.list || []).filter(u => !u.Iswaitingactivation).map(item => {
      return {
        ...item,
        Filestxt: '',
        Stockstxt: '',
        actions: <Link to={`/Patients/${item.Uuid}`} ><Icon size='large' color='blue' className='row-edit' name='magnify' /> </Link>
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
                    <Link to={"/Patients"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Patients/Create"}
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
        </React.Fragment >
    )
  }

  handleCollapstatus = (floorID) => {
    const isHave = this.state.collapseStatus.includes(floorID)
    if (isHave) {
      let previous = this.state.collapseStatus.filter(u => u !== floorID)
      this.setState({ collapseStatus: previous })
    } else {
      let previous = this.state.collapseStatus
      previous.push(floorID)
      this.setState({ collapseStatus: previous })
    }
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const items = [...this.state.activeIndex]
    if (items.includes(index)) {
      const x = items.filter(item => item !== index);
      this.setState({ activeIndex: x })
    } else {
      items.push(index)
      this.setState({ activeIndex: items })
    }
  }

  nameCellhandler = (row) => {
    const { Patientdefines } = this.props
    const patient = row
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
    return `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`
  }

  imageCellhandler = (col, row) => {
    const { Files, Patientdefines, Usagetypes } = this.props
    const patient = col?.row?.original || row
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
    let usagetypePP = (Usagetypes.list || []).find(u => u.Value === 'PP')?.Uuid || null
    let file = (Files.list || []).filter(u => u.ParentID === patient?.Uuid).find(u => (((u.Usagetype || '').split(',')) || []).includes(usagetypePP))
    return <div className='flex justify-center items-center flex-row flex-nowrap whitespace-nowrap'>
      {file
        ? <img alt='pp' src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${file?.Uuid}`} className="rounded-full" style={{ width: '40px', height: '40px' }} />
        : null}
      {patientdefine?.Firstname ? `${patientdefine?.Firstname} ${patientdefine?.Lastname}` : `${patientdefine?.CountryID}`}
    </div>
  }

  floorCellhandler = (value) => {
    const { Floors } = this.props
    if (Floors.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return `${(Floors.list || []).find(u => u.Uuid === value)?.Name}`
    }
  }

  roomCellhandler = (value) => {
    const { Rooms } = this.props
    if (Rooms.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return `${(Rooms.list || []).find(u => u.Uuid === value)?.Name}`
    }
  }

  bedCellhandler = (value) => {
    const { Beds } = this.props
    if (Beds.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return `${(Beds.list || []).find(u => u.Uuid === value)?.Name}`
    }
  }

  caseCellhandler = (value) => {
    const { Cases } = this.props
    if (Cases.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return `${(Cases.list || []).find(u => u.Uuid === value)?.Name}`
    }
  }

  dateCellhandler = (value) => {
    if (value) {
      return value.split('T')[0]
    }
    return null
  }

  stockCellhandler = (row) => {

    const { Patientstocks, Stockdefines } = this.props

    const itemId = row?.Uuid
    const itemStocks = (Patientstocks.list || []).filter(u => u.PatientID === itemId)
    let stockstext = (itemStocks || []).map((stock) => {
      return (Stockdefines.list || []).find(u => u.Uuid === stock.StockdefineID)?.Name
    }).join(", ")

    return stockstext.length - 35 > 20 ?
      (
        !this.state.stocksStatus.includes(itemId) ?
          [stockstext.slice(0, 35) + ' ...(' + itemStocks.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandStocks(itemId)}> ...Daha Fazla Göster</Link>] :
          [stockstext, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkStocks(itemId)}> ...Daha Az Göster</Link>]
      ) : stockstext
  }

  filesCellhandler = (row) => {

    const { Files } = this.props
    const itemId = row?.Uuid
    const itemFiles = (Files.list || []).filter(u => u.ParentID === itemId)
    let filestext = (itemFiles || []).map((file) => {
      return file.Name;
    }).join(", ")

    return filestext.length - 35 > 20 ?
      (
        !this.state.filesStatus.includes(itemId) ?
          [filestext.slice(0, 35) + ' ...(' + itemFiles.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandFiles(itemId)}> ...Daha Fazla Göster</Link>] :
          [filestext, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkFiles(itemId)}> ...Daha Az Göster</Link>]
      ) : filestext
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

  /*   generatePDF = (html) => {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16 // or "smart", default is 16
      });
      pdf.addFont(myTurkishFont, 'AbhayaLibre-Medium', 'normal');
      pdf.setFont('AbhayaLibre-Medium');
      const options = {
        callback: () => {
          pdf.save("download.pdf");
        }
      };
      // Convert the HTML element to PDF with the specified options
      pdf.html(html, options);
    }
   */

}

