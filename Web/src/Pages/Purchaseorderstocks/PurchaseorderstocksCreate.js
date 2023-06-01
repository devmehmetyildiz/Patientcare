import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'

export default class PurchaseorderstocksCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selecteddepartments: "",
      selectedstockdefine: "",
      selectedpurchaseorder: "",
      open: false
    }
  }


  componentDidMount() {
    const { GetDepartments, GetStockdefines, GetPurchaseorders } = this.props
    GetDepartments()
    GetStockdefines()
    GetPurchaseorders()
  }

  componentDidUpdate() {
    const { Purchaseorders, Purchaseorderstocks, removePurchaseordernotification, Departments, Stockdefines,
      removeStockdefinenotification, removePurchaseorderstocknotification, removeDepartmentnotification } = this.props

    Notification(Purchaseorders, removePurchaseordernotification)
    Notification(Departments, removeDepartmentnotification)
    Notification(Stockdefines, removeStockdefinenotification)
    Notification(Purchaseorderstocks, removePurchaseorderstocknotification)
  }

  render() {
    const { Purchaseorders, Purchaseorderstocks, Departments, Stockdefines } = this.props

    const Departmentoptions = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })
    const Stockdefineoptions = Stockdefines.list.map(define => {
      return { key: define.Uuid, text: define.Name, value: define.Uuid }
    })
    const Purchaseorderoptions = Purchaseorders.list.map(order => {
      return { key: order.Uuid, text: order.Purchasenumber, value: order.Uuid }
    })

    return (
      Stockdefines.isLoading || Stockdefines.isDispatching || Purchaseorderstocks.isLoading || Purchaseorderstocks.isDispatching || Departments.isLoading || Departments.isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Purchaseorderstocks"}>
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
                  <label className='text-[#000000de]'>Sipariş</label>
                  <Dropdown placeholder='Sipariş' fluid selection options={Purchaseorderoptions} onChange={this.handleChangePurchase} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Ürün</label>
                  <Dropdown placeholder='Ürün' fluid selection options={Stockdefineoptions} onChange={this.handleChangeStockdefine} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths='equal'>
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input label="Barkod No" placeholder="Barkod No" name="Barcodeno" fluid />
                <Form.Input label="Miktar" placeholder="Miktar" name="Amount" fluid step="0.01" type='number' />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Field>
                  <Form.Input label="Skt" placeholder="Skt" name="Skt" fluid type='date' defaultValue={this.getLocalDate()} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Departmanlar</label>
                  <Dropdown placeholder='Departmanlar' fluid selection options={Departmentoptions} onChange={this.handleChangeDepartment} />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Purchaseorderstocks">
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
    const { AddPurchaseorderstocks, history, fillPurchaseorderstocknotification } = this.props
    const data = formToObject(e.target)
    data.Amount = parseFloat(data.Amount)
    data.DepartmentID = this.state.selecteddepartments
    data.StockdefineID = this.state.selectedstockdefine
    data.PurchaseorderID = this.state.selectedpurchaseorder
    data.Status = 0
    data.IsActive = true
    data.Maxamount = data.amount
    data.Source = "Single Request"
    data.Isonusage = false
    data.Order = 1
    let errors = []
    if (!data.DepartmentID || data.DepartmentID === '') {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Departman Seçili Değil' })
    }
    if (!data.PurchaseorderID || data.PurchaseorderID === '') {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Sipariş Seçili Değil' })
    }
    if (!data.StockdefineID || data.StockdefineID === '') {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Ürün Seçili Değil' })
    }
    if (!data.Amount || data.Amount === '' || data.Amount === 0) {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Miktar girilmedi' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPurchaseorderstocknotification(error)
      })
    } else {
      AddPurchaseorderstocks(data, history)
    }
  }

  handleChangeDepartment = (e, { value }) => {
    this.setState({ selecteddepartments: value })
  }

  handleChangeStockdefine = (e, { value }) => {
    this.setState({ selectedstockdefine: value })
  }
  handleChangePurchase = (e, { value }) => {
    this.setState({ selectedpurchaseorder: value })
  }


  getLocalDate = () => {
    var curr = new Date();
    curr.setDate(curr.getDate() + 3);
    var date = curr.toISOString().substring(0, 10);
    return date
  }
}