import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header, Icon, Modal, Table } from 'semantic-ui-react'
import { ROUTES } from '../../Utils/Constants'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import StockdefinesCreate from "../../Containers/Stockdefines/StockdefinesCreate"
import config from '../../Config'

export default class PreregistrationsEditstock extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      selectedStocks: [],
      open: false
    }
  }

  componentDidMount() {
    const { GetPatient, match, history, GetStockdefines, GetDepartments } = this.props
    if (match.params.PatientID) {
      GetPatient(match.params.PatientID)
      GetStockdefines()
      GetDepartments()
    } else {
      history.push("/Preregistrations")
    }
  }

  componentDidUpdate() {
    const { Patients, Departments, Stockdefines, removePatientnotification, removeStockdefinenotification,
      removeDepartmentnotification } = this.props
    const { selected_record, isLoading } = Patients
    if (selected_record && Object.keys(selected_record).length > 0 &&
      selected_record.Id !== 0 && !isLoading && !Departments.isLoading && !Stockdefines.isLoading && !this.state.isDatafetched) {
      var response = (selected_record.Stocks || [])
      response.forEach(element => {
        element.key = Math.random()
      });
      this.setState({
        selectedStocks: response, isDatafetched: true
      })
    }
    Notification(Patients.notifications, removePatientnotification)
    Notification(Stockdefines.notifications, removeStockdefinenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
  }

  render() {
    const { Patients, Stockdefines, Departments } = this.props
    const { selected_record, isLoading, isDispatching } = Patients

    const Stockdefinesoption = Stockdefines.list.map(stockdefine => {
      return { key: stockdefine.Uuid, text: stockdefine.Name, value: stockdefine.Uuid }
    })

    const Departmentsoption = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
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
                <Breadcrumb.Section>Hasta Stokları</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Header as='h2' icon textAlign='center'>
              {(selected_record.Files || []).filter(u => u.Usagetype === 'PP').length > 0 ? <img alt='pp' src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${selected_record.Files.find(u => u.Usagetype === 'PP')?.Uuid}`} className="rounded-full" style={{ width: '100px', height: '100px' }} />
                : <Icon name='users' circular />}
              <Header.Content>{`${selected_record.Patientdefine?.Firstname} ${selected_record.Patientdefine?.Lastname} - ${selected_record.Patientdefine?.CountryID}`}</Header.Content>
            </Header>
            <Form onSubmit={this.handleSubmit}>
              <Table celled className='list-table ' key='product-create-type-conversion-table ' >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width={1}>Sıra</Table.HeaderCell>
                    <Table.HeaderCell width={2}>Ürün Tanımı <span>
                      <Modal
                        onClose={() => this.setState({ open: false })}
                        onOpen={() => this.setState({ open: true })}
                        trigger={<Icon link name='plus' />}
                        content={<StockdefinesCreate />}
                      >
                      </Modal>
                    </span></Table.HeaderCell>
                    <Table.HeaderCell width={2}>Departman</Table.HeaderCell>
                    <Table.HeaderCell width={2}>Barkodno</Table.HeaderCell>
                    <Table.HeaderCell width={2}>SKT</Table.HeaderCell>
                    <Table.HeaderCell width={2}>Miktar</Table.HeaderCell>
                    <Table.HeaderCell width={6}>Açıklama</Table.HeaderCell>
                    <Table.HeaderCell width={1}>Sil</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {this.state.selectedStocks.sort((a, b) => a.Order - b.Order).map((stock, index) => {
                    return <Table.Row key={stock.key}>
                      <Table.Cell>
                        <Button.Group basic size='small'>
                          <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { this.selectedProductChangeHandler(stock.key, 'Order', stock.Order - 1) }} />
                          <Button type='button' disabled={index + 1 === this.state.selectedStocks.length} icon='angle down' onClick={() => { this.selectedProductChangeHandler(stock.key, 'Order', stock.Order + 1) }} />
                        </Button.Group>
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Field>
                          <Dropdown value={stock.StockdefineID} placeholder='Ürün Tanımı' name="StockdefineID" clearable search fluid selection options={Stockdefinesoption} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'StockdefineID', data.value) }} />
                        </Form.Field>
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Field>
                          <Dropdown value={stock.DepartmentID} placeholder='Departman' name="DepartmentID" clearable search fluid selection options={Departmentsoption} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'DepartmentID', data.value) }} />
                        </Form.Field>
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Input value={stock.Barcodeno} placeholder="Barkodno" name="Barcodeno" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Barcodeno', e.target.value) }} />
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Input value={stock.Skt && stock.Skt.split('T')[0]} placeholder="SKT" name="Skt" type='date' fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Skt', e.target.value) }} />
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Input disabled={stock.Uuid} value={stock.Amount} placeholder="Miktar" name="Amount" type="number" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Amount', e.target.value) }} />
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Input value={stock.Info} placeholder="Açıklama" name="Info" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Info', e.target.value) }} />
                      </Table.Cell>
                      <Table.Cell className='table-last-section'>
                        {!stock.Uuid && <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                          onClick={() => { this.removeProduct(stock.key, stock.Order) }} />}
                      </Table.Cell>
                    </Table.Row>
                  })}
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan='8'>
                      <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { this.AddNewProduct() }}>Ürün Ekle</Button>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Preregistrations">
                  <Button floated="left" color='grey'>Geri Dön</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>Kaydet</Button>
              </div>
            </Form>
          </div>

        </div>
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.open) {
      return
    }
    const { EditPatientstocks, history, fillPatientnotification } = this.props
    const stocks = this.state.selectedStocks

    stocks.forEach(data => {
      delete data.key
    });


    let errors = []
    stocks.forEach(data => {
      if (!data.StockdefineID || data.StockdefineID === '') {
        errors.push({ type: 'Error', code: 'Patients', description: 'Ürün Tanımı Bulunamadı' })
      }
      if (!data.DepartmentID || data.DepartmentID === '') {
        errors.push({ type: 'Error', code: 'Patients', description: 'Departman Bulunamadı' })
      }
      if (!data.Skt || data.Skt === '') {
        errors.push({ type: 'Error', code: 'Patients', description: 'SKT Girilmemiş' })
      }
      if (!data.Barcodeno || data.Barcodeno === '') {
        errors.push({ type: 'Error', code: 'Patients', description: 'Barkod Girilmemiş' })
      }
      if (!data.Amount || data.Amount === '' || data.Amount === 0) {
        errors.push({ type: 'Error', code: 'Patients', description: 'Miktar Girilmemiş' })
      }
    });

    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientnotification(error)
      })
    } else {
      EditPatientstocks({ data: stocks, history, url: "/Preregistrations" })
    }
  }

  AddNewProduct = () => {
    const { Patients } = this.props
    this.setState({
      selectedStocks: [...this.state.selectedStocks,
      {
        Patient: {},
        PatientID: Patients.selected_record.Uuid,
        StockdefineID: '',
        Stockdefine: {},
        DepartmentID: '',
        Department: {},
        Skt: null,
        Barcodeno: '',
        Amount: 0,
        Info: '',
        Status: 0,
        key: Math.random(),
        Order: this.state.selectedStocks.length,
      }]
    })
  }

  removeProduct = (key, order) => {
    let stocks = this.state.selectedStocks.filter(productionRoute => productionRoute.key !== key)
    stocks.filter(stock => stock.Order > order).forEach(stock => stock.Order--)
    this.setState({ selectedStocks: stocks })
  }

  selectedProductChangeHandler = (key, property, value) => {
    let productionRoutes = this.state.selectedStocks
    const index = productionRoutes.findIndex(productionRoute => productionRoute.key === key)
    if (property === 'Order') {
      productionRoutes.filter(productionRoute => productionRoute.Order === value)
        .forEach((productionRoute) => productionRoute.Order = productionRoutes[index].Order > value ? productionRoute.Order + 1 : productionRoute.Order - 1)
    }
    productionRoutes[index][property] = value
    this.setState({ selectedStocks: productionRoutes })
  }

}
