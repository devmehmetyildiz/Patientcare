import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Grid, GridColumn, Header, Icon, Label, Popup } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import FormInput from '../../Utils/FormInput'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import config from '../../Config'
import { PATIENTMOVEMENTTYPE, ROUTES } from '../../Utils/Constants'
import DataTable from '../../Utils/DataTable'

export default class PatientsDetail extends Component {

  PAGE_NAME = 'PatientsDetail'

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const {
      GetPatient, match, history, PatientID,
      GetPatientdefines, GetCases, GetCostumertypes,
      GetPatienttypes, GetFloors, GetRooms, GetBeds,
      GetPatientstocks, GetStockdefines, GetUnits,
      GetPatientmovements, GetFiles, GetPatientstockmovements
    } = this.props
    let Id = PatientID || match?.params?.PatientID
    if (validator.isUUID(Id)) {
      GetPatient(Id)
      GetPatientdefines()
      GetCases()
      GetCostumertypes()
      GetPatienttypes()
      GetFloors()
      GetRooms()
      GetBeds()
      GetPatientstocks()
      GetStockdefines()
      GetUnits()
      GetPatientmovements()
      GetFiles()
      GetPatientstockmovements()
    } else {
      history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
    }
  }

  componentDidUpdate() {
    const {
      Patients, removePatientnotification,
      Patientdefines, removePatientdefinenotification, Cases, removeCasenotification, Patientstockmovements,
      Costumertypes, removeCostumertypenotification, Patienttypes, removePatienttypenotification, removePatientstockmovementnotification,
      Floors, removeFloornotification, Rooms, removeRoomnotification, Beds, removeBednotification,
      Patientstocks, removePatientstocknotification, Stockdefines, removeStockdefinenotification, Units,
      removeUnitnotification, Patientmovements, removePatientmovementnotification, Files, removeFilenotification
    } = this.props
    const { selected_record } = Patients

    const isLoadingstatus =
      Patients.isLoading &&
      Patientdefines.isLoading &&
      Cases.isLoading &&
      Patienttypes.isLoading &&
      Costumertypes.isLoading &&
      Floors.isLoading &&
      Rooms.isLoading &&
      Beds.isLoading &&
      Patientstocks.isLoading &&
      Stockdefines.isLoading &&
      Units.isLoading &&
      Patientmovements.isLoading &&
      Patientstockmovements.isLoading &&
      Files.isLoading

    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && isLoadingstatus && !this.state.isDatafetched) {
      this.setState({ isDatafetched: true })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
    Notification(Patients.notifications, removePatientnotification)
    Notification(Patientdefines.notifications, removePatientdefinenotification)
    Notification(Cases.notifications, removeCasenotification)
    Notification(Patienttypes.notifications, removePatienttypenotification)
    Notification(Costumertypes.notifications, removeCostumertypenotification)
    Notification(Floors.notifications, removeFloornotification)
    Notification(Rooms.notifications, removeRoomnotification)
    Notification(Beds.notifications, removeBednotification)
    Notification(Patientstocks.notifications, removePatientstocknotification)
    Notification(Stockdefines.notifications, removeStockdefinenotification)
    Notification(Units.notifications, removeUnitnotification)
    Notification(Patientmovements.notifications, removePatientmovementnotification)
    Notification(Files.notifications, removeFilenotification)
  }

  render() {

    const {
      Patients, Patientdefines, Cases, Costumertypes, Patienttypes,
      Floors, Rooms, Beds, Patientstocks, Stockdefines, Units, Patientstockmovements,
      Patientmovements, Files, Profile, history, match, PatientID
    } = this.props


    const Id = match.params.PatientID || PatientID

    const { selected_record } = Patients

    const isLoadingstatus =
      Patients.isLoading &&
      Patientdefines.isLoading &&
      Cases.isLoading &&
      Patienttypes.isLoading &&
      Costumertypes.isLoading &&
      Floors.isLoading &&
      Rooms.isLoading &&
      Beds.isLoading &&
      Patientstocks.isLoading &&
      Stockdefines.isLoading &&
      Units.isLoading &&
      Patientmovements.isLoading &&
      Patientstockmovements.isLoading &&
      Files.isLoading


    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === selected_record?.PatientdefineID)
    const costumertype = (Costumertypes.list || []).find(u => u.Uuid === patientdefine?.CostumertypeID)
    const patienttype = (Patienttypes.list || []).find(u => u.Uuid === patientdefine?.PatientdefineID)

    const floor = (Floors.list || []).find(u => u.Uuid === selected_record?.FloorID)
    const room = (Rooms.list || []).find(u => u.Uuid === selected_record?.RoomID)
    const bed = (Beds.list || []).find(u => u.Uuid === selected_record?.BedID)

    const casedata = (Cases.list || []).find(u => u.Uuid === selected_record?.CaseID)

    const files = (Files.list || []).find(u => u.Usagetype === 'PP' && u.ParentID === selected_record?.Uuid)


    const stocksColumns = [
      { Header: Literals.Details.Stockname[Profile.Language], accessor: 'Stockname', sortable: false, canGroupBy: false, canFilter: false, filterDisable: true },
      { Header: Literals.Details.Amount[Profile.Language], accessor: 'Amount', sortable: false, canGroupBy: false, canFilter: false, filterDisable: true },
      { Header: Literals.Details.Unitname[Profile.Language], accessor: 'Unitname', sortable: false, canGroupBy: false, canFilter: false, filterDisable: true },
      { Header: Literals.Details.Movementdate[Profile.Language], accessor: 'Movementdate', sortable: false, canGroupBy: false, canFilter: false, filterDisable: true, Cell: col => this.dateCellhandler(col) }
    ]

    const stockandmedicineColumns = [
      { Header: Literals.Details.Stockname[Profile.Language], accessor: 'Stockname', sortable: false, canGroupBy: false, canFilter: false, filterDisable: true },
      { Header: Literals.Details.Amount[Profile.Language], accessor: 'Amount', sortable: false, canGroupBy: false, canFilter: false, filterDisable: true },
      { Header: Literals.Details.Unitname[Profile.Language], accessor: 'Unitname', sortable: false, canGroupBy: false, canFilter: false, filterDisable: true },
    ]

    const movementColumns = [
      { Header: Literals.Details.Patientmovementype[Profile.Language], accessor: 'Patientmovementtype', sortable: false, canGroupBy: false, canFilter: false, filterDisable: true, Cell: col => this.patientmovementCellhandler(col) },
      { Header: Literals.Details.Movementdate[Profile.Language], accessor: 'Movementdate', sortable: false, canGroupBy: false, canFilter: false, filterDisable: true, Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Details.Iswaitingactivation[Profile.Language], accessor: 'Iswaitingactivation', sortable: false, canGroupBy: false, canFilter: false, filterDisable: true, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Details.IsComplated[Profile.Language], accessor: 'IsComplated', sortable: false, canGroupBy: false, canFilter: false, filterDisable: true, Cell: col => this.boolCellhandler(col) }
    ]

    const fileColumns = [
      { Header: Literals.Details.Filename[Profile.Language], accessor: 'Filename', sortable: false, canGroupBy: false, canFilter: false, filterDisable: true },
      { Header: Literals.Details.Filetype[Profile.Language], accessor: 'Filetype', sortable: false, canGroupBy: false, canFilter: false, filterDisable: true },
      { Header: Literals.Details.Usagetype[Profile.Language], accessor: 'Usagetype', sortable: false, canGroupBy: false, canFilter: false, filterDisable: true },
    ]

    const lastincomestocks = (Patientstockmovements.list || []).filter(u => u.Movementtype === 1).sort((a, b) => { return b.Id - a.Id }).slice(0, 5).map(movement => {
      const stock = (Patientstocks.list || []).find(u => u.Uuid === movement.StockID)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      return { ...movement, Stockname: stockdefine?.Name, Unitname: unit?.Name }
    })

    const lastoutcomestocks = (Patientstockmovements.list || []).filter(u => u.Movementtype === -1).sort((a, b) => { return b.Id - a.Id }).slice(0, 5).map(movement => {
      const stock = (Patientstocks.list || []).find(u => u.Uuid === movement.StockID)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      return { ...movement, Stockname: stockdefine?.Name, Unitname: unit?.Name }
    })

    const lastmovements = (Patientmovements.list || []).filter(u => u.PatientID === selected_record?.Uuid).sort((a, b) => { return b.Id - a.Id }).slice(0, 5)

    const lastfiles = (Files.list || []).filter(u => u.ParentID === selected_record?.Uuid).sort((a, b) => { return b.Id - a.Id }).slice(0, 5)

    const patientstocks = (Patientstocks.list || []).filter(u => u.PatientID === selected_record?.Uuid && !u.Ismedicine).map(stock => {
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      let amount = 0.0;
      let movements = (Patientstockmovements.list || []).filter(u => u.StockID === stock.Uuid && u.Isactive && u.Isapproved)
      movements.forEach(movement => {
        amount += (movement.Amount * movement.Movementtype);
      });
      return { ...stock, Amount: amount, Stockname: stockdefine?.Name, Unitname: unit?.Name }
    })

    const patientmedicines = (Patientstocks.list || []).filter(u => u.PatientID === selected_record?.Uuid && u.Ismedicine).map(stock => {
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      let amount = 0.0;
      let movements = (Patientstockmovements.list || []).filter(u => u.StockID === stock.Uuid && u.Isactive && u.Isapproved)
      movements.forEach(movement => {
        amount += (movement.Amount * movement.Movementtype);
      });
      return { ...stock, Amount: amount, Stockname: stockdefine?.Name, Unitname: unit?.Name }
    })

    return (
      isLoadingstatus ? <LoadingPage /> :
        < Pagewrapper >
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patients"}>
                <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Link to={"/Patients/" + Id}>
                <Breadcrumb.Section>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagedetailheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Grid divided className='w-full flex justify-center items-center'>
              <Grid.Row>
                <GridColumn width={14} >
                  <Grid.Row className='flex justify-center items-center'>
                    <Header>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}-${patientdefine?.CountryID}`}</Header>
                  </Grid.Row>
                  <Grid.Row className='mt-8 flex flex-row justify-center items-center w-full'>
                    <Label as={'a'}>{`${Literals.Details.Costumertype[Profile.Language]} : ${costumertype?.Name}`}</Label>
                    <Label as={'a'}>{`${Literals.Details.Patienttype[Profile.Language]} : ${patienttype?.Name}`}</Label>
                    <Label as={'a'}>{`${Literals.Details.Floor[Profile.Language]} : ${floor?.Name}`}</Label>
                    <Label as={'a'}>{`${Literals.Details.Room[Profile.Language]} : ${room?.Name}`}</Label>
                    <Label as={'a'}>{`${Literals.Details.Bed[Profile.Language]} : ${bed?.Name}`}</Label>
                  </Grid.Row>
                  <Grid.Row className='mt-8 flex flex-row justify-center items-center w-full'>
                    <div className='flex w-full justify-center items-center'>
                      <Label color='red' size='large' horizontal>{casedata?.Name}</Label>
                    </div>
                  </Grid.Row>
                </GridColumn>
                <Grid.Column width={2}>
                  <Header as='h2' icon textAlign='center'>
                    {files ? <img alt='pp' src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${files?.Uuid}`} className="rounded-full" style={{ width: '100px', height: '100px' }} />
                      : <Icon name='users' circular />}
                  </Header>
                </Grid.Column>
              </Grid.Row>
              <Pagedivider />
              <Grid.Row>
                <Grid.Column width={14}>
                  <div className=' w-full'>
                    <Grid columns={2} divided>
                      <Grid.Column>
                        <Label >{Literals.Details.Last5incomemovement[Profile.Language]}</Label>
                        <DataTable
                          Columns={stocksColumns}
                          Data={lastincomestocks}
                        />
                        <Pagedivider />
                        <Label >{Literals.Details.Last5outcomemovement[Profile.Language]}</Label>
                        <DataTable
                          Columns={stocksColumns}
                          Data={lastoutcomestocks}
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <Label >{Literals.Details.Last5movement[Profile.Language]}</Label>
                        <DataTable
                          Columns={movementColumns}
                          Data={lastmovements}
                        />
                        <Pagedivider />
                        <Label >{Literals.Details.Last5File[Profile.Language]}</Label>
                        <DataTable
                          Columns={fileColumns}
                          Data={lastfiles}
                        />
                        <Pagedivider />
                        <Label >{Literals.Details.PatientStocks[Profile.Language]}</Label>
                        <DataTable
                          Columns={stockandmedicineColumns}
                          Data={patientstocks}
                        />
                        <Pagedivider />
                        <Label >{Literals.Details.Patientmedicines[Profile.Language]}</Label>
                        <DataTable
                          Columns={stockandmedicineColumns}
                          Data={patientmedicines}
                        />
                      </Grid.Column>
                    </Grid>
                  </div>
                </Grid.Column>
                <Grid.Column width={2} textAlign='center'>
                  <div className='w-full flex flex-col justify-center items-center gap-3'>
                    <Button primary fluid onClick={() => { history.push(`/Patients/${Id}/Addmedicine`) }}>{Literals.Button.Givemedicine[Profile.Language]}</Button>
                    <Button primary fluid onClick={() => { history.push(`/Patients/${Id}/Removemedicine`) }}>{Literals.Button.Takemedicine[Profile.Language]}</Button>
                    <Button primary fluid onClick={() => { history.push(`/Patients/${Id}/Addstock`) }}>{Literals.Button.GiveStock[Profile.Language]}</Button>
                    <Button primary fluid onClick={() => { history.push(`/Patients/${Id}/Removestock`) }}>{Literals.Button.TakeStock[Profile.Language]}</Button>
                    <Button primary fluid >{Literals.Button.Changestatus[Profile.Language]}</Button>
                    <Button primary fluid >{Literals.Button.Geton[Profile.Language]}</Button>
                    <Button primary fluid >{Literals.Button.Getoff[Profile.Language]}</Button>
                    <Button primary fluid >{Literals.Button.Changetodos[Profile.Language]}</Button>
                    <Button primary fluid onClick={() => { history.push(`/Patients/${Id}/Editfile`) }}>{Literals.Button.Editfiles[Profile.Language]}</Button>
                    <Button primary fluid onClick={() => { history.push(`/Patientdefines/${patientdefine.Uuid}/edit`) }}>{Literals.Button.Editdefine[Profile.Language]}</Button>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Contentwrapper>
        </Pagewrapper >
    )
  }

  dateCellhandler = (col) => {
    if (col.value) {
      return col.value.split('T').length > 0 ? col.value.split('T')[0] : col.value
    }
    return null
  }

  patientmovementCellhandler = (col) => {
    return PATIENTMOVEMENTTYPE.find(u => u.value === col.value) ? PATIENTMOVEMENTTYPE.find(u => u.value === col.value).Name : col.value
  }

  boolCellhandler = (col) => {
    const { Profile } = this.props
    return col.value !== null && (col.value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }

}
PatientsDetail.contextType = FormContext