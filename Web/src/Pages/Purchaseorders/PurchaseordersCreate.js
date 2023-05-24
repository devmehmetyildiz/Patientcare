import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form, Icon, Modal, Tab, Table } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import Popuputils from '../../Utils/Popup'
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
      open: false
    }
  }

  componentDidMount() {
    const { GetStockdefines, GetCases, GetDepartments, GetWarehouses } = this.props
    GetStockdefines()
    GetCases()
    GetDepartments()
    GetWarehouses()
  }

  render() {

    const { removePurchaseordernotification, removeDepartmentnotification, Warehouses, removeWarehousenotification,
      removeCasenotification, removeStockdefinenotification, Cases, Departments, Stockdefines,
      Purchaseorders } = this.props
    const { notifications, isLoading, isDispatching } = Purchaseorders

    if (notifications && notifications.length > 0) {
      let msg = notifications[0]
      Popuputils(msg.type, msg.code, msg.description)
      removePurchaseordernotification()
    }

    if (Cases.notifications && Cases.notifications.length > 0) {
      let msg = Cases.notifications[0]
      Popuputils(msg.type, msg.code, msg.description)
      removeCasenotification()
    }
    if (Warehouses.notifications && Warehouses.notifications.length > 0) {
      let msg = Warehouses.notifications[0]
      Popuputils(msg.type, msg.code, msg.description)
      removeWarehousenotification()
    }

    if (Departments.notifications && Departments.notifications.length > 0) {
      let msg = Departments.notifications[0]
      Popuputils(msg.type, msg.code, msg.description)
      removeDepartmentnotification()
    }

    if (Stockdefines.notifications && Stockdefines.notifications.length > 0) {
      let msg = Stockdefines.notifications[0]
      Popuputils(msg.type, msg.code, msg.description)
      removeStockdefinenotification()
    }

    const Stockdefinesoption = (Stockdefines.list || []).map(stockdefine => {
      return { key: stockdefine.concurrencyStamp, text: stockdefine.name, value: stockdefine.concurrencyStamp }
    })

    const Departmentsoption = (Departments.list || []).map(department => {
      return { key: department.concurrencyStamp, text: department.name, value: department.concurrencyStamp }
    })



    const Casesoption = (Cases.list || []).filter(u => u.caseStatus !== 1).map(cases => {
      return { key: cases.concurrencyStamp, text: cases.name, value: cases.concurrencyStamp }
    })
    const Warehousesoption = (Warehouses.list || []).map(warehouse => {
      return { key: warehouse.concurrencyStamp, text: warehouse.name, value: warehouse.concurrencyStamp }
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
                              <Dropdown placeholder='Hedef Ambar' clearable search fluid selection options={Warehousesoption} onChange={(e, data) => { this.setState({ selectedWarehouse: data.value }) }} />
                            </Form.Field>
                          </Form.Group>
                          <Form.Group widths={'equal'}>
                            <Form.Input placeholder="Firma Adı" name="company" fluid label="Firma Adı" />
                            <Form.Input placeholder="Alış Fiyatı" name="purchaseprice" fluid label="Alış Fiyatı" type='number' />
                          </Form.Group>
                          <Form.Group widths={'equal'}>
                            <Form.Input placeholder="Siparişi Getiren" name="companypersonelname" fluid label="Siparişi Getiren" />
                            <Form.Input placeholder="Sipariş Numarası" name="purchasenumber" fluid label="Sipariş Numarası" />
                          </Form.Group>
                          <Form.Group widths={'equal'}>
                            <Form.Field>
                              <label className='text-[#000000de]'>Sipariş Durumu</label>
                              <Dropdown placeholder='Sipariş Durumu' clearable search fluid selection options={Casesoption} onChange={(e, data) => { this.setState({ selectedCase: data.value }) }} />
                            </Form.Field>
                            <Form.Input placeholder="Teslim Alan" name="personelname" fluid label="Teslim Alan" />
                          </Form.Group>
                          <Form.Group widths={'equal'}>
                            <Form.Input placeholder="Satın Alma Tarihi" name="purchasedate" type='date' fluid label="Satın Alma Tarihi" />
                            <Form.Input placeholder="Açıklama" name="info" fluid label="Açıklama" />
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
                                      <Dropdown placeholder='Ürün Tanımı' name="stockdefineID" clearable search fluid selection options={Stockdefinesoption} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'stockdefineID', data.value) }} />
                                    </Form.Field>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Field>
                                      <Dropdown placeholder='Departman' name="departmentid" clearable search fluid selection options={Departmentsoption} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'departmentid', data.value) }} />
                                    </Form.Field>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder="Barkodno" name="barcodeno" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'barcodeno', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder="SKT" name="skt" type='date' fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'skt', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder="Miktar" name="amount" type="number" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'amount', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder="Açıklama" name="info" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'info', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell className='table-last-section'>
                                    <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                                      onClick={() => { this.removeProduct(stock.key, stock.order) }} />
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

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddPurchaseorders, history, fillPurchaseordernotification } = this.props
    const stocks = this.state.selectedStocks
    const formData = formToObject(e.target)

    stocks.forEach(data => {
      delete data.key
    });

    const responseData = {
      id: 0,
      info: Array.isArray(formData.info) ? formData.info[0] : formData.info,
      company: formData.company,
      username: '',
      purchaseprice: formData.purchaseprice,
      purchasenumber: formData.purchasenumber,
      companypersonelname: formData.companypersonelname,
      personelname: formData.personelname,
      purchasedate: formData.purchasedate,
      caseID: this.state.selectedCase,
      warehouseID: this.state.selectedWarehouse,
      case: {},
      concurrencyStamp: '',
      createdUser: '',
      updatedUser: '',
      deleteUser: '',
      createTime: null,
      updateTime: null,
      deleteTime: null,
      isActive: true,
      stocks: stocks
    }

    let errors = []
    responseData.stocks.forEach(data => {
      if (!data.stockdefineID || data.stockdefineID === '') {
        errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Ürün Tanımı Bulunamadı' })
      }
      if (!data.departmentid || data.departmentid === '') {
        errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Departman Bulunamadı' })
      }
      if (!data.skt || data.skt === '') {
        errors.push({ type: 'Error', code: 'Puchaseorders', description: 'SKT Girilmemiş' })
      }
      if (!data.barcodeno || data.barcodeno === '') {
        errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Barkod Girilmemiş' })
      }
      if (!data.amount || data.amount === '' || data.amount === 0) {
        errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Miktar Girilmemiş' })
      }
    });

    if (!responseData.company || responseData.company === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Firma Bilgisi Bulunamadı' })
    }
    if (!responseData.purchaseprice || responseData.purchaseprice === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Alış Fiyatı bulunamadı' })
    }
    if (!responseData.companypersonelname || responseData.companypersonelname === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Teslimatcı Adı bulunamadı' })
    }
    if (!responseData.purchasenumber || responseData.purchasenumber === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Sipariş Numarası bulunamadı' })
    }
    if (!responseData.personelname || responseData.personelname === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Teslim Alan Kişi belirtilmedi' })
    }
    if (!responseData.caseID || responseData.caseID === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Sipariş durumu girilmedi' })
    }
    if (!responseData.warehouseID || responseData.warehouseID === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Ambar girilmedi' })
    }
    if (!responseData.purchasedate || responseData.purchasedate === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Satın alma tarihi girilmemiş' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPurchaseordernotification(error)
      })
    } else {
      AddPurchaseorders(responseData, history)
    }
  }

  AddNewProduct = () => {
    this.setState({
      selectedStocks: [...this.state.selectedStocks,
      {
        id: 0,
        purchaseorderID: '',
        purchaseorder: {},
        stockdefineID: '',
        stockdefine: {},
        departmentid: '',
        department: {},
        skt: null,
        barcodeno: '',
        amount: 0,
        status: 0,
        info: '',
        willdelete: false,
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


