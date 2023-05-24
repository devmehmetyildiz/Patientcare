import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form } from 'semantic-ui-react'
import { Breadcrumb, Button,  Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Popuputil from '../../Utils/Popup'
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
    const { Departments, Stockdefines, Patientstocks, Patients, GetPatients, Getpreregistrations, } = this.props
    const { selected_record, isLoading } = Patientstocks
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.id != 0
      && Departments.list.length > 0 && !Departments.isLoading
      && Stockdefines.list.length > 0 && !Stockdefines.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selecteddepartments: selected_record.departmentid,
        selectedstockdefine: selected_record.stockdefineID,
        selectedpatient: selected_record.patientID,
        isDatafetched: true,
        isInprepatients: selected_record.patient?.iswaitingactivation
      }, () => {
        if (selected_record.patient?.iswaitingactivation) {
          Getpreregistrations()
        } else {
          GetPatients()
        }
      })
    }
  }

  render() {
    const { Patientstocks, Patients, removePatientnotification, removePatientstocknotification, Departments, Stockdefines, removeStockdefinenotification, removeDepartmentnotification } = this.props
    const { selected_record } = Patientstocks
    if (Patientstocks.notifications && Patientstocks.notifications.length > 0) {
      let msg = Patientstocks.notifications[0]
      Popuputil(msg.type, msg.code, msg.description)
      removePatientstocknotification()
    }
    if (Patients.notifications && Patients.notifications.length > 0) {
      let msg = Patients.notifications[0]
      Popuputil(msg.type, msg.code, msg.description)
      removePatientnotification()
    }
    if (Departments.notifications && Departments.notifications.length > 0) {
      let msg = Departments.notifications[0]
      Popuputil(msg.type, msg.code, msg.description)
      removeDepartmentnotification()
    }
    if (Stockdefines.notifications && Stockdefines.notifications.length > 0) {
      let msg = Stockdefines.notifications[0]
      Popuputil(msg.type, msg.code, msg.description)
      removeStockdefinenotification()
    }

    const Departmentoptions = Departments.list.map(department => {
      return { key: department.concurrencyStamp, text: department.name, value: department.concurrencyStamp }
    })
    const Stockdefineoptions = Stockdefines.list.map(define => {
      return { key: define.concurrencyStamp, text: define.name, value: define.concurrencyStamp }
    })
    const Patientoptions = Patients.list.map(patient => {
      return { key: patient.concurrencyStamp, text: `${patient?.patientdefine?.firstname} ${patient?.patientdefine?.lastname} - ${patient?.patientdefine?.countryID}`, value: patient.concurrencyStamp }
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
                  <Dropdown value={this.state.selectedpatient} loading={Patients.isLoading}  fluid selection options={Patientoptions} onChange={this.handleChangePatient} />
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
                <Form.Input label="Barkod No" placeholder="Barkod No" name="barcodeno" fluid defaultValue={selected_record.barcodeno} />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Field>
                  <Form.Input label="Skt" placeholder="Skt" name="skt" fluid type='date' defaultValue={this.getLocalDate(selected_record.skt)} />
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
    const { EditPurchaseorderstocks, history, fillPurchaseorderstocknotification, Purchaseorderstocks } = this.props
    const data = formToObject(e.target)
    data.departmentid = this.state.selecteddepartments
    data.stockdefineID = this.state.selectedstockdefine
    data.patientID = this.state.selectedpatient

    let errors = []
    if (!data.departmentid || data.departmentid == '') {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Departman Seçili Değil' })
    }
    if (!data.patientID || data.patientID == '') {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Hasta Seçili Değil' })
    }
    if (!data.stockdefineID || data.stockdefineID == '') {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Ürün Seçili Değil' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPurchaseorderstocknotification(error)
      })
    } else {
      const response = { ...Purchaseorderstocks.selected_record, ...data }
      EditPurchaseorderstocks(response, history)
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