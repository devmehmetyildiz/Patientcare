import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'

export default class StockdefinesEdit extends Component {
  constructor(props) {
    super(props)
    const selecteddepartment = {}
    const selectedunit = {}
    const isDatafetched = false
    this.state = {
      selecteddepartment,
      selectedunit,
      isDatafetched
    }
  }

  componentDidMount() {
    const { GetStockdefine, match, history, GetDepartments, GetUnits } = this.props
    if (match.params.StockdefineID) {
      GetStockdefine(match.params.StockdefineID)
      GetDepartments()
      GetUnits()
    } else {
      history.push("/Stockdefines")
    }
  }

  componentDidUpdate() {
    const { Stockdefines, Units, removeUnitnotification, removeStockdefinenotification, Departments, removeDepartmentnotification } = this.props
    const { selected_record, isLoading } = Stockdefines
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && Units.list.length > 0 && !Units.isLoading && Departments.list.length > 0 && !Departments.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selecteddepartment: selected_record.Department.Uuid, selectedunit: selected_record.Unit.Uuid, isDatafetched: true
      })
    }
    Notification(Stockdefines.notifications, removeStockdefinenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Units.notifications, removeUnitnotification)
  }

  render() {

    const { Departments, Stockdefines, Units } = this.props

    const Departmentoption = Departments.list.map(station => {
      return { key: station.Uuid, text: station.Name, value: station.Uuid }
    })
    const Unitoption = Units.list.map(station => {
      return { key: station.Uuid, text: station.Name, value: station.Uuid }
    })

    return (
      Units.isLoading || Units.isDispatching || Departments.isLoading || Departments.isDispatching || Stockdefines.isLoading || Stockdefines.isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Stockdefines"}>
                  <Breadcrumb.Section >Ürün Tanımları</Breadcrumb.Section>
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
                <Form.Input label="Stok Tanımı" placeholder="Stok Tanımı" name="Name" fluid defaultValue={Stockdefines.selected_record.Name} />
                <Form.Input label="Açıklama" placeholder="Açıklama" name="Description" fluid defaultValue={Stockdefines.selected_record.Description} />
              </Form.Field>
              <Form.Group widths={"equal"}>
                <Form.Field>
                  <label className='text-[#000000de]'>Departman</label>
                  <Dropdown placeholder='Departman' clearable fluid selection value={this.state.selecteddepartment} options={Departmentoption} onChange={this.handleChangeDepartement} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Birim</label>
                  <Dropdown placeholder='Birim' clearable fluid selection value={this.state.selectedunit} options={Unitoption} onChange={this.handleChangeUnit} />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Departments">
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

    const { EditStockdefines, history, fillStockdefinenotification, Stockdefines, Units, Departments } = this.props
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
      EditStockdefines({ ...Stockdefines.selected_record, ...data }, history)
    }
  }

  handleChangeUnit = (e, { value }) => {
    this.setState({ selectedunit: value })
  }
  handleChangeDepartement = (e, { value }) => {
    this.setState({ selecteddepartment: value })
  }
}
