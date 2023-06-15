import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form, FormField } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'

export default class StockdefinesCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selecteddepartment: {},
      selectedunit: {}
    }
  }

  componentDidMount() {
    const { GetDepartments, GetUnits } = this.props
    GetDepartments()
    GetUnits()
  }

  componentDidUpdate() {
    const { Stockdefines, Units, removeUnitnotification, removeStockdefinenotification, Departments, removeDepartmentnotification } = this.props
    Notification(Stockdefines.notifications, removeStockdefinenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Units.notifications, removeUnitnotification)
  }

  render() {
    const { Departments, Units, Stockdefines, history } = this.props

    const Departmentoptions = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })
    const Unitoptions = Units.list.map(unit => {
      return { key: unit.Uuid, text: unit.Name, value: unit.Uuid }
    })

    return (
      Units.isLoading || Units.isDispatching || Departments.isLoading || Departments.isDispatching || Stockdefines.isLoading || Stockdefines.isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Stockdefines"}>
                  <Breadcrumb.Section >Stok Tanımları</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Oluştur</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={this.handleSubmit}>
              <Form.Field>
                <Form.Input label="Stok Tanımı" placeholder="Stok Tanımı" name="Name" fluid />
                <Form.Input label="Açıklama" placeholder="Açıklama" name="Description" fluid />
              </Form.Field>
              <Form.Group widths={"equal"}>
                <FormField>
                  <label className='text-[#000000de]'>Departman</label>
                  <Dropdown placeholder='Departman' clearable fluid selection options={Departmentoptions} onChange={this.handleChangeDepartement} />
                </FormField>
                <FormField>
                  <label className='text-[#000000de]'>Birim</label>
                  <Dropdown placeholder='Birim' clearable fluid selection options={Unitoptions} onChange={this.handleChangeUnit} />
                </FormField>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                {history && <Link to="/Stockdefines">
                  <Button floated="left" color='grey'>Geri Dön</Button>
                </Link>}
                <Button floated="right" type='submit' color='blue'>Oluştur</Button>
              </div>
            </Form>
          </div >
        </div >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { AddStockdefines, Departments, Units, history, fillStockdefinenotification } = this.props
    const data = formToObject(e.target)
    data.UnitID = this.state.selectedunit
    data.DepartmentID = this.state.selecteddepartment

    let errors = []
    if (!data.Name || data.Name === '') {
      errors.push({ type: 'Error', code: 'Ürün Tanımları', description: 'İsim Boş Olamaz' })
    }
    if (!Departments.list.find(u => u.Uuid === this.state.selecteddepartment)) {
      errors.push({ type: 'Error', code: 'Ürün Tanımları', description: 'Departman seçili değil' })
    }
    if (!Units.list.find(u => u.Uuid === this.state.selectedunit)) {
      errors.push({ type: 'Error', code: 'Ürün Tanımları', description: 'Birim seçili değil' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillStockdefinenotification(error)
      })
    } else {
      AddStockdefines({data, history})
    }
  }

  handleChangeUnit = (e, { value }) => {
    this.setState({ selectedunit: value })
  }
  handleChangeDepartement = (e, { value }) => {
    this.setState({ selecteddepartment: value })
  }
}