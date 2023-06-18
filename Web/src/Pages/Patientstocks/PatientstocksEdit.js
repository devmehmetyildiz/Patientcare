import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'
import FormInput from '../../Utils/FormInput'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
export default class PatientstocksEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selecteddepartments: "",
      selectedstockdefine: "",
      selectedpatient: "",
      open: false,
      isInprepatients: false,
      isDatafetched: false
    }
  }


  componentDidMount() {
    const { GetPatientstock, match, history, GetDepartments, GetStockdefines } = this.props
    if (match.params.PatientstockID) {
      GetPatientstock(match.params.PatientstockID)
      GetDepartments()
      GetStockdefines()
    } else {
      history.push("/Patientstocks")
    }
  }

  componentDidUpdate() {
    const { Departments, Stockdefines, Patientstocks, Patients, GetPatients, Getpreregistrations,
      removePatientnotification, removePatientstocknotification, removeStockdefinenotification, removeDepartmentnotification } = this.props
    const { selected_record, isLoading } = Patientstocks
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && Departments.list.length > 0 && !Departments.isLoading
      && Stockdefines.list.length > 0 && !Stockdefines.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selecteddepartments: selected_record.DepartmentID,
        selectedstockdefine: selected_record.StockdefineID,
        selectedpatient: selected_record.PatientID,
        isDatafetched: true,
        isInprepatients: selected_record.Patient?.ıswaitingactivation
      }, () => {
        if (selected_record.Patient?.Iswaitingactivation) {
          Getpreregistrations()
        } else {
          GetPatients()
        }
      })
    }
    Notification(Patientstocks.notifications, removePatientstocknotification)
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Stockdefines.notifications, removeStockdefinenotification)
    Notification(Patients.notifications, removePatientnotification)
  }

  render() {
    const { Patientstocks, Patients, Departments, Stockdefines,Profile } = this.props

    const Departmentoptions = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })
    const Stockdefineoptions = Stockdefines.list.map(define => {
      return { key: define.Uuid, text: define.Name, value: define.Uuid }
    })
    const Patientoptions = Patients.list.map(patient => {
      return { key: patient.Uuid, text: `${patient?.Patientdefine?.Firstname} ${patient?.Patientdefine?.Lastname} - ${patient?.Patientdefine?.CountryID}`, value: patient.Uuid }
    })
    return (
      Stockdefines.isLoading || Stockdefines.isDispatching || Patientstocks.isLoading || Patientstocks.isDispatching || Departments.isLoading || Departments.isDispatching ? <LoadingPage /> :
      <Pagewrapper>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Patientstocks"}>
            <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
        </Headerbredcrump>
      </Headerwrapper>
      <Pagedivider />
      <Contentwrapper>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group widths='equal'>
            <Form.Field>
              <label className='text-[#000000de]'>{this.state.isInprepatients ? Literals.Columns.NotInTheDepartment[Profile.Language] : Literals.Columns.InTheDepartment[Profile.Language]}
                <Button onClick={(e) => { this.handleChangePatienttype(e) }} className='cursor-pointer ' circular size='mini' icon="redo"></Button></label>
              <Dropdown loading={Patients.isLoading} value={this.state.selectedpatient} fluid selection options={Patientoptions} onChange={this.handleChangePatient} />
            </Form.Field>
            <FormInput placeholder={Literals.Columns.Stockdefine[Profile.Language]} value={this.state.selectedstockdefine} options={Stockdefineoptions} onChange={this.handleChangeStockdefine} formtype="dropdown" />
          </Form.Group>
          <Form.Group widths='equal'>
            <FormInput placeholder={Literals.Columns.Barcodeno[Profile.Language]} name="Barcodeno" />
            <FormInput placeholder={Literals.Columns.Amount[Profile.Language]} name="Amount" step="0.01" type='number' />
          </Form.Group>
          <Form.Group widths='equal'>
            <FormInput placeholder={Literals.Columns.Skt[Profile.Language]} name="Skt" type='date' defaultValue={this.getLocalDate()} />
            <FormInput placeholder={Literals.Columns.Department[Profile.Language]} value={this.state.selecteddepartments} options={Departmentoptions} onChange={this.handleChangeDepartment} formtype="dropdown" />
          </Form.Group>
          <Footerwrapper>
            <Link to="/Patientstocks">
              <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
            </Link>
            <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
          </Footerwrapper>
        </Form>
      </Contentwrapper>
    </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditPatientstocks, history, fillPatientstocknotification, Patientstocks,Profile } = this.props
    const data = formToObject(e.target)
    data.DepartmentID = this.state.selecteddepartments
    data.StockdefineID = this.state.selectedstockdefine
    data.PatientID = this.state.selectedpatient
    data.Amount = parseFloat(data.Amount)
    let errors = []
    if (!validator.isUUID(data.DepartmentID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.DepartmentRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.PatientID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.PatientRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.StockdefineID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.StokdefineRequired[Profile.Language] })
    }
    if (!validator.isNumber(data.Amount)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.AmountRequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientstocknotification(error)
      })
    } else {
      EditPatientstocks({ data: { ...Patientstocks.selected_record, ...data }, history })
    }
  }


  handleChangeDepartment = (e, { value }) => {
    this.setState({ selecteddepartments: value })
  }

  handleChangeStockdefine = (e, { value }) => {
    this.setState({ selectedstockdefine: value })
  }
  handleChangePatient = (e, { value }) => {
    this.setState({ selectedpatient: value })
  }

  getLocalDate = (inputdate) => {
    if (inputdate) {
      let res = inputdate.split('T')
      return res[0]
    }
  }
}