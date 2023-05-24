import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form, Icon, Popup, Table } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import Popuputils from '../../Utils/Popup'
import LoadingPage from '../../Utils/LoadingPage'
import formToObject from 'form-to-object'

export default class PurchaseordersEdit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedStocks: [],
      selectedCase: '',
      isDatafetched: false,
      selectedWarehouse: '',
    }
  }

  componentDidMount() {
    const { GetPurchaseorder, match, history, GetStockdefines, GetCases, GetDepartments, GetWarehouses } = this.props
    if (match.params.PurchaseorderID) {
      GetPurchaseorder(match.params.PurchaseorderID)
      GetStockdefines()
      GetCases()
      GetDepartments()
      GetWarehouses()
    } else {
      history.push("/Purchaseorders")
    }

  }

  componentDidUpdate() {
    const { Stockdefines, Purchaseorders, Cases, Departments, Warehouses } = this.props
    const { selected_record, isLoading } = Purchaseorders
    if (selected_record && Object.keys(selected_record).length > 0 &&
      selected_record.id !== 0 && Stockdefines.list.length > 0 && !Stockdefines.isLoading
      && Cases.list.length > 0 && !Cases.isLoading
      && Warehouses.list.length > 0 && !Warehouses.isLoading
      && Departments.list.length > 0 && !Departments.isLoading
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selectedStocks: selected_record.stocks, isDatafetched: true, selectedCase: selected_record.caseID
      })
    }
  }

  render() {

    const { removePurchaseordernotification, removeDepartmentnotification,
      removeCasenotification, removeStockdefinenotification, Cases, Departments, Stockdefines, Warehouses, removeWarehousenotification,
      Purchaseorders } = this.props
    const { notifications, isLoading, isDispatching, selected_record } = Purchaseorders

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

    const Stockdefinesoption = Stockdefines.list.map(stockdefine => {
      return { key: stockdefine.concurrencyStamp, text: stockdefine.name, value: stockdefine.concurrencyStamp }
    })

    const Departmentsoption = Departments.list.map(department => {
      return { key: department.concurrencyStamp, text: department.name, value: department.concurrencyStamp }
    })

    const Casesoption = Cases.list.map(cases => {
      return { key: cases.concurrencyStamp, text: cases.name, value: cases.concurrencyStamp }
    })

    const Warehousesoption = Warehouses.list.map(warehouse => {
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
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label className='text-[#000000de]'>Hedef Ambar</label>
                  <Dropdown value={this.state.selectedWarehouse} placeholder='Hedef Ambar' clearable search fluid selection options={Warehousesoption} onChange={(e, data) => { this.setState({ selectedWarehouse: data.value }) }} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Input defaultValue={selected_record.company} placeholder="Firma Adı" name="company" fluid label="Firma Adı" />
                <Form.Input defaultValue={selected_record.purchaseprice} placeholder="Alış Fiyatı" name="purchaseprice" fluid label="Alış Fiyatı" type='number' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Input defaultValue={selected_record.companypersonelname} placeholder="Siparişi Getiren" name="companypersonelname" fluid label="Siparişi Getiren" />
                <Form.Input defaultValue={selected_record.purchasenumber} placeholder="Sipariş Numarası" name="purchasenumber" fluid label="Sipariş Numarası" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label className='text-[#000000de]'>Sipariş Durumu</label>
                  <Dropdown value={this.state.selectedCase} placeholder='Sipariş Durumu' clearable search fluid selection options={Casesoption} onChange={(e, data) => { this.setState({ selectedCase: data.value }) }} />
                </Form.Field>
                <Form.Input defaultValue={selected_record.personelname} placeholder="Teslim Alan" name="personelname" fluid label="Teslim Alan" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Input defaultValue={selected_record.purchasedate && selected_record.purchasedate.split('T')[0]} placeholder="Satın Alma Tarihi" name="purchasedate" type='date' fluid label="Satın Alma Tarihi" />
                <Form.Input defaultValue={selected_record.info} placeholder="Açıklama" name="info" fluid label="Açıklama" />
              </Form.Group>
              <Divider className='w-full  h-[1px]' />
              <div className='max-h-[calc(46vh-10px)] overflow-y-auto'>
                <Table celled className='list-table ' key='product-create-type-conversion-table ' >
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell width={1}>Sıra</Table.HeaderCell>
                      <Table.HeaderCell width={2}>Ürün Tanımı <span>
                        <Popup
                          trigger={<Icon link name='plus' />}
                          content='Yeni Ürün Tanımı Ekle'
                          position='top left'
                        />
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
              </div>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Purchaseorders">
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

    const { EditPurchaseorders, Purchaseorders, history, fillPurchaseordernotification } = this.props
    const stocks = this.state.selectedStocks
    const formData = formToObject(e.target)

    stocks.forEach(data => {
      delete data.key
    });

    const responseData = {
      info: Array.isArray(formData.info) ? formData.info[0] : formData.info,
      company: formData.company,
      purchaseprice: formData.purchaseprice,
      purchasenumber: formData.purchasenumber,
      companypersonelname: formData.companypersonelname,
      personelname: formData.personelname,
      purchasedate: formData.purchasedate,
      caseID: this.state.selectedCase,
      warehouseID: this.state.selectedWarehouse,
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
      if (!data.unitID || data.unitID === '') {
        errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Birim Girilmemiş' })
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
    if (!responseData.warehouseID || responseData.warehouseID === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Ambar girilmedi' })
    }
    if (!responseData.caseID || responseData.caseID === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Sipariş durumu girilmedi' })
    }
    if (!responseData.purchasedate || responseData.purchasedate === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Satın alma tarihi girilmemiş' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPurchaseordernotification(error)
      })
    } else {
      EditPurchaseorders({ ...Purchaseorders.selected_record, ...responseData }, history)
    }
  }

  AddNewProduct = () => {
    this.setState({
      selectedStocks: [...this.state.selectedStocks,
      {
        id: 0,
        stockdefineID: '',
        stockdefine: {},
        departmentid: '',
        department: {},
        skt: null,
        barcodeno: '',
        usageamount: 0,
        amount: 0,
        maxamount: 0,
        isonusage: false,
        isdeactive: false,
        deactivetime: null,
        info: '',
        source: '',
        unitID: '',
        unit: {},
        key: Math.random(),
        concurrencyStamp: '',
        createdUser: '',
        updatedUser: '',
        deleteUser: '',
        createTime: null,
        updateTime: null,
        deleteTime: null,
        isActive: true,
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


