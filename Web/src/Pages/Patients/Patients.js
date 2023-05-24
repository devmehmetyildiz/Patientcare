import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Accordion, Breadcrumb, Button, Card, Divider, Dropdown, Grid, GridColumn, GridRow, Header, Icon, Image, Loader, Modal, Segment, Table, Transition } from 'semantic-ui-react'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Notification from "../../Utils/Notification"
import InnerHTML from '../../Utils/DangerouslySetHtmlContent'
import PrintBodyReplacer from "../../Utils/PrintBodyReplacer"
import { ROUTES } from '../../Utils/Constants'
import jsPDF from 'jspdf';
import myTurkishFont from '../../Assets/fonts/AbhayaLibre-Medium.ttf';
export default class Patients extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openCheckperiod: false,
      openTodos: false,
      openPrintpreview: false,
      selectedpatient: {},
      activeIndex: [0],
      selectedPrintdesign: {},
      isPreviewloading: false,
      decoratedBody: null
    }
  }

  componentDidMount() {
    const { GetPatients, GetPrinttemplates } = this.props
    GetPatients()
    GetPrinttemplates()
  }

  componentDidUpdate() {
    const { Patients, removePatientnotification, Checkperiods, removeCheckperiodnotification, removeTodogroupdefinenotification,
      removePrinttemplatenotification, Printtemplates, Todogroupdefines } = this.props
    Notification(Patients.notifications, removePatientnotification)
    Notification(Checkperiods.notifications, removeCheckperiodnotification)
    Notification(Todogroupdefines.notifications, removeTodogroupdefinenotification)
    Notification(Todogroupdefines.notifications, removeTodogroupdefinenotification)
    Notification(Printtemplates.notifications, removePrinttemplatenotification)
  }

  render() {
    const { Patients, Checkperiods, Todogroupdefines, GetTodogroupdefines, GetCheckperiods, EditPatientcheckperiods,
      EditPatienttodogroupdefines, setPatient, Printtemplates } = this.props
    const { list, isLoading, isDispatching } = Patients
    const { activeIndex } = this.state

    const floorList = [...new Set(list.map(item => { return item.floornumber }))]

    const triggerSetting = (
      <div className='flex flex-row justify-center items-center select-none'>
        <Icon name='setting' />
      </div>
    )

    const triggerPrint = (
      <div className='flex flex-row justify-center items-center select-none'>
        <Icon name='print' />
      </div>
    )


    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <React.Fragment>
          <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
            <div className='w-full mx-auto align-middle'>
              <Header style={{ backgroundColor: 'transparent', border: 'none' }} as='h1' attached='top' >
                <Grid columns='2' >
                  <GridColumn width={8} className="">
                    <Breadcrumb size='big'>
                      <Link to={"/Patients"}>
                        <Breadcrumb.Section>Kurumdaki Hastalar</Breadcrumb.Section>
                      </Link>
                    </Breadcrumb>
                  </GridColumn>
                </Grid>
              </Header>
            </div>
            <Divider className='w-full  h-[1px]' />
            <Segment className='w-full overflow-y-auto max-h-[calc(100vh-2.2rem)]'>
              {list.length > 0 ?
                <div className='w-full mx-auto '>
                  <Accordion
                    className='transition-all ease-in-out duration-500'
                    styled
                    fluid
                  >
                    {floorList.map((floor, index) => {
                      return <React.Fragment key={index}>
                        <Accordion.Title
                          active={activeIndex.includes(index)}
                          index={index}
                          onClick={this.handleClick}>
                          <Icon name='dropdown' />
                          {`${floor}.Kat`}
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex.includes(index)}>
                          <Transition visible={activeIndex.includes(index)} animation='slide left' duration={500}>
                            <Grid stackable divided >
                              {list.filter(u => u.floornumber === floor).map((patient, index) => {
                                return <Grid.Column key={index} mobile={9} tablet={6} computer={3}>
                                  <Card>
                                    <Card.Content>
                                      {(patient.files || []).filter(u => u.usagetype === 'PP').length > 0 ?
                                        <Image
                                          floated='right'
                                          size='mini'
                                          src={`${process.env.REACT_APP_BACKEND_URL}/${ROUTES.FILE}/GetImage?guid=${patient.concurrencyStamp}`}
                                        />
                                        : <Image
                                          floated='right'
                                          size='mini'
                                          src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                                        />}
                                      <Card.Header>{`${patient?.patientdefine?.firstname} ${patient?.patientdefine?.lastname}`}</Card.Header>
                                      <Card.Meta>{`${patient?.patientdefine?.costumertype?.name}`}</Card.Meta>
                                      <Card.Meta>{`Oda no:${patient?.roomnumber}  Yatak no:${patient?.bednumber}`}
                                      </Card.Meta>
                                      <Card.Description>
                                        <Grid>
                                          <GridRow>
                                            <div className='ml-2'>
                                              <Icon name='bell' />
                                            </div>
                                            <div className='ml-2'>
                                              <Dropdown icon={null} trigger={triggerPrint} style={{ zIndex: 0 }} basic className="h-full block ">
                                                <Dropdown.Menu className=''>
                                                  <Dropdown.Header icon='tags' content='Raporlar' />
                                                  <Dropdown.Divider />
                                                  {(Printtemplates.list || []).length > 0 ?
                                                    Printtemplates.list.map(printdesign => {
                                                      return <Dropdown.Item key={Math.random()}>
                                                        <div
                                                          onClick={() => {
                                                            setPatient(patient)
                                                            this.setState({ openPrintpreview: true, selectedPrintdesign: printdesign, isPreviewloading: true, decoratedBody: PrintBodyReplacer(printdesign.printtemplate, patient) }
                                                            )
                                                          }} className='text-[#3d3d3d] hover:text-[#3d3d3d]'><Icon className='id card ' />{printdesign.name}</div>
                                                      </Dropdown.Item>
                                                    })
                                                    : <React.Fragment />}
                                                </Dropdown.Menu>
                                              </Dropdown>
                                            </div>
                                            <div className='ml-2'>
                                              <Dropdown icon={null} trigger={triggerSetting} style={{ zIndex: 0 }} basic className="h-full block ">
                                                <Dropdown.Menu className=''>
                                                  <Dropdown.Header icon='tags' content='Hasta Ayarları' />
                                                  <Dropdown.Divider />
                                                  <Dropdown.Item>
                                                    <div
                                                      onClick={() => {
                                                        GetTodogroupdefines()
                                                        setPatient(patient)
                                                        this.setState({ openTodos: true, selectedpatient: patient })
                                                      }} className='text-[#3d3d3d] hover:text-[#3d3d3d]'><Icon className='id card ' />Yapılacaklar</div>
                                                  </Dropdown.Item>
                                                  <Dropdown.Item>
                                                    <div
                                                      onClick={() => {
                                                        GetCheckperiods()
                                                        setPatient(patient)
                                                        this.setState({ openCheckperiod: true, selectedpatient: patient })
                                                      }} className='text-[#3d3d3d] hover:text-[#3d3d3d]'> <Icon className='lock' /> Kontrol Periyodu Ekle </div>
                                                  </Dropdown.Item>
                                                </Dropdown.Menu>
                                              </Dropdown>
                                            </div>
                                          </GridRow>
                                        </Grid>
                                      </Card.Description>
                                    </Card.Content>
                                    <Card.Content >
                                      <div className='ui two buttons'>
                                        <Button basic color='green'>
                                          İlaç Ver
                                        </Button>
                                        <Button basic color='red'>
                                          İlaç Al
                                        </Button>
                                      </div>
                                    </Card.Content>
                                  </Card>
                                </Grid.Column>
                              })}
                            </Grid>
                          </Transition>
                        </Accordion.Content>
                      </React.Fragment>
                    })}
                  </Accordion>
                </div> : <NoDataScreen message="Kurumda Hasta Yok" />
              }
            </Segment>
          </div >
          <Modal
            onClose={() => this.setState({ openCheckperiod: false })}
            onOpen={() => this.setState({ openCheckperiod: true })}
            open={this.state.openCheckperiod}
          >
            <Modal.Header>Hasta Kontrol Periyodları</Modal.Header>
            <Modal.Header>{`${Patients.selected_patient?.patientdefine?.firstname} ${Patients.selected_patient?.patientdefine?.lastname}`}</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <Table celled className='list-table ' key='product-create-type-conversion-table ' >
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell width={4}>Kontrol Periyodları</Table.HeaderCell>
                      <Table.HeaderCell width={1}>Atama</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {Checkperiods.list.length > 0 ?
                      (Checkperiods.isLoading || Patients.isCheckperiodloading) ? <Loader /> :
                        Checkperiods.list.map(item => {
                          return <Table.Row>
                            <Table.Cell>{item.name}{item.concurrencyStamp === Patients.selected_patient?.checkperiodID && <Icon name='check' />}</Table.Cell>
                            <Table.Cell>
                              {item.concurrencyStamp !== Patients.selected_patient?.checkperiodID && <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => {
                                EditPatientcheckperiods({ ...Patients.selected_patient, checkperiodID: item.concurrencyStamp })
                              }}>Hastaya Ata</Button>}
                            </Table.Cell>
                          </Table.Row>
                        })
                      :
                      <p>Tanımlı Kontrol Periyodu yok</p>}
                  </Table.Body>
                </Table>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color='black' onClick={() => this.setState({ openCheckperiod: false })}>
                Kapat
              </Button>
            </Modal.Actions>
          </Modal>
          <Modal
            onClose={() => this.setState({ openTodos: false })}
            onOpen={() => this.setState({ openTodos: true })}
            open={this.state.openTodos}
          >
            <Modal.Header>Hasta Yapılacakları</Modal.Header>
            <Modal.Header>{`${this.state.selectedpatient?.patientdefine?.firstname} ${this.state.selectedpatient?.patientdefine?.lastname}`}</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <Table celled className='list-table ' key='product-create-type-conversion-table ' >
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell width={4}>Kontrol Periyodları</Table.HeaderCell>
                      <Table.HeaderCell width={1}>Atama</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {Todogroupdefines.list.length > 0 ?
                      (Todogroupdefines.isLoading || Patients.isTodogroupdefineloading) ? <Loader /> :
                        Todogroupdefines.list.map(item => {
                          return <Table.Row>
                            <Table.Cell>{item.name}{item.concurrencyStamp === Patients.selected_patient?.todogroupdefineID && <Icon name='check' />}</Table.Cell>
                            <Table.Cell>
                              {item.concurrencyStamp !== Patients.selected_patient?.todogroupdefineID && <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => {
                                EditPatienttodogroupdefines({ ...Patients.selected_patient, todogroupdefineID: item.concurrencyStamp })
                              }}>Hastaya Ata</Button>}
                            </Table.Cell>
                          </Table.Row>
                        })
                      :
                      <p>Tanımlı Yapılacaklar Grubu yok</p>}
                  </Table.Body>
                </Table>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color='black' onClick={() => this.setState({ openTodos: false })}>
                Kapat
              </Button>
            </Modal.Actions>
          </Modal>
          <Modal
            onClose={() => this.setState({ openPrintpreview: false })}
            onOpen={() => this.setState({ openPrintpreview: true })}
            open={this.state.openPrintpreview}
          >
            <Modal.Header as={'h1'}>Hasta Raporu</Modal.Header>
            <Modal.Header as={'h2'}>{`${this.state.selectedPrintdesign?.name}`}</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <div className='p-2 shadow-lg shadow-gray-300 w-full flex justify-center items-center'>
                  <InnerHTML html={
                    this.state.selectedPrintdesign?.printtemplate ? this.state.decoratedBody
                      : '<div class="print-design-preview-message">No code to show.</div>'
                  } />
                </div>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color='black' onClick={() => this.setState({ openPrintpreview: false })}>
                Kapat
              </Button>
              <Button color='black' onClick={() => this.generatePDF(this.state.decoratedBody)}>
                Yazdır
              </Button>

            </Modal.Actions>
          </Modal>
        </React.Fragment >
    )
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

  generatePDF = (html) => {
    const pdf = new jsPDF({
      orientation: "portrait", // or "landscape"
      unit: "px",
      format: "a4", // or [width, height]
      preserveObjectStacking: true
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


}

