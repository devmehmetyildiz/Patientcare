import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form, FormField, Popup } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'

export default class PreregistrationsCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      newRegister: false,
      selectedGenderstatus: "",
      selectedDepartment: "",
      selectedCase: "",
      selectedPatientdefine: ""
    }
  }


  componentDidMount() {
    const { GetPatientdefines, GetDepartments, GetCases } = this.props
    GetPatientdefines()
    GetDepartments()
    GetCases()
  }

  componentDidUpdate() {
    const { Patientdefines, Patients, Departments, Cases, removePatientnotification, removePatientdefinenotification
      , removeDepartmentnotification, removeCasenotification } = this.props
    Notification(Patients.notifications, removePatientnotification)
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Cases.notifications, removeCasenotification)
    Notification(Patientdefines.notifications, removePatientdefinenotification)
  }

  render() {

    const { Patientdefines, Patients, Departments, Cases, } = this.props
    const { isLoading, isDispatching } = Patients


    const Patientdefineoptions = Patientdefines.list.map(define => {
      return { key: define.Uuid, text: `${define.Firstname} ${define.Lastname}-${define.CountryID}`, value: define.Uuid }
    })

    const Departmentoptions = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    const Casesoptions = Cases.list.filter(u => u.Casestatus !== 1).map(cases => {
      return { key: cases.Uuid, text: cases.Name, value: cases.Uuid }
    })

    const Genderoptions = [
      { key: 0, text: 'ERKEK', value: "ERKEK" },
      { key: 1, text: 'KADIN', value: "KADIN" }
    ]

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
              {!this.state.newRegister ?
                <Form.Field>
                  <label className='text-[#000000de]'>Hasta Tanımı
                    <Popup
                      trigger={<Button onClick={(e) => {
                        e.preventDefault()
                        this.setState({ newRegister: !this.state.newRegister })
                      }} className='cursor-pointer ' circular size='mini' icon="redo"></Button>}
                      content={`${!this.state.newRegister ? 'Kayıtlı Olmayan' : 'Kayıtlı'} Hasta Girişi İçin Tıklanıyız`}
                      position='top left'
                    />
                  </label>
                  <Dropdown label="Kayıtlı Hastalar" placeholder='Kayıtlı Hastalar' clearable search fluid selection options={Patientdefineoptions} onChange={(e, { value }) => { this.setState({ selectedPatientdefine: value }) }} />
                </Form.Field> :
                <React.Fragment>
                  <Form.Group widths={'equal'}>
                    <FormField className='relative'>
                      <label className='text-[#000000de]'>Hasta Adı
                        <Popup
                          trigger={<Button onClick={(e) => {
                            e.preventDefault()
                            this.setState({ newRegister: !this.state.newRegister })
                          }} className='cursor-pointer absolute -top-2 left-20' circular size='mini' icon="redo"></Button>}
                          content={`${!this.state.newRegister ? 'Kayıtlı Olmayan' : 'Kayıtlı'} Hasta Girişi İçin Tıklanıyız`}
                          position='top left'

                        />
                      </label>
                      <Form.Input placeholder="Hasta Adı" name="Firstname" fluid />
                    </FormField>
                    <Form.Input label="Hasta Soyadı" placeholder="Hasta Soyadı" name="Lastname" fluid />
                    <Form.Input label="Baba Adı" placeholder="Baba Adı" name="Fathername" fluid />
                    <Form.Input label="Anne Adı" placeholder="Anne Adı" name="Mothername" fluid />
                  </Form.Group>
                  <Form.Group widths={'equal'}>
                    <Form.Input label="TC Kimlik No" placeholder="TC Kimlik No" name="CountryID" fluid />
                    <Form.Input label="Doğum Tarihi" placeholder="Doğum Tarihi" name="Dateofbirth" type='date' fluid />
                    <Form.Input label="Doğum Yeri" placeholder="Doğum Yeri" name="Placeofbirth" fluid />
                    <Form.Field>
                      <label className='text-[#000000de]'>Cinsiyet</label>
                      <Dropdown placeholder='Cinsiyet' fluid selection options={Genderoptions} onChange={(e, { value }) => { this.setState({ selectedGenderstatus: value }) }} />
                    </Form.Field>
                  </Form.Group>
                </React.Fragment>
              }
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label className='text-[#000000de]'>Departman</label>
                  <Dropdown placeholder='Departman' fluid selection options={Departmentoptions} onChange={(e, { value }) => { this.setState({ selectedDepartment: value }) }} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Durum</label>
                  <Dropdown placeholder='Durum' fluid selection options={Casesoptions} onChange={(e, { value }) => { this.setState({ selectedCase: value }) }} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Input label="Kayıt Tarihi" placeholder="Kayıt Tarihi" name="Registerdate" type='date' fluid />
                <Form.Input label="Kuruma Giriş Tarihi" placeholder="Kuruma Giriş Tarihi" name="Approvaldate" type='date' fluid />
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Preregistrations">
                  <Button floated="left" color='grey'>Geri Dön</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>Oluştur</Button>
              </div>
            </Form>
          </div>
        </div>
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { Patientdefines, fillPatientnotification, AddPatients, history } = this.props
    const { selectedCase, selectedDepartment, selectedGenderstatus, selectedPatientdefine } = this.state
    const data = formToObject(e.target)
    if (data.Registerdate === '' || data.Registerdate === undefined) {
      data.Registerdate = null
    }
    if (data.Approvaldate === '' || data.Approvaldate === undefined) {
      data.Approvaldate = null
    }
    const response = {
      Stocks: [],
      Patientstatus: 0,
      Files: [],
      Releasedate: null,
      Roomnumber: 0,
      Floornumber: 0,
      Bednumber: 0,
      Iswaitingactivation: true,
      ImageID: "",
      PatientdefineID: "",
      Patientdefine: {},
      Approvaldate: data.Approvaldate,
      Registerdate: data.Registerdate,
      DepartmentID: selectedDepartment,
      CheckperiodID: "",
      TodogroupdefineID: "",
      CaseID: selectedCase
    }

    if (this.state.newRegister) {
      response.Patientdefine = {
        CountryID: data.CountryID,
        Dateofbirth: data.Dateofbirth,
        Fathername: data.Fathername,
        Firstname: data.Firstname,
        Lastname: data.Lastname,
        Mothername: data.Mothername,
        Placeofbirth: data.Placeofbirth,
        Gender: selectedGenderstatus,
        CostumertypeID: "",
        PatienttypeID: "",
      }
    } else {
      response.Patientdefine = Patientdefines.list.find(u => u.Uuid === selectedPatientdefine)
      response.PatientdefineID = response.Patientdefine.Uuid
    }

    let errors = []
    /* if (!data.name || data.name == '') {
      errors.push({ type: 'Error', code: 'Patient PreRegis', description: 'İsim Boş Olamaz' })
    } */
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientnotification(error)
      })
    } else {
      AddPatients({ data: response, history, url: "/Preregistrations" })
    }
  }

  handleChangePatienttype = (e, { value }) => {
    alert("hello")
    e.preventDefault()

  }

}
