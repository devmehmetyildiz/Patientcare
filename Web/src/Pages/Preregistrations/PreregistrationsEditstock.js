import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header, Icon,  Modal, Table } from 'semantic-ui-react'
import { ROUTES } from '../../Utils/Constants'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import StockdefinesCreate from "../../Containers/Stockdefines/StockdefinesCreate"

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
    const { Patients, Departments, Stockdefines } = this.props
    const { selected_record, isLoading } = Patients
    if (selected_record && Object.keys(selected_record).length > 0 &&
      selected_record.id !== 0 && !isLoading && !Departments.isLoading && !Stockdefines.isLoading && !this.state.isDatafetched) {
      var response = (selected_record.stocks || [])
      response.forEach(element => {
        element.key=Math.random()
      });
      this.setState({
        selectedStocks: response, isDatafetched: true
      })
    }
  }

  render() {
    const { Patients, Stockdefines, Departments, removePatientnotification, removeStockdefinenotification, 
      removeDepartmentnotification } = this.props
    const { selected_record, isLoading, isDispatching } = Patients
    Notification(Patients.notifications, removePatientnotification)
    Notification(Stockdefines.notifications, removeStockdefinenotification)
    Notification(Departments.notifications, removeDepartmentnotification)

    const Stockdefinesoption = Stockdefines.list.map(stockdefine => {
      return { key: stockdefine.concurrencyStamp, text: stockdefine.name, value: stockdefine.concurrencyStamp }
    })

    const Departmentsoption = Departments.list.map(department => {
      return { key: department.concurrencyStamp, text: department.name, value: department.concurrencyStamp }
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
              {(selected_record.files || []).filter(u => u.usagetype === 'PP').length > 0 ? <img alt='pp' src={`${process.env.REACT_APP_BACKEND_URL}/${ROUTES.FILE}/GetImage?guid=${selected_record.concurrencyStamp}`} className="rounded-full" style={{ width: '100px', height: '100px' }} />
                : <Icon name='users' circular />}
              <Header.Content>{`${selected_record.patientdefine?.firstname} ${selected_record.patientdefine?.lastname} - ${selected_record.patientdefine?.countryID}`}</Header.Content>
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
                  {this.state.selectedStocks.sort((a, b) => a.order - b.order).map((stock, index) => {
                    return <Table.Row key={stock.key}>
                      <Table.Cell>
                        <Button.Group basic size='small'>
                          <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { this.selectedProductChangeHandler(stock.key, 'order', stock.order - 1) }} />
                          <Button type='button' disabled={index + 1 === this.state.selectedStocks.length} icon='angle down' onClick={() => { this.selectedProductChangeHandler(stock.key, 'order', stock.order + 1) }} />
                        </Button.Group>
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Field>
                          <Dropdown value={stock.stockdefineID} placeholder='Ürün Tanımı' name="stockdefineID" clearable search fluid selection options={Stockdefinesoption} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'stockdefineID', data.value) }} />
                        </Form.Field>
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Field>
                          <Dropdown value={stock.departmentid} placeholder='Departman' name="departmentid" clearable search fluid selection options={Departmentsoption} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'departmentid', data.value) }} />
                        </Form.Field>
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Input value={stock.barcodeno} placeholder="Barkodno" name="barcodeno" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'barcodeno', e.target.value) }} />
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Input value={stock.skt && stock.skt.split('T')[0]} placeholder="SKT" name="skt" type='date' fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'skt', e.target.value) }} />
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Input disabled={stock.concurrencyStamp} value={stock.amount} placeholder="Miktar" name="amount" type="number" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'amount', e.target.value) }} />
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Input value={stock.info} placeholder="Açıklama" name="info" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'info', e.target.value) }} />
                      </Table.Cell>
                      <Table.Cell className='table-last-section'>
                        {!stock.concurrencyStamp && <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                          onClick={() => { this.removeProduct(stock.key, stock.order) }} />}
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
    const { EditPatientstocks, Patients, history, fillPatientnotification } = this.props
    const stocks = this.state.selectedStocks

    stocks.forEach(data => {
      delete data.key
    });


    let errors = []
    stocks.forEach(data => {
      if (!data.stockdefineID || data.stockdefineID === '') {
        errors.push({ type: 'Error', code: 'Patients', description: 'Ürün Tanımı Bulunamadı' })
      }
      if (!data.departmentid || data.departmentid === '') {
        errors.push({ type: 'Error', code: 'Patients', description: 'Departman Bulunamadı' })
      }
      if (!data.skt || data.skt === '') {
        errors.push({ type: 'Error', code: 'Patients', description: 'SKT Girilmemiş' })
      }
      if (!data.barcodeno || data.barcodeno === '') {
        errors.push({ type: 'Error', code: 'Patients', description: 'Barkod Girilmemiş' })
      }
      if (!data.amount || data.amount === '' || data.amount === 0) {
        errors.push({ type: 'Error', code: 'Patients', description: 'Miktar Girilmemiş' })
      }
    });

    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientnotification(error)
      })
    } else {
      EditPatientstocks({ ...Patients.selected_record, stocks: stocks }, history, "/Preregistrations")
    }
  }

  AddNewProduct = () => {
    this.setState({
      selectedStocks: [...this.state.selectedStocks,
      {
        id: 0,
        patient: {},
        patientID: '',
        stockdefineID: '',
        stockdefine: {},
        departmentid: '',
        department: {},
        skt: null,
        barcodeno: '',
        amount: 0,
        info: '',
        status: 0,
        concurrencyStamp: '',
        createdUser: '',
        updatedUser: '',
        deleteUser: '',
        createTime: null,
        updateTime: null,
        deleteTime: null,
        isActive: true,
        key: Math.random(),
        order: this.state.selectedStocks.length,
      }]
    })
  }

  removeProduct = (key, order) => {
    let stocks = this.state.selectedStocks.filter(productionRoute => productionRoute.key !== key)
    stocks.filter(stock => stock.order > order).forEach(stock => stock.order--)
    this.setState({ selectedStocks: stocks })
  }

  selectedProductChangeHandler = (key, property, value) => {
    let productionRoutes = this.state.selectedStocks
    const index = productionRoutes.findIndex(productionRoute => productionRoute.key === key)
    if (property === 'order') {
      productionRoutes.filter(productionRoute => productionRoute.order === value)
        .forEach((productionRoute) => productionRoute.order = productionRoutes[index].order > value ? productionRoute.order + 1 : productionRoute.order - 1)
    }
    productionRoutes[index][property] = value
    this.setState({ selectedStocks: productionRoutes })
  }

}
