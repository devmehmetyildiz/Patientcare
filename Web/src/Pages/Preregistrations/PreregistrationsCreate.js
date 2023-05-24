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

  render() {

    const { Patientdefines, Patients, Departments, Cases, removePatientnotification, removePatientdefinenotification
      , removeDepartmentnotification, removeCasenotification } = this.props
    const { isLoading, isDispatching } = Patients

    Notification(Patients.notifications, removePatientnotification)
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Cases.notifications, removeCasenotification)
    Notification(Patientdefines.notifications, removePatientdefinenotification)


    const Patientdefineoptions = Patientdefines.list.map(define => {
      return { key: define.concurrencyStamp, text: `${define.firstname} ${define.lastname}-${define.countryID}`, value: define.concurrencyStamp }
    })

    const Departmentoptions = Departments.list.map(department => {
      return { key: department.concurrencyStamp, text: department.name, value: department.concurrencyStamp }
    })

    const Casesoptions = Cases.list.filter(u => u.caseStatus !== 1).map(cases => {
      return { key: cases.concurrencyStamp, text: cases.name, value: cases.concurrencyStamp }
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
                      <Form.Input placeholder="Hasta Adı" name="firstname" fluid />
                    </FormField>
                    <Form.Input label="Hasta Soyadı" placeholder="Hasta Soyadı" name="lastname" fluid />
                    <Form.Input label="Baba Adı" placeholder="Baba Adı" name="fathername" fluid />
                    <Form.Input label="Anne Adı" placeholder="Anne Adı" name="mothername" fluid />
                  </Form.Group>
                  <Form.Group widths={'equal'}>
                    <Form.Input label="TC Kimlik No" placeholder="TC Kimlik No" name="countryID" fluid />
                    <Form.Input label="Doğum Tarihi" placeholder="Doğum Tarihi" name="dateofbirth" type='date' fluid />
                    <Form.Input label="Doğum Yeri" placeholder="Doğum Yeri" name="placeofbirth" fluid />
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
                <Form.Input label="Kayıt Tarihi" placeholder="Kayıt Tarihi" name="registerdate" type='date' fluid />
                <Form.Input label="Kuruma Giriş Tarihi" placeholder="Kuruma Giriş Tarihi" name="approvaldate" type='date' fluid />
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
    if (data.registerdate === '' || data.registerdate === undefined) {
      data.registerdate = null
    }
    if (data.approvaldate === '' || data.approvaldate === undefined) {
      data.approvaldate = null
    }
    const response = {
      id: 0,
      concurrencyStamp: null,
      createdUser: null,
      updatedUser: null,
      deleteUser: null,
      createTime: null,
      updateTime: null,
      deleteTime: null,
      isActive: true,
      stocks: [],
      patientstatus: 0,
      files: [],
      releasedate: null,
      roomnumber: 0,
      floornumber: 0,
      bednumber: 0,
      departmentname: "",
      iswaitingactivation: true,
      imageID: "",
      department: {},
      case: {},
      patientdefineID: "",
      patientdefine: {},
      approvaldate: data.approvaldate,
      registerdate: data.registerdate,
      departmentid: selectedDepartment,
      checkperiodID: "",
      checkperiod: {},
      todogroupdefineID: "",
      todogroupdefine: {},
      caseId: selectedCase
    }

    if (this.state.newRegister) {
      response.patientdefine = {
        countryID: data.countryID,
        dateofbirth: data.dateofbirth,
        fathername: data.fathername,
        firstname: data.firstname,
        lastname: data.lastname,
        mothername: data.mothername,
        placeofbirth: data.placeofbirth,
        gender: selectedGenderstatus,
        Motherbiologicalaffinity: "",
        Ismotheralive: false,
        Fatherbiologicalaffinity: "",
        isfatheralive: false,
        dateofdeath: null,
        placeofdeath: "",
        deathinfo: "",
        marialstatus: "",
        criminalrecord: "",
        childnumber: 0,
        disabledchildnumber: 0,
        siblingstatus: "",
        sgkstatus: "",
        budgetstatus: "",
        town: "",
        city: "",
        address1: "",
        address2: "",
        country: "",
        contactnumber1: "",
        contactnumber2: "",
        contactname1: "",
        contactname2: "",
        costumertypeid: "",
        patienttypeid: "",
        costumertype: {},
        patienttype: {},
        id: 0,
        concurrencyStamp: null,
        createdUser: null,
        updatedUser: null,
        deleteUser: null,
        createTime: null,
        updateTime: null,
        deleteTime: null,
        isActive: true,
      }
    } else {
      response.patientdefine = Patientdefines.list.find(u => u.concurrencyStamp === selectedPatientdefine)
      response.patientdefineID = response.patientdefine.concurrencyStamp
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
      AddPatients(response, history, "/Preregistrations")
    }
  }

  handleChangePatienttype = (e, { value }) => {
    alert("hello")
    e.preventDefault()

  }

}
