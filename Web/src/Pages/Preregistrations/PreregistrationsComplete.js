import React, { Component } from 'react'
import { Breadcrumb, Button, Card, Form, Grid, GridColumn, Header, Icon, Label, Modal } from 'semantic-ui-react'
import Literals from './Literals'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'
import { ROUTES } from '../../Utils/Constants'
import config from '../../Config'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import { Link } from 'react-router-dom'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import validator from '../../Utils/Validator'
import FormInput from '../../Utils/FormInput'
import formToObject from 'form-to-object'
import { FormContext } from '../../Provider/FormProvider'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
export default class PreregistrationsComplete extends Component {

  PAGE_NAME = 'PreregistrationsComplete'

  constructor(props) {
    super(props)
    this.state = {
      isLayoutopen: false,
      neededFilefounded: [],
      selected_record: {},
      isDatafetched: false,
      WarehouseID: "",
      RoomID: "",
      FloorID: "",
      BedID: "",
      CaseID: ""
    }
  }

  componentDidMount() {
    const { GetStockdefines, GetWarehouses, GetUnits, GetPatients, GetRooms, GetFloors, GetBeds, GetFiles, GetPatientdefines, GetPatientstocks, GetPatientstockmovements, GetCases } = this.props
    GetPatients()
    GetStockdefines()
    GetWarehouses()
    GetRooms()
    GetFloors()
    GetBeds()
    GetFiles()
    GetPatientdefines()
    GetPatientstocks()
    GetPatientstockmovements()
    GetUnits()
    GetCases()
  }

