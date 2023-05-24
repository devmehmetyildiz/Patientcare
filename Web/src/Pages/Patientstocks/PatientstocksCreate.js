import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {  Divider, Dropdown, Form } from 'semantic-ui-react'
import { Breadcrumb, Button,  Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Popuputil from '../../Utils/Popup'
import LoadingPage from '../../Utils/LoadingPage'

export default class PatientstocksCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selecteddepartments: "",
      selectedstockdefine: "",
      selectedpatient: "",
      open: false,
      isInprepatients: false
    }
  }


  componentDidMount() {
    const { GetDepartments, GetStockdefines, GetPatients } = this.props
    GetDepartments()
    GetStockdefines()
    GetPatients()
  }

  render() {
    const { Patients, Patientstocks, removePatientnotification, Departments, Stockdefines, removeStockdefinenotification, removePatientstocknotification, removeDepartmentnotification } = this.props
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
                <Breadcrumb.Section>Oluştur</Breadcrumb.Section>
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
                  <Dropdown loading={Patients.isLoading} fluid selection options={Patientoptions} onChange={this.handleChangePatient} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Ürün
                    <Button   style={{visibility:'hidden'}} onClick={(e)=>{e.preventDefault()}} circular size='mini' icon="redo"></Button>
                  </label>
                  <Dropdown placeholder='Ürün' fluid selection options={Stockdefineoptions} onChange={this.handleChangeStockdefine} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths='equal'>
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input label="Barkod No" placeholder="Barkod No" name="barcodeno" fluid />
                <Form.Input label="Miktar" placeholder="Miktar" name="amount" fluid step="0.01" type='number' />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Field>
                  <Form.Input label="Skt" placeholder="Skt" name="skt" fluid type='date' defaultValue={this.getLocalDate()} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Departmanlar</label>
                  <Dropdown placeholder='Departmanlar' fluid selection options={Departmentoptions} onChange={this.handleChangeDepartment} />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Patientstocks">
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
    const { AddPatientstocks, history, fillPatientstocknotification } = this.props
    const data = formToObject(e.target)
    data.departmentid = this.state.selecteddepartments
    data.stockdefineID = this.state.selectedstockdefine
    data.patientID = this.state.selectedpatient
    data.status = 0
    data.id = 0
    data.concurrencyStamp = null
    data.createdUser = null
    data.updatedUser = null
    data.deleteUser = null
    data.createTime = null
    data.updateTime = null
    data.deleteTime = null
    data.isActive = true
    data.maxamount = data.amount
    data.source = "Single Request"

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
    if (!data.amount || data.amount == '' || data.amount == 0) {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Miktar girilmedi' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientstocknotification(error)
      })
    } else {
      AddPatientstocks(data, history)
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

  handleChangePatienttype = (e) => {
    e.preventDefault()
    const { GetPatients, Getpreregistrations } = this.props
    this.setState({ isInprepatients: !this.state.isInprepatients, selectedpatient: '' }, () => {
      if (this.state.isInprepatients) {
        Getpreregistrations()

      } else {
        GetPatients()
      }
    })

  }

  getLocalDate = () => {
    var curr = new Date();
    curr.setDate(curr.getDate() + 3);
    var date = curr.toISOString().substring(0, 10);
    return date
  }
}