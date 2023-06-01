import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form, Icon, Modal, Tab, Table } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'
import formToObject from 'form-to-object'
import StockdefinesCreate from '../../Containers/Stockdefines/StockdefinesCreate'

export default class PurchaseordersCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedStocks: [],
      selectedCase: '',
      selectedWarehouse: '',
      open: false,
      inputvalues: {}
    }
  }

  componentDidMount() {
    const { GetStockdefines, GetCases, GetDepartments, GetWarehouses } = this.props
    GetStockdefines()
    GetCases()
    GetDepartments()
    GetWarehouses()
  }

  componentDidUpdate() {
    const { removePurchaseordernotification, removeDepartmentnotification, Warehouses, removeWarehousenotification,
      removeCasenotification, removeStockdefinenotification, Cases, Departments, Stockdefines,
      Purchaseorders } = this.props
    Notification(Warehouses.notifications, removeWarehousenotification)
    Notification(Purchaseorders.notifications, removePurchaseordernotification)
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Cases.notifications, removeCasenotification)
    Notification(Stockdefines.notifications, removeStockdefinenotification)
  }

  render() {

    const { Warehouses, Cases, Departments, Stockdefines,
      Purchaseorders } = this.props
    const { isLoading, isDispatching } = Purchaseorders

    const Stockdefinesoption = (Stockdefines.list || []).map(stockdefine => {
      return { key: stockdefine.Uuid, text: stockdefine.Name, value: stockdefine.Uuid }
    })

    const Departmentsoption = (Departments.list || []).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    const Casesoption = (Cases.list || []).filter(u => u.caseStatus !== 1).map(cases => {
      return { key: cases.Uuid, text: cases.Name, value: cases.Uuid }
    })
    const Warehousesoption = (Warehouses.list || []).map(warehouse => {
      return { key: warehouse.Uuid, text: warehouse.Name, value: warehouse.Uuid }
    })




    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Purchaseorders"}>
                  <Breadcrumb.Section >Satın Alma Siparişi</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Oluştur</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full  bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form onSubmit={this.handleSubmit}>
              <Tab className='station-tab'
                panes={[
                  {
                    menuItem: "Sipariş Bilgileri",
                    pane: {
                      key: 'save',
                      content: <React.Fragment>
                        <div className='h-[calc(62vh-10px)]'>
                          <Form.Group widths={'equal'}>
                            <Form.Field>
                              <label className='text-[#000000de]'>Hedef Ambar</label>
                              <Dropdown placeholder='Hedef Ambar' clearable search fluid selection options={Warehousesoption} value={this.state.selectedWarehouse} onChange={(e, data) => { this.setState({ selectedWarehouse: data.value }) }} />
                            </Form.Field>
                          </Form.Group>
                          <Form.Group widths={'equal'}>
                            <Form.Input placeholder="Firma Adı" name="Company" fluid label="Firma Adı" value={this.handleGetvalue('Company')} onChange={this.handleOnchange} />
                            <Form.Input placeholder="Alış Fiyatı" name="Purchaseprice" fluid label="Alış Fiyatı" type='number' value={this.handleGetvalue('Purchaseprice')} onChange={this.handleOnchange} />
                          </Form.Group>
                          <Form.Group widths={'equal'}>
                            <Form.Input placeholder="Siparişi Getiren" name="Companypersonelname" fluid label="Siparişi Getiren" value={this.handleGetvalue('Companypersonelname')} onChange={this.handleOnchange} />
                            <Form.Input placeholder="Sipariş Numarası" name="Purchasenumber" fluid label="Sipariş Numarası" value={this.handleGetvalue('Purchasenumber')} onChange={this.handleOnchange} />
                          </Form.Group>
                          <Form.Group widths={'equal'}>
                            <Form.Field>
                              <label className='text-[#000000de]'>Sipariş Durumu</label>
                              <Dropdown placeholder='Sipariş Durumu' clearable search fluid selection options={Casesoption} value={this.state.selectedCase} onChange={(e, data) => { this.setState({ selectedCase: data.value }) }} />
                            </Form.Field>
                            <Form.Input placeholder="Teslim Alan" name="Personelname" fluid label="Teslim Alan" value={this.handleGetvalue('Personelname')} onChange={this.handleOnchange} />
                          </Form.Group>
                          <Form.Group widths={'equal'}>
                            <Form.Input placeholder="Satın Alma Tarihi" name="Purchasedate" type='date' fluid label="Satın Alma Tarihi" value={this.handleGetvalue('Purchasedate')} onChange={this.handleOnchange} />
                            <Form.Input placeholder="Açıklama" name="Info" fluid label="Açıklama" value={this.handleGetvalue('Info')} onChange={this.handleOnchange} />
                          </Form.Group>
                        </div>
                      </React.Fragment>
                    }
                  },
                  {
                    menuItem: "Ürünler",
                    pane: {
                      key: 'design',
                      content: <React.Fragment>
                        <div className='h-[calc(62vh-10px)] overflow-y-auto'>
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
                                      <Dropdown placeholder='Ürün Tanımı' name="StockdefineID" clearable search fluid selection options={Stockdefinesoption} value={stock.StockdefineID} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'StockdefineID', data.value) }} />
                                    </Form.Field>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Field>
                                      <Dropdown placeholder='Departman' name="DepartmentID" clearable search fluid selection options={Departmentsoption} value={stock.DepartmentID} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'DepartmentID', data.value) }} />
                                    </Form.Field>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder="Barkodno" name="Barcodeno" fluid value={stock.Barcodeno} onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Barcodeno', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder="SKT" name="Skt" type='date' fluid value={stock.Skt} onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Skt', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder="Miktar" name="Amount" type="number" fluid value={stock.Amount} onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Amount', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder="Açıklama" name="Info" fluid value={stock.Info} onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Info', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell className='table-last-section'>
                                    <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                                      onClick={() => { this.removeProduct(stock.key, stock.Order) }} />
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
                        </div>
                      </React.Fragment>
                    }
                  }
                ]}
                renderActiveOnly={false} />

              <Divider className='w-full  h-[1px]' />

              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Purchaseorders">
                  <Button floated="left" color='grey'>Geri Dön</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>Kaydet</Button>
              </div>
            </Form>
          </div>
        </div>
    )
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    const { AddPurchaseorders, history, fillPurchaseordernotification } = this.props
    const stocks = this.state.selectedStocks
    const formData = formToObject(e.target)

    stocks.forEach(data => {
      data.Amount = parseFloat(data.Amount)
      delete data.key
    });

    const responseData = {
      Info: Array.isArray(formData.Info) ? formData.Info[0] : formData.Info,
      Company: formData.Company,
      Username: '',
      Purchaseprice: parseFloat(formData.Purchaseprice),
      Purchasenumber: formData.Purchasenumber,
      Companypersonelname: formData.Companypersonelname,
      Personelname: formData.Personelname,
      Purchasedate: formData.Purchasedate,
      CaseID: this.state.selectedCase,
      WarehouseID: this.state.selectedWarehouse,
      Stocks: stocks
    }

    let errors = []
    responseData.Stocks.forEach(data => {
      if (!data.StockdefineID || data.StockdefineID === '') {
        errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Ürün Tanımı Bulunamadı' })
      }
      if (!data.DepartmentID || data.DepartmentID === '') {
        errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Departman Bulunamadı' })
      }
      if (!data.Skt || data.Skt === '') {
        errors.push({ type: 'Error', code: 'Puchaseorders', description: 'SKT Girilmemiş' })
      }
      if (!data.Barcodeno || data.Barcodeno === '') {
        errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Barkod Girilmemiş' })
      }
      if (!data.Amount || data.Amount === '' || data.Amount === 0) {
        errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Miktar Girilmemiş' })
      }
    });

    if (!responseData.Company || responseData.Company === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Firma Bilgisi Bulunamadı' })
    }
    if (!responseData.Purchaseprice || responseData.Purchaseprice === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Alış Fiyatı bulunamadı' })
    }
    if (!responseData.Companypersonelname || responseData.Companypersonelname === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Teslimatcı Adı bulunamadı' })
    }
    if (!responseData.Purchasenumber || responseData.Purchasenumber === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Sipariş Numarası bulunamadı' })
    }
    if (!responseData.Personelname || responseData.Personelname === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Teslim Alan Kişi belirtilmedi' })
    }
    if (!responseData.CaseID || responseData.CaseID === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Sipariş durumu girilmedi' })
    }
    if (!responseData.WarehouseID || responseData.WarehouseID === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Ambar girilmedi' })
    }
    if (!responseData.Purchasedate || responseData.Purchasedate === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Satın alma tarihi girilmemiş' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPurchaseordernotification(error)
      })
    } else {
      await AddPurchaseorders(responseData, history)
    }
  }

  AddNewProduct = () => {
    this.setState({
      selectedStocks: [...this.state.selectedStocks,
      {
        Id: 0,
        PurchaseorderID: '',
        Purchaseorder: {},
        StockdefineID: '',
        Stockdefine: {},
        DepartmentID: '',
        Department: {},
        Skt: null,
        Barcodeno: '',
        Amount: 0,
        Status: 0,
        Info: '',
        Willdelete: false,
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
    if (property === 'order') {
      productionRoutes.filter(productionRoute => productionRoute.Order === value)
        .forEach((productionRoute) => productionRoute.Order = productionRoutes[index].Order > value ? productionRoute.Order + 1 : productionRoute.Order - 1)
    }
    productionRoutes[index][property] = value
    this.setState({ selectedStocks: productionRoutes })
  }


  handleGetvalue = (name, type) => {
    if (!this.state.inputvalues[name]) {
      switch (type) {
        case 'number':
          return 0
        case 'date':
          return new Date()
        default:
          return ''
      }
    } else {
      return this.state.inputvalues[name]
    }
  }

  handleOnchange = (e) => {
    const inputvalues = { ...this.state.inputvalues }
    inputvalues[e.target.name] = e.target.value
    this.setState({ inputvalues })
  }
}