  componentDidUpdate() {
    const {
      Cases, removeCasenotification,
      Patients, removePatientnotification,
      Warehouses, removeWarehousenotification,
      Rooms, removeRoomnotification,
      Beds, removeBednotification,
      Files, removeFilenotification,
      Floors, removeFloornotification,
      Patientdefines, removePatientdefinenotification,
      Patientstocks, removePatientstocknotification,
      Patientstockmovements, removePatientstockmovementnotification,
      Units, removeUnitnotification,
      Stockdefines, removeStockdefinenotification,
      Profile, fillPatientnotification,
      match, history
    } = this.props

    Notification(Patients.notifications, removePatientnotification)
    Notification(Warehouses.notifications, removeWarehousenotification)
    Notification(Rooms.notifications, removeRoomnotification)
    Notification(Beds.notifications, removeBednotification)
    Notification(Files.notifications, removeFilenotification)
    Notification(Floors.notifications, removeFloornotification)
    Notification(Patientdefines.notifications, removePatientdefinenotification)
    Notification(Patientstocks.notifications, removePatientstocknotification)
    Notification(Patientstockmovements.notifications, removePatientstockmovementnotification)
    Notification(Units.notifications, removeUnitnotification)
    Notification(Stockdefines.notifications, removeStockdefinenotification)
    Notification(Cases.notifications, removeCasenotification)

    const isLoadingstatus = Patients.isLoading || Warehouses.isLoading || Rooms.isLoading
      || Beds.isLoading || Files.isLoading || Floors.isLoading || Patientdefines.isLoading
      || Patientstocks.isLoading || Patientstockmovements.isLoading || Stockdefines.isLoading
      || Units.isLoading || Cases.isLoading
    if (!isLoadingstatus && !this.state.isDatafetched) {

      let Id = match?.params?.PatientID
      if (!validator.isUUID(Id)) {
        history.push("/Preregistrations")
      }

      const selected_record = (Patients.list || []).find(u => u.Uuid === Id)
      if (!selected_record) {
        history.push("/Preregistrations")
      }
      if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoadingstatus && !this.state.isDatafetched) {

        const filesthatwillcheck = [
          Literals.Options.usageType3[Profile.Language],
          Literals.Options.usageType4[Profile.Language],
          Literals.Options.usageType5[Profile.Language],
          Literals.Options.usageType6[Profile.Language],
          Literals.Options.usageType7[Profile.Language],
        ]
        if (!isLoadingstatus && !this.state.isFilechecked) {
          let errors = []
          const neededfiles = []
          filesthatwillcheck.forEach(usagetype => {
            const foundedfile = (Files.list || []).find(u => u.ParentID === selected_record.Uuid && u.Usagetype === usagetype)
            if (!foundedfile) {
              errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: `${usagetype} ${Literals.Messages.filerequired[Profile.Language]}` })
              neededfiles.push(usagetype)
            }
          });
          if (errors.length > 0) {
            errors.forEach(error => {
              fillPatientnotification(error)
            })
          }
          this.setState({ selected_record, isDatafetched: true, neededFilefounded: neededfiles })
        }
      }
    }
  }

  render() {

    const {
      Cases,
      Patients,
      Warehouses,
      Rooms,
      Beds,
      Files,
      Floors,
      Patientdefines,
      Patientstocks,
      Patientstockmovements,
      Stockdefines,
      Units,
      Profile, match, history } = this.props


    const isLoadingstatus = Patients.isLoading || Warehouses.isLoading || Rooms.isLoading
      || Beds.isLoading || Files.isLoading || Floors.isLoading || Patientdefines.isLoading
      || Patientstocks.isLoading || Patientstockmovements.isLoading || Stockdefines.isLoading
      || Units.isLoading || Cases.isLoading
    let Id = match?.params?.PatientID
    const selected_record = (Patients.list || []).find(u => u.Uuid === Id)

    const patientstocks = (Patientstocks.list || []).filter(stock => stock.PatientID === selected_record.Uuid).map(stock => {
      let amount = 0.0;
      let movements = (Patientstockmovements.list || []).filter(u => u.StockID === stock.Uuid && u.Isactive && u.Isapproved)
      movements.forEach(movement => {
        amount += (movement.Amount * movement.Movementtype);
      });
      return { ...stock, Amount: amount }
    })

    const filesthatwillcheck = [
      Literals.Options.usageType3[Profile.Language],
      Literals.Options.usageType4[Profile.Language],
      Literals.Options.usageType5[Profile.Language],
      Literals.Options.usageType6[Profile.Language],
      Literals.Options.usageType7[Profile.Language],
    ]

    const Warehouseoptions = (Warehouses.list || []).filter(u => u.Isactive).map(warehouse => {
      return { key: warehouse.Uuid, text: warehouse.Name, value: warehouse.Uuid }
    })
    const Flooroptions = (Floors.list || []).filter(u => u.Isactive).map(floor => {
      return { key: floor.Uuid, text: floor.Name, value: floor.Uuid }
    })
    const Roomoptions = (Rooms.list || []).filter(u => u.Isactive && u.FloorID === this.context.formstates[`${this.PAGE_NAME}/FloorID`]).map(room => {
      return { key: room.Uuid, text: room.Name, value: room.Uuid }
    })

    const Caseoptions = (Cases.list || []).filter(u => u.Isactive).map(casedata => {
      return { key: casedata.Uuid, text: casedata.Name, value: casedata.Uuid }
    })

    const Bedoptions = (
      validator.isUUID(this.context.formstates[`${this.PAGE_NAME}/FloorID`]) &&
      validator.isUUID(this.context.formstates[`${this.PAGE_NAME}/RoomID`])) ?
      (Beds.list || []).filter(u => u.Isactive && u.RoomID === this.context.formstates[`${this.PAGE_NAME}/RoomID`]).map(bed => {
        return { key: bed.Uuid, text: bed.Name, value: bed.Uuid }
      }) : []

    const patientfiles = (Files.list || []).filter(u => u.ParentID === selected_record.Uuid)
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === selected_record.PatientdefineID)
    return (
      isLoadingstatus ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Preregistrations"}>
                <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecompleteheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Header as='h2' icon textAlign='center'>
              {(Files.list || []).filter(u => u.Usagetype === 'PP' && u.ParentID === selected_record.Uuid).length > 0 ? <img src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${(Files.list || []).filter(u => u.ParentID === selected_record.Uuid).find(u => u.Usagetype === 'PP')?.Uuid}`} className="rounded-full" style={{ width: '100px', height: '100px' }} />
                : <Icon name='users' circular />}
              <Header.Content>{`${patientdefine?.Firstname} 
                            ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`}</Header.Content>
            </Header>
            <Pagedivider />
            <div className='flex flex-col justify-center items-center w-full'>
              <div className='flex flex-row justify-center items-center flex-wrap gap-2'>
                <Card
                  link
                  header={Literals.Complete.Define[Profile.Language]}
                  meta={`${Literals.Complete.Firstname[Profile.Language]}-${patientdefine?.Firstname} ${Literals.Complete.Lastname[Profile.Language]}-${patientdefine?.Lastname}`}
                  description={[
                    `${Literals.Complete.CountryID[Profile.Language]}-${patientdefine?.CountryID}  `,
                    `${Literals.Complete.Fathername[Profile.Language]}-${patientdefine?.Fathername}  `,
                    `${Literals.Complete.Mothername[Profile.Language]}-${patientdefine?.Mothername}  `,
                  ].join('')}
                />
                <Card
                  link
                  header={Literals.Complete.Medicines[Profile.Language]}
                  meta={`${Literals.Complete.Totalcount[Profile.Language]} ${patientstocks.filter(u => u.Ismedicine).map(u => { return u.Amount }).reduce((a, b) => a + b, 0)}`}
                  description={patientstocks.filter(u => u.Ismedicine).map(stock => {
                    var stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock.StockdefineID)
                    var unit = (Units.list || []).find(u => u.Uuid === stockdefine.UnitID)
                    return `${stock.Amount} ${unit?.Name} ${stockdefine?.Name},`
                  }).join('')}
                />
                <Card
                  link
                  header={Literals.Complete.Stocks[Profile.Language]}
                  meta={`${Literals.Complete.Totalcount[Profile.Language]} ${patientstocks.filter(u => !u.Ismedicine).map(u => { return u.Amount }).reduce((a, b) => a + b, 0)}`}
                  description={patientstocks.filter(u => !u.Ismedicine).map(stock => {
                    var stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock.StockdefineID)
                    var unit = (Units.list || []).find(u => u.Uuid === stockdefine.UnitID)
                    return `${stock.Amount} ${unit?.Name} ${stockdefine?.Name},`
                  }).join('')}
                />
                <Card
                  link
                  header={Literals.Complete.Files[Profile.Language]}
                  meta={`${Literals.Complete.Totalcount[Profile.Language]} ${patientfiles.length}`}
                  description={patientfiles.map(file => {
                    return `${file.Name},`
                  }).join('')}
                />
              </div>
              <Pagedivider />
              <div className='w-full flex flex-col justify-center items-center mb-auto'>
                <Header as='h3' icon textAlign='center'>
                  {Literals.Complete.Requiredfiles[Profile.Language]}
                </Header>
                <div className='flex flex-row justify-center items-center w-full'>
                  {filesthatwillcheck.map(filename => {
                    if (this.state.neededFilefounded.includes(filename)) {
                      return <Label color='red'>{filename}</Label>
                    } else {
                      return <Label color='green'>{filename}</Label>
                    }
                  })}
                </div>
                <Pagedivider />
                {this.state.neededFilefounded.length > 0 ? <div className='flex flex-row justify-start items-center w-full mb-auto '>
                  <Form onSubmit={this.handleSubmit} className='w-full'>
                    <Form.Group widths={'equal'}>
                      <FormInput page={this.PAGE_NAME} required placeholder={Literals.Complete.Iswilltransfer[Profile.Language]} name="Iswilltransfer" formtype="checkbox" />
                      {this.context.formstates[`${this.PAGE_NAME}/Iswilltransfer`] &&
                        <FormInput page={this.PAGE_NAME} required placeholder={Literals.Complete.Warehouse[Profile.Language]} name="WarehouseID" options={Warehouseoptions} formtype="dropdown" />
                      }
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                      <FormInput page={this.PAGE_NAME} required placeholder={Literals.Complete.Case[Profile.Language]} name="CaseID" options={Caseoptions} formtype="dropdown" />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                      <FormInput page={this.PAGE_NAME} required placeholder={Literals.Complete.Floor[Profile.Language]} name="FloorID" options={Flooroptions} formtype="dropdown" />
                      {validator.isUUID(this.context.formstates[`${this.PAGE_NAME}/FloorID`]) && <FormInput page={this.PAGE_NAME} required placeholder={Literals.Complete.Room[Profile.Language]} name="RoomID" options={Roomoptions} formtype="dropdown" />}
                      {validator.isUUID(this.context.formstates[`${this.PAGE_NAME}/FloorID`]) && validator.isUUID(this.context.formstates[`${this.PAGE_NAME}/RoomID`]) && <FormInput page={this.PAGE_NAME} required placeholder={Literals.Complete.Bed[Profile.Language]} name="BedID" options={Bedoptions} formtype="dropdown" />}
                    </Form.Group>
                    <Footerwrapper>
                      {history && <Link to="/Preregistrations">
                        <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                      </Link>}
                      <Button floated="right" type='submit' color='blue'>{Literals.Button.Create[Profile.Language]}</Button>
                    </Footerwrapper>
                  </Form>
                </div> :
                  <Footerwrapper>
                    {history && <Link to="/Preregistrations">
                      <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                    </Link>}
                  </Footerwrapper>
                }
              </div>
            </div>
          </Contentwrapper>
        </Pagewrapper >
    )
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const { CompletePrepatients, history, fillPatientnotification, Profile } = this.props
    const data = formToObject(e.target)
    data.Iswilltransfer = this.context.formstates[`${this.PAGE_NAME}/Iswilltransfer`] || false
    data.WarehouseID = data.Iswilltransfer && this.context.formstates[`${this.PAGE_NAME}/WarehouseID`]
    data.FloorID = this.context.formstates[`${this.PAGE_NAME}/FloorID`]
    data.RoomID = this.context.formstates[`${this.PAGE_NAME}/RoomID`]
    data.BedID = this.context.formstates[`${this.PAGE_NAME}/BedID`]
    data.CaseID = this.context.formstates[`${this.PAGE_NAME}/CaseID`]
    let errors = []
    if (data.Iswilltransfer === true && !validator.isUUID(data.WarehouseID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Complete.Warehouserequired[Profile.Language] })
    }
    if (!validator.isUUID(data.FloorID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Complete.Floorrequired[Profile.Language] })
    }
    if (!validator.isUUID(data.RoomID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Complete.Roomrequired[Profile.Language] })
    }
    if (!validator.isUUID(data.BedID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Complete.Bedrequired[Profile.Language] })
    }
    if (!validator.isUUID(data.CaseID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Complete.Caserequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientnotification(error)
      })
    } else {
      CompletePrepatients({ data: { ...this.state.selected_record, ...data }, history })
    }
  }
}
PreregistrationsComplete.contextType = FormContext