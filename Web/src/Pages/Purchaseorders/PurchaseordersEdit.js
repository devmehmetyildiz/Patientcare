import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form, Icon, Popup, Table } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
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
    const { Stockdefines, Purchaseorders, Cases, Departments, Warehouses, removePurchaseordernotification, removeDepartmentnotification,
      removeCasenotification, removeStockdefinenotification, removeWarehousenotification } = this.props
    const { selected_record, isLoading } = Purchaseorders
    if (selected_record && Object.keys(selected_record).length > 0 &&
      selected_record.Id !== 0 && Stockdefines.list.length > 0 && !Stockdefines.isLoading
      && Cases.list.length > 0 && !Cases.isLoading
      && Warehouses.list.length > 0 && !Warehouses.isLoading
      && Departments.list.length > 0 && !Departments.isLoading
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selectedStocks: selected_record.Stocks, isDatafetched: true, selectedCase: selected_record.CaseID
      })
    }
    Notification(Purchaseorders, removePurchaseordernotification)
    Notification(Departments, removeDepartmentnotification)
    Notification(Cases, removeCasenotification)
    Notification(Stockdefines, removeStockdefinenotification)
    Notification(Warehouses, removeWarehousenotification)
  }

  render() {

    const { Cases, Departments, Stockdefines, Warehouses, Purchaseorders } = this.props
    const { isLoading, isDispatching, selected_record } = Purchaseorders

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
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label className='text-[#000000de]'>Hedef Ambar</label>
                  <Dropdown value={this.state.selectedWarehouse} placeholder='Hedef Ambar' clearable search fluid selection options={Warehousesoption} onChange={(e, data) => { this.setState({ selectedWarehouse: data.value }) }} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Input defaultValue={selected_record.Company} placeholder="Firma Adı" name="Company" fluid label="Firma Adı" />
                <Form.Input defaultValue={selected_record.Purchaseprice} placeholder="Alış Fiyatı" name="Purchaseprice" fluid label="Alış Fiyatı" type='number' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Input defaultValue={selected_record.Companypersonelname} placeholder="Siparişi Getiren" name="Companypersonelname" fluid label="Siparişi Getiren" />
                <Form.Input defaultValue={selected_record.Purchasenumber} placeholder="Sipariş Numarası" name="Purchasenumber" fluid label="Sipariş Numarası" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label className='text-[#000000de]'>Sipariş Durumu</label>
                  <Dropdown value={this.state.selectedCase} placeholder='Sipariş Durumu' clearable search fluid selection options={Casesoption} onChange={(e, data) => { this.setState({ selectedCase: data.value }) }} />
                </Form.Field>
                <Form.Input defaultValue={selected_record.Personelname} placeholder="Teslim Alan" name="Personelname" fluid label="Teslim Alan" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Input defaultValue={selected_record.Purchasedate && selected_record.Purchasedate.split('T')[0]} placeholder="Satın Alma Tarihi" name="Purchasedate" type='date' fluid label="Satın Alma Tarihi" />
                <Form.Input defaultValue={selected_record.Info} placeholder="Açıklama" name="Info" fluid label="Açıklama" />
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
                          <Form.Input value={stock.Info} placeholder="Açıklama" name="info" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'info', e.target.value) }} />
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
      data.Amount = parseFloat(data.Amount)
      delete data.key
    });

    const responseData = {
      Info: Array.isArray(formData.Info) ? formData.Info[0] : formData.Info,
      Company: formData.Company,
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
      if (!data.Amount || data.Amount === '' || data.amount === 0) {
        errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Miktar Girilmemiş' })
      }
      if (!data.UnitID || data.UnitID === '') {
        errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Birim Girilmemiş' })
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
    if (!responseData.WarehouseID || responseData.WarehouseID === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Ambar girilmedi' })
    }
    if (!responseData.CaseID || responseData.CaseID === '') {
      errors.push({ type: 'Error', code: 'Puchaseorders', description: 'Sipariş durumu girilmedi' })
    }
    if (!responseData.Purchasedate || responseData.Purchasedate === '') {
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


}


