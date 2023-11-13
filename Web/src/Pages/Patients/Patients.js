import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Accordion, Breadcrumb, Button, Card, Divider, Dropdown, Grid, GridColumn, GridRow, Header, Icon, Image, List, Loader, Modal, Popup, Segment, Tab, Table, Transition } from 'semantic-ui-react'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Notification from "../../Utils/Notification"
import InnerHTML from '../../Utils/DangerouslySetHtmlContent'
import PrintBodyReplacer from "../../Utils/PrintBodyReplacer"
import { ROUTES } from '../../Utils/Constants'
import jsPDF from 'jspdf';
import myTurkishFont from '../../Assets/fonts/AbhayaLibre-Medium.ttf';
import config from '../../Config'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Literals from './Literals'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import DataTable from '../../Utils/DataTable'
import { Collapse } from 'react-collapse';
import MobileTable from '../../Utils/MobileTable'
import Settings from '../../Common/Settings'

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
    } = this.props
    GetPatients()
    GetPatientdefines()
    GetRooms()
    GetBeds()
    GetFloors()
    GetCases()
    GetFiles()
    GetPatientstocks()
    GetStockdefines()
  }


  render() {
    const { Patients, Profile, Floors, Rooms, Patientdefines } = this.props
    const { isLoading, isDispatching } = Patients

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'PatientdefineID', sortable: true, canGroupBy: true, Firstheader: true, canFilter: true, Cell: col => this.patientdefineCellhandler(col) },
      { Header: Literals.Columns.Registerdate[Profile.Language], accessor: 'Registerdate', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Approvaldate[Profile.Language], accessor: 'Approvaldate', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Floor[Profile.Language], accessor: 'FloorID', sortable: true, canGroupBy: true, Subheader: true, canFilter: true, Cell: col => this.floorCellhandler(col) },
      { Header: Literals.Columns.Room[Profile.Language], accessor: 'RoomID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.roomCellhandler(col) },
      { Header: Literals.Columns.Bed[Profile.Language], accessor: 'BedID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.bedCellhandler(col) },
      { Header: Literals.Columns.Case[Profile.Language], accessor: 'CaseID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.caseCellhandler(col) },
      { Header: Literals.Columns.Stocks[Profile.Language], accessor: 'Stockstxt', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.stockCellhandler(col) },
      { Header: Literals.Columns.Files[Profile.Language], accessor: 'Filestxt', sortable: true, canGroupBy: true, Finalheader: true, canFilter: true, Cell: col => this.filesCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.actions[Profile.Language], accessor: 'actions', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }
    ]

    const metaKey = "Patients"
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

    const list = (Patients.list || []).filter(u => !u.Iswaitingactivation).map(item => {
      return {
        ...item,
        Filestxt: '',
        Stockstxt: '',
        actions: <Popup
          key={Math.random()}
          trigger={<Icon className='cursor-pointer' name='ellipsis vertical' />}
          content={<div className='flex flex-col justify-start items-start w-full gap-2'>
            <Link to={`/Patients/${item.Uuid}`} ><Icon color='black' className='row-edit' name='magnify' /> {Literals.Columns.detail[Profile.Language]} </Link>
          </div>}
          on='click'
          hideOnScroll
          position='left center'
        />
      }
    })

    const filledFloors = [...new Set((Patients.list || []).filter(u => !u.Iswaitingactivation).map(patient => {
      return patient.FloorID
    }))]

    const filledFloorwithrooms = (filledFloors || []).map(floorID => {
      return {
        floor: floorID,
        rooms: [...new Set(((Patients.list || []).filter(u => u.FloorID === floorID && !u.Iswaitingactivation).map(u => {
          return u.RoomID
        })))]
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
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
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
            {/*             <Tab className='station-tab'
                panes={[
                  {
                    menuItem: Literals.Columns.Gridscreen[Profile.Language],
                    pane: {
                      key: 'grid',
                      content: <React.Fragment>
                        {list.length > 0 ?
                          <div className='w-full mx-auto '>
                            {Profile.Ismobile ?
                              <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                              <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
                          </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
                        }
                      </React.Fragment>
                    }
                  },
                  {
                    menuItem: Literals.Columns.Cardscren[Profile.Language],
                    pane: {
                      key: 'card',
                      content: <React.Fragment>
                        <List>
                          {(filledFloorwithrooms || []).map((item) => {
                            return <List.Item key={Math.random()}>
                              <List.Icon size='large' name='bed' />
                              <List.Content>
                                <div className='cursor-pointer' onClick={() => { this.handleCollapstatus(item.floor) }}>
                                  <List.Header as={'h3'}>{(Floors.list || []).find(u => u.Uuid === item.floor)?.Name}</List.Header>
                                </div>
                                <List.List>
                                  <Collapse isOpened={this.state.collapseStatus.includes(item.floor)}>
                                    {(item.rooms || []).map((room) => {
                                      return <React.Fragment key={Math.random()}>
                                        <Pagedivider />
                                        <List.Item >
                                          <List.Content>
                                            <div className='cursor-pointer flex flex-row justify-start items-center' onClick={() => { this.handleCollapstatus(item.floor + room) }}>
                                              <List.Icon size='small' name='file' />
                                              <List.Header as={'h4'}>{(Rooms.list || []).find(u => u.Uuid === room)?.Name}</List.Header>
                                            </div>
                                            <Collapse isOpened={this.state.collapseStatus.includes(item.floor + room)}>
                                              <List.List>
                                                <div className='w-full flex flex-row justify-start items-center '>
                                                  {(Patients.list || []).filter(u =>
                                                    u.FloorID === item.floor &&
                                                    u.RoomID === room &&
                                                    !u.Iswaitingactivation).map(patient => {
                                                      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient.PatientdefineID)
                                                      return <div className='m-2' key={Math.random()}>
                                                        <Card>
                                                          <Card.Content>
                                                            <Image
                                                              floated='right'
                                                              size='mini'
                                                              src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                                                            />
                                                            <Card.Header>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</Card.Header>
                                                            <Card.Meta>Friends of Elliot</Card.Meta>
                                                            <Card.Description>
                                                              Steve wants to add you to the group <strong>best friends</strong>
                                                            </Card.Description>
                                                          </Card.Content>
                                                          <Card.Content extra>
                                                            <div className='ui two buttons'>
                                                              <Button basic color='green'>
                                                                Approve
                                                              </Button>
                                                              <Button basic color='red'>
                                                                Decline
                                                              </Button>
                                                            </div>
                                                          </Card.Content>
                                                        </Card>
                                                      </div>
                                                    })}
                                                </div>
                                              </List.List>
                                            </Collapse>
                                          </List.Content>
                                        </List.Item>
                                      </React.Fragment>
                                    })}
                                  </Collapse>
                                </List.List>
                              </List.Content>
                            </List.Item>
                          })}
                        </List>
                      </React.Fragment>
                    }
                  }
                ]}
                renderActiveOnly={false} /> */}
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

  patientdefineCellhandler = (col) => {
    const { Patientdefines } = this.props
    if (Patientdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === col.value)
      return `${patientdefine?.Firstname} ${patientdefine?.Lastname}-${patientdefine?.CountryID}`
    }
  }
  floorCellhandler = (col) => {
    const { Floors } = this.props
    if (Floors.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return `${(Floors.list || []).find(u => u.Uuid === col.value)?.Name}`
    }
  }

  roomCellhandler = (col) => {
    const { Rooms } = this.props
    if (Rooms.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return `${(Rooms.list || []).find(u => u.Uuid === col.value)?.Name}`
    }
  }

  bedCellhandler = (col) => {
    const { Beds } = this.props
    if (Beds.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return `${(Beds.list || []).find(u => u.Uuid === col.value)?.Name}`
    }
  }

  caseCellhandler = (col) => {
    const { Cases } = this.props
    if (Cases.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return `${(Cases.list || []).find(u => u.Uuid === col.value)?.Name}`
    }
  }

  dateCellhandler = (col) => {
    if (col.value) {
      return col.value.split('T')[0]
    }
    return null
  }

  stockCellhandler = (col) => {

    const { Patientstocks, Stockdefines, Profile } = this.props

    const itemId = col?.row?.original?.Uuid
    const itemStocks = (Patientstocks.list || []).filter(u => u.PatientID === itemId)
    let stockstext = (itemStocks || []).map((stock) => {
      return (Stockdefines.list || []).find(u => u.Uuid === stock.StockdefineID)?.Name
    }).join(", ")

    if (!col?.cell?.isGrouped && !Profile.Ismobile) {
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

    const { Files, Profile } = this.props
    const itemId = col?.row?.original?.Uuid
    const itemFiles = (Files.list || []).filter(u => u.ParentID === itemId)
    let filestext = (itemFiles || []).map((file) => {
      return file.Name;
    }).join(", ")

    if (!col?.cell?.isGrouped && !Profile.Ismobile) {
      return filestext.length - 35 > 20 ?
        (
          !this.state.filesStatus.includes(itemId) ?
            [filestext.slice(0, 35) + ' ...(' + itemFiles.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandFiles(itemId)}> ...Daha Fazla Göster</Link>] :
            [filestext, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkFiles(itemId)}> ...Daha Az Göster</Link>]
        ) : filestext
    }
    return filestext
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

