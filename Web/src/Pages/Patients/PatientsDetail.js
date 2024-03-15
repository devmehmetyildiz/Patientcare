import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Dimmer, Header, Icon, Label, Loader, Modal, Popup, Transition } from 'semantic-ui-react'
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
  Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, MobileTable
} from '../../Components'
import axios from 'axios'
export default class PatientsDetail extends Component {

  PAGE_NAME = 'PatientsDetail'

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      fileDownloading: false,
      detailModalopen: false,
      functionModalopen: false,
    }
  }

  componentDidMount() {
    this.fetchdata()
  }

  fetchdata = () => {
    const {
      GetPatient, match, history, PatientID,
      GetPatientdefines, GetCases, GetCostumertypes,
      GetPatienttypes, GetFloors, GetRooms, GetBeds,
      GetPatientstocks, GetStockdefines, GetUnits, GetTodosbyPatient,
      GetPatientmovements, GetFiles, GetPatientstockmovements, GetTododefines,
      GetPatientcashmovements, GetPatientcashregisters, GetUsagetypes
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
      GetPatientcashregisters()
      GetUsagetypes()
    } else {
      history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
    }
  }

  componentDidUpdate(prevprops) {
    const {
      Patients, Tododefines,
      Patientdefines, Cases, Patientstockmovements,
      Costumertypes, Patienttypes,
      Floors, Rooms, Beds,
      Patientstocks, Stockdefines, Units,
      Patientcashmovements, Usagetypes,
      Patientmovements, Files, Todos, Patientcashregisters, PatientID, match } = this.props

    let Id = PatientID || match?.params?.PatientID
    let prevId = prevprops?.PatientID || prevprops?.match?.params?.PatientID
    if (Id !== prevId) {
      this.fetchdata()
    }

    const { selected_record } = Patients

    const isLoadingstatus =
      Patients.isLoading ||
      Patientdefines.isLoading ||
      Cases.isLoading ||
      Patienttypes.isLoading||
      Costumertypes.isLoading||
      Floors.isLoading||
      Rooms.isLoading ||
      Beds.isLoading||
      Patientstocks.isLoading ||
      Stockdefines.isLoading ||
      Units.isLoading||
      Patientmovements.isLoading ||
      Patientstockmovements.isLoading ||
      Files.isLoading||
      Todos.isLoading ||
      Tododefines.isLoading ||
      Patientcashregisters.isLoading ||
      Usagetypes.isLoading ||
      Patientcashmovements.isLoading

    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoadingstatus && !this.state.isDatafetched) {
      this.setState({ isDatafetched: true })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const {
      Patients, Patientdefines, Cases, Costumertypes, Patienttypes,
      Floors, Rooms, Beds, Patientstocks, Stockdefines, Units, Patientstockmovements,
      Patientmovements, Files, Profile, history, match, PatientID,
      Patientcashmovements, handlePlacemodal, Patientcashregisters, Usagetypes
    } = this.props


    const Id = match.params.PatientID || PatientID

    const { selected_record } = Patients

    const isLoadingstatus =
      Patients.isLoading ||
      Patientdefines.isLoading ||
      Cases.isLoading ||
      Patienttypes.isLoading||
      Costumertypes.isLoading||
      Floors.isLoading||
      Rooms.isLoading ||
      Beds.isLoading||
      Patientstocks.isLoading ||
      Stockdefines.isLoading ||
      Units.isLoading||
      Patientmovements.isLoading ||
      Patientstockmovements.isLoading ||
      Files.isLoading||
      Patientcashregisters.isLoading ||
      Usagetypes.isLoading ||
      Patientcashmovements.isLoading


    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === selected_record?.PatientdefineID)
    const costumertype = (Costumertypes.list || []).find(u => u.Uuid === patientdefine?.CostumertypeID)
    const patienttype = (Patienttypes.list || []).find(u => u.Uuid === patientdefine?.PatienttypeID)

    const floor = (Floors.list || []).find(u => u.Uuid === selected_record?.FloorID)
    const room = (Rooms.list || []).find(u => u.Uuid === selected_record?.RoomID)
    const bed = (Beds.list || []).find(u => u.Uuid === selected_record?.BedID)

    const casedata = (Cases.list || []).find(u => u.Uuid === selected_record?.CaseID)

    let usagetypePP = (Usagetypes.list || []).find(u => u.Value === 'PP')?.Uuid || null
    const files = (Files.list || []).find(u => u.ParentID === selected_record?.Uuid && (((u.Usagetype || '').split(',')) || []).includes(usagetypePP) && u.Isactive)

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const stocksColumns = [
      { Header: Literals.Details.Stockname[Profile.Language], accessor: 'Stockname', Lowtitle: true, Withtext: true },
      { Header: Literals.Details.Amount[Profile.Language], accessor: 'Amount', Lowtitle: true, Withtext: true },
      { Header: Literals.Details.Unitname[Profile.Language], accessor: 'Unitname', Lowtitle: true, Withtext: true },
      { Header: Literals.Details.Movementdate[Profile.Language], accessor: row => this.dateCellhandler(row?.Movementdate), Lowtitle: true, Withtext: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const stockandmedicineColumns = [
      { Header: Literals.Details.Stockname[Profile.Language], accessor: 'Stockname' },
      { Header: Literals.Details.Amount[Profile.Language], accessor: 'Amount' },
      { Header: Literals.Details.Unitname[Profile.Language], accessor: 'Unitname' },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const movementColumns = [
      { Header: Literals.Details.Patientmovementype[Profile.Language], accessor: row => this.patientmovementCellhandler(row?.Patientmovementtype), Lowtitle: true, Withtext: true },
      { Header: Literals.Details.Movementdate[Profile.Language], accessor: row => this.dateCellhandler(row?.Movementdate), Lowtitle: true, Withtext: true },
      { Header: Literals.Details.IsComplated[Profile.Language], accessor: row => this.boolCellhandler(row?.IsComplated), Lowtitle: true, Withtext: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const fileColumns = [
      { Header: Literals.Details.Filename[Profile.Language], accessor: 'Filename', Lowtitle: true, Withtext: true, Cell: (col, row) => this.filenameCellhandler(col, row), },
      { Header: Literals.Details.Filetype[Profile.Language], accessor: 'Filetype', Lowtitle: true, Withtext: true },
      { Header: Literals.Details.Usagetype[Profile.Language], accessor: row => this.usagetypeCellhandler(row?.Usagetype), Lowtitle: true, Withtext: true }
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
    let patientCashdetail = [];

    (Patientcashmovements.list || []).filter(u => u.PatientID === selected_record?.Uuid && u.Isactive).forEach(cash => {
      patientCash += cash.Movementtype * cash.Movementvalue
      let registername = (Patientcashregisters.list || []).find(u => u.Uuid === cash.RegisterID)?.Name || 'tanımsız'
      patientCashdetail.push({ label: registername, value: cash.Movementtype * cash.Movementvalue, key: cash.RegisterID })
    })
    const [integerPart, decimalPart] = patientCash.toFixed(2).split('.')

    let fixedpatientCashdetail = [];
    patientCashdetail.forEach(cash => {
      let fixeditem = fixedpatientCashdetail.find(u => u.key === cash.key)
      if (fixeditem) {
        fixeditem.value += cash?.value
      } else {
        fixedpatientCashdetail.push(cash)
      }
    });

    const options = {
      en: 'Manage',
      tr: 'İşlemler'
    }
    const details = {
      en: 'Patient Detail',
      tr: 'Hasta Künyesi'
    }

    return (
      isLoadingstatus ? <LoadingPage /> :
        < Pagewrapper >
          <Dimmer active={this.state.fileDownloading}>
            <Loader />
          </Dimmer>
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
          <Contentwrapper >
            <div className='w-full justify-between items-center md:items-start flex flex-col  gap-4'>
              <div className='w-full flex flex-col md:flex-row lg:flex-row mt-4 justify-between items-start  gap-5 md:border-r-2 '>
                <div className='flex justify-start items-center flex-col gap-1 w-full'>
                  <div className='flex justify-start items-center '>
                    <Header as='h3'>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</Header>
                  </div>
                  <div className='flex justify-start items-center'>
                    <Header as='h3'>{`${patientdefine?.CountryID}`}</Header>
                  </div>
                  {files ? <img alt='pp' src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${files?.Uuid}`} className="rounded-full" style={{ width: '100px', height: '100px' }} />
                    : <Header as='h2' icon textAlign='center'><Icon name='users' circular /></Header>}
                  <Label size='huge' style={{ backgroundColor: casedata?.Casecolor }} horizontal>{casedata?.Name}</Label>
                </div>
                {!Profile.Ismobile ?
                  <div className='flex justify-center items-center md:justify-start md:items-start  flex-col  gap-1 w-full' >
                    <Popup
                      trigger={
                        <Label size='large' as='a' className='!bg-[#2355a0] !text-white' image ribbon={!Profile.Ismobile}>
                          {Literals.Details.Wallet[Profile.Language]}:
                          <Label.Detail>{integerPart}.{decimalPart}₺</Label.Detail>
                        </Label>
                      }
                      on='hover'
                      basic
                      onOpen={() => {

                      }}
                      position='bottom center'
                      style={{ height: 'auto', width: 'auto' }
                      } >
                      <div>
                        {fixedpatientCashdetail.map(cash => {
                          const [integerPart, decimalPart] = cash?.value.toFixed(2).split('.')
                          return <Label key={Math.random()} basic>{cash?.label} : {integerPart}.{decimalPart}₺</Label>
                        })}
                      </div>
                    </Popup>
                    <Label size='large' as='a' className='!bg-[#2355a0] !text-white !w-full' image ribbon={!Profile.Ismobile}>
                      {Literals.Details.Costumertype[Profile.Language]}
                      <Label.Detail>{costumertype?.Name}</Label.Detail>
                    </Label>
                    <Label size='large' as='a' className='!bg-[#2355a0] !text-white !w-full' image ribbon={!Profile.Ismobile}>
                      {Literals.Details.Patienttype[Profile.Language]}
                      <Label.Detail>{patienttype?.Name}</Label.Detail>
                    </Label>
                    <Label size='large' as='a' className='!bg-[#2355a0] !text-white !w-full' image ribbon={!Profile.Ismobile}>
                      {Literals.Details.Floor[Profile.Language]}
                      <Label.Detail>{floor?.Name}</Label.Detail>
                    </Label>
                    <Label size='large' as='a' className='!bg-[#2355a0] !text-white !w-full' image ribbon={!Profile.Ismobile}>
                      {Literals.Details.Room[Profile.Language]}
                      <Label.Detail>{room?.Name}</Label.Detail>
                    </Label>
                    <Label size='large' as='a' className='!bg-[#2355a0] !text-white !w-[100%]' image ribbon={!Profile.Ismobile}>
                      {Literals.Details.Bed[Profile.Language]}
                      <Label.Detail>{bed?.Name}</Label.Detail>
                    </Label>
                  </div>
                  : <Modal
                    open={this.state.detailModalopen}
                    onClose={() => { this.setState({ detailModalopen: false }) }}
                    onOpen={() => { this.setState({ detailModalopen: true }) }}
                    basic
                    size='tiny'
                    trigger={<Button onClick={(e) => { e.preventDefault() }} className=' h-fit !m-auto !bg-[#2355a0] !text-white' floated='right'>{details[Profile.Language]}</Button>
                    }>
                    <Modal.Content>
                      <Contentwrapper>
                        <div className='flex justify-center items-center md:justify-start md:items-start  flex-col  gap-1 w-full' >
                          <Popup
                            trigger={
                              <Label size='large' as='a' className='!bg-[#2355a0] !text-white' image ribbon={!Profile.Ismobile}>
                                {Literals.Details.Wallet[Profile.Language]}:
                                <Label.Detail>{integerPart}.{decimalPart}₺</Label.Detail>
                              </Label>
                            }
                            on='hover'
                            basic
                            onOpen={() => {

                            }}
                            position='bottom center'
                            style={{ height: 'auto', width: 'auto' }
                            } >
                            <div>
                              {fixedpatientCashdetail.map(cash => {
                                const [integerPart, decimalPart] = cash?.value.toFixed(2).split('.')
                                return <Label key={Math.random()} basic>{cash?.label} : {integerPart}.{decimalPart}₺</Label>
                              })}
                            </div>
                          </Popup>
                          <Label size='large' as='a' className='!bg-[#2355a0] !text-white' image ribbon={!Profile.Ismobile}>
                            {Literals.Details.Costumertype[Profile.Language]}
                            <Label.Detail>{costumertype?.Name}</Label.Detail>
                          </Label>
                          <Label size='large' as='a' className='!bg-[#2355a0] !text-white' image ribbon={!Profile.Ismobile}>
                            {Literals.Details.Patienttype[Profile.Language]}
                            <Label.Detail>{patienttype?.Name}</Label.Detail>
                          </Label>
                          <Label size='large' as='a' className='!bg-[#2355a0] !text-white ' image ribbon={!Profile.Ismobile}>
                            {Literals.Details.Floor[Profile.Language]}
                            <Label.Detail>{floor?.Name}</Label.Detail>
                          </Label>
                          <Label size='large' as='a' className='!bg-[#2355a0] !text-white ' image ribbon={!Profile.Ismobile}>
                            {Literals.Details.Room[Profile.Language]}
                            <Label.Detail>{room?.Name}</Label.Detail>
                          </Label>
                          <Label size='large' as='a' className='!bg-[#2355a0] !text-white ' image ribbon={!Profile.Ismobile}>
                            {Literals.Details.Bed[Profile.Language]}
                            <Label.Detail>{bed?.Name}</Label.Detail>
                          </Label>
                        </div>
                      </Contentwrapper>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button color='black' onClick={() => {
                        this.setState({ detailModalopen: false })
                      }}>
                        {Literals.Button.Close[Profile.Language]}
                      </Button>
                    </Modal.Actions>
                  </Modal>
                }
                {!Profile.Ismobile ? <React.Fragment>
                  <div className='w-full flex flex-col justify-start items-center gap-3 px-2 md:border-l-2'>
                    <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Addmedicine`) }}>{Literals.Button.Givemedicine[Profile.Language]}</Button>
                    <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Removemedicine`) }}>{Literals.Button.Takemedicine[Profile.Language]}</Button>
                    <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Addstock`) }}>{Literals.Button.GiveStock[Profile.Language]}</Button>
                    <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Removestock`) }}>{Literals.Button.TakeStock[Profile.Language]}</Button>
                    <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Editcase`) }}>{Literals.Button.Changestatus[Profile.Language]}</Button>
                    <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Edit`) }}>{Literals.Button.Editdates[Profile.Language]}</Button>
                  </div>
                  <div className='w-full flex flex-col justify-start items-center gap-3 px-2'>
                    <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Editcash`) }}>{Literals.Button.Editcash[Profile.Language]}</Button>
                    <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { handlePlacemodal(true) }}>{Literals.Button.Changeplace[Profile.Language]}</Button>
                    <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Editroutine`) }}>{Literals.Button.Editroutine[Profile.Language]}</Button>
                    <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Editsupportplan`) }}>{Literals.Button.Editsupportplan[Profile.Language]}</Button>
                    <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Editfile`) }}>{Literals.Button.Editfiles[Profile.Language]}</Button>
                    <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patientdefines/${patientdefine.Uuid}/edit`, { redirectUrl: "/Patients/" + Id }) }}>{Literals.Button.Editdefine[Profile.Language]}</Button>
                  </div>
                </React.Fragment>
                  : <Modal
                    open={this.state.functionModalopen}
                    onClose={() => { this.setState({ functionModalopen: false }) }}
                    onOpen={() => { this.setState({ functionModalopen: true }) }}
                    basic
                    size='tiny'
                    trigger={<Button onClick={(e) => { e.preventDefault() }} className=' h-fit !m-auto !bg-[#2355a0] !text-white' floated='right'>{options[Profile.Language]}</Button>
                    }
                  >
                    <Modal.Content>
                      <div className='w-full flex flex-col justify-start items-center gap-3 px-2 md:border-l-2'>
                        <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Addmedicine`) }}>{Literals.Button.Givemedicine[Profile.Language]}</Button>
                        <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Removemedicine`) }}>{Literals.Button.Takemedicine[Profile.Language]}</Button>
                        <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Addstock`) }}>{Literals.Button.GiveStock[Profile.Language]}</Button>
                        <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Removestock`) }}>{Literals.Button.TakeStock[Profile.Language]}</Button>
                        <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Editcase`) }}>{Literals.Button.Changestatus[Profile.Language]}</Button>
                        <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Editcash`) }}>{Literals.Button.Editcash[Profile.Language]}</Button>
                        <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { handlePlacemodal(true) }}>{Literals.Button.Changeplace[Profile.Language]}</Button>
                        <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Editroutine`) }}>{Literals.Button.Editroutine[Profile.Language]}</Button>
                        <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Editsupportplan`) }}>{Literals.Button.Editsupportplan[Profile.Language]}</Button>
                        <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Editfile`) }}>{Literals.Button.Editfiles[Profile.Language]}</Button>
                        <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patientdefines/${patientdefine.Uuid}/edit`, { redirectUrl: "/Patients/" + Id }) }}>{Literals.Button.Editdefine[Profile.Language]}</Button>
                        <Button className='!bg-[#2355a0] !text-white' fluid onClick={() => { history.push(`/Patients/${Id}/Edit`) }}>{Literals.Button.Editdates[Profile.Language]}</Button>
                      </div>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button color='black' onClick={() => {
                        this.setState({ functionModalopen: false })
                      }}>
                        {Literals.Button.Close[Profile.Language]}
                      </Button>
                    </Modal.Actions>
                  </Modal>
                }
              </div>
              <div className=' w-full flex flex-col justify-start items-start gap-4'>
                <Pagedivider />
                <div className='w-full flex flex-col  justify-center items-center gap-8 overflow-x-auto'>
                  <div className='w-full'>
                    <Label className='!bg-[#ebf5f8] !text-[#333] !mb-2'>{Literals.Details.Last5incomemovement[Profile.Language]}</Label>
                    <Transition >
                      {Profile.Ismobile ?
                        <MobileTable Columns={stocksColumns} Data={lastincomestocks} Profile={Profile} /> :
                        <DataTable Columns={stocksColumns} Data={lastincomestocks} />}
                    </Transition>
                  </div>
                  <Pagedivider />
                  <div className='w-full'>
                    <Label className='!bg-[#ebf5f8] !text-[#333] !mb-2' >{Literals.Details.Last5outcomemovement[Profile.Language]}</Label>
                    {Profile.Ismobile ?
                      <MobileTable Columns={stocksColumns} Data={lastoutcomestocks} Profile={Profile} /> :
                      <DataTable Columns={stocksColumns} Data={lastoutcomestocks} />}
                  </div>
                  <Pagedivider />
                  <div className='w-full'>
                    <Label className='!bg-[#ebf5f8] !text-[#333] !mb-2' >{Literals.Details.Last5movement[Profile.Language]}</Label>
                    {Profile.Ismobile ?
                      <MobileTable Columns={movementColumns} Data={lastmovements} Profile={Profile} /> :
                      <DataTable Columns={movementColumns} Data={lastmovements} />}
                  </div>
                  <Pagedivider />
                  <div className='w-full'>
                    <Label className='!bg-[#ebf5f8] !text-[#333] !mb-2' >{Literals.Details.Last5File[Profile.Language]}</Label>
                    {Profile.Ismobile ?
                      <MobileTable Columns={fileColumns} Data={lastfiles} Profile={Profile} /> :
                      <DataTable Columns={fileColumns} Data={lastfiles} />}
                  </div>
                  <Pagedivider />
                  <div className='w-full'>
                    <Label className='!bg-[#ebf5f8] !text-[#333] !mb-2' >{Literals.Details.PatientStocks[Profile.Language]}</Label>
                    {Profile.Ismobile ?
                      <MobileTable Columns={stockandmedicineColumns} Data={patientstocks} Profile={Profile} /> :
                      <DataTable Columns={stockandmedicineColumns} Data={patientstocks} />}
                  </div>
                  <Pagedivider />
                  <div className='w-full'>
                    <Label className='!bg-[#ebf5f8] !text-[#333] !mb-2' >{Literals.Details.Patientmedicines[Profile.Language]}</Label>
                    {Profile.Ismobile ?
                      <MobileTable Columns={stockandmedicineColumns} Data={patientmedicines} Profile={Profile} /> :
                      <DataTable Columns={stockandmedicineColumns} Data={patientmedicines} />}
                  </div>
                </div>
              </div>
            </div>
          </Contentwrapper>
          <PatientsIn />
          <PatientsOut />
          <PatientsEditplace />
        </Pagewrapper >
    )
  }

  dateCellhandler = (value) => {
    if (value) {
      return value.split('T').length > 0 ? value.split('T')[0] : value
    }
    return null
  }

  tododefineCellhandler = (value) => {
    const { Tododefines } = this.props
    if (Tododefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Tododefines.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  usagetypeCellhandler = (value) => {
    const { Usagetypes } = this.props
    if (Usagetypes.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const usagetypetxt = ((value || '').split(',') || []).map(typeuuid => {
        const type = (Usagetypes.list || []).find(u => u.Uuid === typeuuid)
        return type?.Name
      }).join(',')
      return usagetypetxt
    }
  }

  patientmovementCellhandler = (value) => {
    return PATIENTMOVEMENTTYPE.find(u => u.value === value) ? PATIENTMOVEMENTTYPE.find(u => u.value === value).Name : value
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    return value !== null && (value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }

  filenameCellhandler = (col) => {
    let rowUuid = col?.row?.original?.Uuid

    return (<div className='flex flex-row items-center'>
      {col.value}
      {
        validator.isUUID(rowUuid) &&
        <div className='cursor-pointer' onClick={() => { this.downloadFile(rowUuid, col.value) }}>
          <Icon color='blue' name='download' />
        </div>
      }
    </div>)
  }

  downloadFile = (fileID, fileName) => {
    const { fillPatientnotification, Profile } = this.props
    this.setState({ fileDownloading: true })
    axios.get(`${config.services.File}${ROUTES.FILE}/Downloadfile/${fileID}`, {
      responseType: 'blob'
    }).then((res) => {
      this.setState({ fileDownloading: false })
      const fileType = res.headers['content-type']
      const blob = new Blob([res.data], {
        type: fileType
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      if (fileType.includes('pdf')) {
        window.open(url)
        a.href = null;
        window.URL.revokeObjectURL(url);
      }
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }).catch((err) => {
      this.setState({ fileDownloading: false })
      fillPatientnotification([{ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: err.message }])
      console.log(err.message)
    });
  }

}
PatientsDetail.contextType = FormContext
