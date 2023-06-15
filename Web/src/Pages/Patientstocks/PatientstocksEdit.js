import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'

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
    const { Patientstocks, Patients, Departments, Stockdefines } = this.props
    const { selected_record } = Patientstocks

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
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Patientstocks"}>
                  <Breadcrumb.Section >Ürünler</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Güncelle</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={this.handleSubmit}>
              <Form.Group widths='equal'>
                <Form.Field>
                  <label className='text-[#000000de]'>{this.state.isInprepatients ? "Ön Kayıtlı Hastalar" : "Kurumdaki Hastalar"}
                    <Button onClick={(e) => { this.handleChangePatienttype(e) }} className='cursor-pointer ' circular size='mini' icon="redo"></Button></label>
                  <Dropdown value={this.state.selectedpatient} loading={Patients.isLoading} fluid selection options={Patientoptions} onChange={this.handleChangePatient} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Ürün
                    <Button style={{ visibility: 'hidden' }} onClick={(e) => { e.preventDefault() }} circular size='mini' icon="redo"></Button>
                  </label>
                  <Dropdown placeholder='Ürün' fluid selection options={Stockdefineoptions} onChange={this.handleChangeStockdefine} value={this.state.selectedstockdefine} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths='equal'>
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input label="Barkod No" placeholder="Barkod No" name="Barcodeno" fluid defaultValue={selected_record.Barcodeno} />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Field>
                  <Form.Input label="Skt" placeholder="Skt" name="Skt" fluid type='date' defaultValue={this.getLocalDate(selected_record.Skt)} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Departmanlar</label>
                  <Dropdown placeholder='Departmanlar' fluid selection options={Departmentoptions} onChange={this.handleChangeDepartment} value={this.state.selecteddepartments} />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Patientstocks">
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
    const { EditPatientstocks, history, fillPatientstocknotification, Patientstocks } = this.props
    const data = formToObject(e.target)
    data.DepartmentID = this.state.selecteddepartments
    data.StockdefineID = this.state.selectedstockdefine
    data.PatientID = this.state.selectedpatient

    let errors = []
    if (!data.DepartmentID || data.DepartmentID === '') {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Departman Seçili Değil' })
    }
    if (!data.PatientID || data.PatientID === '') {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Hasta Seçili Değil' })
    }
    if (!data.StockdefineID || data.StockdefineID === '') {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Ürün Seçili Değil' })
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