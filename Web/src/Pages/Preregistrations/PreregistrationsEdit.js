import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form, } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'

export default class PreregistrationsEdit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      newRegister: false,
      selectedDepartment: "",
      selectedCase: "",
      selectedPatientdefine: ""
    }
  }


  componentDidMount() {
    const { GetPatientdefines, GetPatient, GetDepartments, GetCases, match, history } = this.props
    if (match.params.PatientID) {
      GetPatient(match.params.PatientID)
      GetPatientdefines()
      GetDepartments()
      GetCases()
    } else {
      history.push("/Preregistrations")
    }
  }

  componentDidUpdate() {
    const { Departments, Cases, Patientdefines, Patients,
      removeDepartmentnotification, removeCasenotification,
      removePatientnotification, removePatientdefinenotification } = this.props
    const { selected_record, isLoading } = Patients
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 &&
      Departments.list.length > 0 && !Departments.isLoading &&
      Cases.list.length > 0 && !Cases.isLoading &&
      Patientdefines.list.length > 0 && !Patientdefines.isLoading &&
      !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true,
        selectedCase: selected_record.CaseID,
        selectedDepartment: selected_record.DepartmentID,
        selectedPatientdefine: selected_record.PatientdefineID
      })
    }
    Notification(Patients.notifications, removePatientnotification)
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Cases.notifications, removeCasenotification)
    Notification(Patientdefines.notifications, removePatientdefinenotification)
  }


  render() {

    const { Patientdefines, Patients, Departments, Cases } = this.props
    const { isLoading, isDispatching, selected_record } = Patients

    const Patientdefineoptions = Patientdefines.list.map(define => {
      return { key: define.Uuid, text: `${define.Firstname} ${define.Lastname}-${define.CountryID}`, value: define.Uuid }
    })

    const Departmentoptions = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    const Casesoptions = Cases.list.filter(u => u.Casestatus !== 1).map(cases => {
      return { key: cases.Uuid, text: cases.Name, value: cases.Uuid }
    })


    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Preregistrations"}>
                  <Breadcrumb.Section >Ön Kayıtlar</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Oluştur</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='relative w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>

            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <label className='text-[#000000de]'>Hasta Tanımı </label>
                <Dropdown value={this.state.selectedPatientdefine} label="Kayıtlı Hastalar" placeholder='Kayıtlı Hastalar' clearable search fluid selection options={Patientdefineoptions} onChange={(e, { value }) => { this.setState({ selectedPatientdefine: value }) }} />
              </Form.Field>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label className='text-[#000000de]'>Departman</label>
                  <Dropdown value={this.state.selectedDepartment} placeholder='Departman' fluid selection options={Departmentoptions} onChange={(e, { value }) => { this.setState({ selectedDepartment: value }) }} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Durum</label>
                  <Dropdown value={this.state.selectedCase} placeholder='Durum' fluid selection options={Casesoptions} onChange={(e, { value }) => { this.setState({ selectedCase: value }) }} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Input defaultValue={selected_record.Registerdate && selected_record.Registerdate.split('T')[0]} label="Kayıt Tarihi" placeholder="Kayıt Tarihi" name="Registerdate" type='date' fluid />
                <Form.Input defaultValue={selected_record.Registerdate && selected_record.Registerdate.split('T')[0]} label="Kuruma Giriş Tarihi" placeholder="Kuruma Giriş Tarihi" name="Approvaldate" type='date' fluid />
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Preregistrations">
                  <Button floated="left" color='grey'>Geri Dön</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>Güncelle</Button>
              </div>
            </Form>
          </div>
        </div>
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { fillPatientnotification, Patients, EditPatients, history } = this.props
    const data = formToObject(e.target)
    if (data.Registerdate === '' || data.Registerdate === undefined) {
      data.Registerdate = null
    }
    if (data.Approvaldate === '' || data.Approvaldate === undefined) {
      data.Approvaldate = null
    }

    data.CaseID = this.state.selectedCase
    data.DepartmentID = this.state.selectedDepartment
    data.PatientdefineID = this.state.selectedPatientdefine

    let errors = []
    /* if (!data.name || data.name == '') {
      errors.push({ type: 'Error', code: 'Patient PreRegis', description: 'İsim Boş Olamaz' })
    } */
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientnotification(error)
      })
    } else {
      EditPatients({ data: { ...Patients.selected_record, ...data }, history, url: "/Preregistrations" })
    }
  }

}
