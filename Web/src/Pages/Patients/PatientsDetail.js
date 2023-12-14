import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Grid, GridColumn, Header, Icon, Label, Loader } from 'semantic-ui-react'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import config from '../../Config'
import { PATIENTMOVEMENTTYPE, ROUTES } from '../../Utils/Constants'
import PatientsOut from '../../Containers/Patients/PatientsOut'
import PatientsIn from '../../Containers/Patients/PatientsIn'
import PatientsEditplace from '../../Containers/Patients/PatientsEditplace'
import {
  DataTable, Contentwrapper,
  Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper
} from '../../Components'
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
      GetPatientstocks, GetStockdefines, GetUnits, GetTodosbyPatient,
      GetPatientmovements, GetFiles, GetPatientstockmovements, GetTododefines,
      GetPatientcashmovements
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
      GetTodosbyPatient(Id)
      GetTododefines()
      GetPatientcashmovements()
    } else {
      history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
    }
  }

  componentDidUpdate() {
    const {
      Patients, Tododefines,
      Patientdefines, Cases, Patientstockmovements,
      Costumertypes, Patienttypes,
      Floors, Rooms, Beds,
      Patientstocks, Stockdefines, Units,
      Patientcashmovements,
      Patientmovements, Files, Todos } = this.props

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
      Files.isLoading &&
      Todos.isLoading &&
      Tododefines.isLoading &&
      Patientcashmovements.isLoading

    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && isLoadingstatus && !this.state.isDatafetched) {
      this.setState({ isDatafetched: true })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const {
      Patients, Patientdefines, Cases, Costumertypes, Patienttypes,
      Floors, Rooms, Beds, Patientstocks, Stockdefines, Units, Patientstockmovements,
      Patientmovements, Files, Profile, history, match, PatientID, handleSelectedPatient,
      Todos, Patientcashmovements, handlePlacemodal
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
      Files.isLoading &&
      Patientcashmovements.isLoading


    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === selected_record?.PatientdefineID)
    const costumertype = (Costumertypes.list || []).find(u => u.Uuid === patientdefine?.CostumertypeID)
    const patienttype = (Patienttypes.list || []).find(u => u.Uuid === patientdefine?.PatienttypeID)

    const floor = (Floors.list || []).find(u => u.Uuid === selected_record?.FloorID)
    const room = (Rooms.list || []).find(u => u.Uuid === selected_record?.RoomID)
    const bed = (Beds.list || []).find(u => u.Uuid === selected_record?.BedID)

    const casedata = (Cases.list || []).find(u => u.Uuid === selected_record?.CaseID)

    const files = (Files.list || []).find(u => u.Usagetype === 'PP' && u.ParentID === selected_record?.Uuid)

    const completedTodos = (Todos.list || []).filter(u => u.IsCompleted)
    const waitingTodos = (Todos.list || []).filter(u => !u.IsCompleted)

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const stocksColumns = [
      { Header: Literals.Details.Stockname[Profile.Language], accessor: 'Stockname' },
      { Header: Literals.Details.Amount[Profile.Language], accessor: 'Amount' },
      { Header: Literals.Details.Unitname[Profile.Language], accessor: 'Unitname' },
      { Header: Literals.Details.Movementdate[Profile.Language], accessor: 'Movementdate', Cell: col => this.dateCellhandler(col) }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const todoColumns = [
      { Header: Literals.Details.Tododefine[Profile.Language], accessor: 'TododefineID', Cell: col => this.tododefineCellhandler(col) },
      { Header: Literals.Details.Occuredtime[Profile.Language], accessor: 'Occuredtime' },
      { Header: Literals.Details.Checktime[Profile.Language], accessor: 'Checktime' },
      { Header: Literals.Details.Isapproved[Profile.Language], accessor: 'Isapproved', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Details.IsComplated[Profile.Language], accessor: 'IsCompleted', Cell: col => this.boolCellhandler(col) }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const stockandmedicineColumns = [
      { Header: Literals.Details.Stockname[Profile.Language], accessor: 'Stockname' },
      { Header: Literals.Details.Amount[Profile.Language], accessor: 'Amount' },
      { Header: Literals.Details.Unitname[Profile.Language], accessor: 'Unitname' },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const movementColumns = [
      { Header: Literals.Details.Patientmovementype[Profile.Language], accessor: 'Patientmovementtype', Cell: col => this.patientmovementCellhandler(col) },
      { Header: Literals.Details.Movementdate[Profile.Language], accessor: 'Movementdate', Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Details.IsComplated[Profile.Language], accessor: 'IsComplated', Cell: col => this.boolCellhandler(col) }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const fileColumns = [
      { Header: Literals.Details.Filename[Profile.Language], accessor: 'Filename' },
      { Header: Literals.Details.Filetype[Profile.Language], accessor: 'Filetype' },
      { Header: Literals.Details.Usagetype[Profile.Language], accessor: 'Usagetype' },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const lastincomestocks = (Patientstockmovements.list || []).filter(u => u.Movementtype === 1 && u.Isapproved).sort((a, b) => { return b.Id - a.Id }).slice(0, 5).map(movement => {
      const stock = (Patientstocks.list || []).find(u => u.Uuid === movement.StockID && u.PatientID === selected_record?.Uuid)
      if (stock && stock?.Isapproved) {
        const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
        const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
        return { ...movement, Stockname: stockdefine?.Name, Unitname: unit?.Name || '' }
      } else {
        return null
      }
    }).filter(u => u)

    const lastoutcomestocks = (Patientstockmovements.list || []).filter(u => u.Movementtype === -1 && u.Isapproved).sort((a, b) => { return b.Id - a.Id }).slice(0, 5).map(movement => {
      const stock = (Patientstocks.list || []).find(u => u.Uuid === movement.StockID && u.PatientID === selected_record?.Uuid)
      if (stock && stock?.Isapproved) {
        const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
        const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
        return { ...movement, Stockname: stockdefine?.Name, Unitname: unit?.Name || '' }
      } else {
        return null
      }
    }).filter(u => u)

    const lastmovements = (Patientmovements.list || []).filter(u => u.PatientID === selected_record?.Uuid).sort((a, b) => { return b.Id - a.Id }).slice(0, 5)

    const lastfiles = (Files.list || []).filter(u => u.ParentID === selected_record?.Uuid).sort((a, b) => { return b.Id - a.Id }).slice(0, 5)

    const patientstocks = (Patientstocks.list || []).filter(u => u.PatientID === selected_record?.Uuid && !u.Ismedicine && u.Isapproved).map(stock => {
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      let amount = 0.0;
      let movements = (Patientstockmovements.list || []).filter(u => u.StockID === stock.Uuid && u.Isactive && u.Isapproved)
      movements.forEach(movement => {
        amount += (movement.Amount * movement.Movementtype);
      });
      return { ...stock, Amount: amount, Stockname: stockdefine?.Name, Unitname: unit?.Name || '' }
    })

    const patientmedicines = (Patientstocks.list || []).filter(u => u.PatientID === selected_record?.Uuid && u.Ismedicine && u.Isapproved).map(stock => {
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      let amount = 0.0;
      let movements = (Patientstockmovements.list || []).filter(u => u.StockID === stock.Uuid && u.Isactive && u.Isapproved)
      movements.forEach(movement => {
        amount += (movement.Amount * movement.Movementtype);
      });
      return { ...stock, Amount: amount, Stockname: stockdefine?.Name, Unitname: unit?.Name || '' }
    })

    let patientCash = 0.0;
    (Patientcashmovements.list || []).filter(u => u.PatientID === selected_record?.Uuid && u.Isactive).forEach(cash => {
      patientCash += cash.Movementtype * cash.Movementvalue
    })
    const [integerPart, decimalPart] = patientCash.toFixed(2).split('.')

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
          <Contentwrapper additionalStyle="max-h-[calc(91vh-59px-2rem)]">
            <Grid divided className='w-full flex justify-center items-center'>
              <Grid.Row>
                <GridColumn width={14} >
                  <Grid.Row className='flex justify-between items-center'>
                    <Label size='huge' style={{ backgroundColor: casedata?.Casecolor }} horizontal>{casedata?.Name}</Label>
                    <div className=' flex justify-start items-center'>
                      <Label color='blue' size='big'>Cüzdan : {integerPart}.{decimalPart}₺</Label>
                    </div>
                    <div className='flex justify-start items-center'>
                      <Header as='h1'>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}-${patientdefine?.CountryID}`}</Header>
                    </div>
                  </Grid.Row>
                  <Grid.Row className='mt-8 flex flex-row justify-center items-center w-full gap-4'>
                    <Label size='large' as='a' color='blue' image>
                      {Literals.Details.Costumertype[Profile.Language]}
                      <Label.Detail>{costumertype?.Name}</Label.Detail>
                    </Label>
                    <Label size='large' as='a' color='blue' image>
                      {Literals.Details.Patienttype[Profile.Language]}
                      <Label.Detail>{patienttype?.Name}</Label.Detail>
                    </Label>
                    <Label size='large' as='a' color='blue' image>
                      {Literals.Details.Floor[Profile.Language]}
                      <Label.Detail>{floor?.Name}</Label.Detail>
                    </Label>
                    <Label size='large' as='a' color='blue' image>
                      {Literals.Details.Room[Profile.Language]}
                      <Label.Detail>{room?.Name}</Label.Detail>
                    </Label>
                    <Label size='large' as='a' color='blue' image>
                      {Literals.Details.Bed[Profile.Language]}
                      <Label.Detail>{bed?.Name}</Label.Detail>
                    </Label>
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
                        <Label color='blue' basic>{Literals.Details.Last5incomemovement[Profile.Language]}</Label>
                        <DataTable
                          Columns={stocksColumns}
                          Data={lastincomestocks}
                        />
                        <Pagedivider />
                        <Label color='blue' basic>{Literals.Details.Last5outcomemovement[Profile.Language]}</Label>
                        <DataTable
                          Columns={stocksColumns}
                          Data={lastoutcomestocks}
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <Label color='blue' basic>{Literals.Details.Last5movement[Profile.Language]}</Label>
                        <DataTable
                          Columns={movementColumns}
                          Data={lastmovements}
                        />
                        <Pagedivider />
                        <Label color='blue' basic>{Literals.Details.Last5File[Profile.Language]}</Label>
                        <DataTable
                          Columns={fileColumns}
                          Data={lastfiles}
                        />
                        <Pagedivider />
                        <Label color='blue' basic>{Literals.Details.PatientStocks[Profile.Language]}</Label>
                        <DataTable
                          Columns={stockandmedicineColumns}
                          Data={patientstocks}
                        />
                        <Pagedivider />
                        <Label color='blue' basic>{Literals.Details.Patientmedicines[Profile.Language]}</Label>
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
                    <Button primary fluid onClick={() => { history.push(`/Patients/${Id}/Editcase`) }}>{Literals.Button.Changestatus[Profile.Language]}</Button>
                    <Button primary fluid onClick={() => { history.push(`/Patients/${Id}/Editcash`) }}>{Literals.Button.Editcash[Profile.Language]}</Button>
                    <Button primary fluid onClick={() => { handlePlacemodal(true) }}>{Literals.Button.Changeplace[Profile.Language]}</Button>
                    <Button primary fluid onClick={() => { history.push(`/Patients/${Id}/Editroutine`) }}>{Literals.Button.Changetodos[Profile.Language]}</Button>
                    <Button primary fluid onClick={() => { history.push(`/Patients/${Id}/Editfile`) }}>{Literals.Button.Editfiles[Profile.Language]}</Button>
                    <Button primary fluid onClick={() => { history.push(`/Patientdefines/${patientdefine.Uuid}/edit`, { redirectUrl: "/Patients/" + Id }) }}>{Literals.Button.Editdefine[Profile.Language]}</Button>
                  </div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid columns={2} divided>
                  <Grid.Column>
                    <Label color='blue' basic>{Literals.Details.Completedtodos[Profile.Language]}</Label>
                    <DataTable
                      Columns={todoColumns}
                      Data={completedTodos}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Label color='blue' basic>{Literals.Details.Noncompletedtodos[Profile.Language]}</Label>
                    <DataTable
                      Columns={todoColumns}
                      Data={waitingTodos}
                    />
                  </Grid.Column>
                </Grid>
              </Grid.Row>
            </Grid>
          </Contentwrapper>
          <PatientsIn />
          <PatientsOut />
          <PatientsEditplace />
        </Pagewrapper >
    )
  }

  dateCellhandler = (col) => {
    if (col.value) {
      return col.value.split('T').length > 0 ? col.value.split('T')[0] : col.value
    }
    return null
  }

  tododefineCellhandler = (col) => {
    const { Tododefines } = this.props
    if (Tododefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Tododefines.list || []).find(u => u.Uuid === col.value)?.Name
    }
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
