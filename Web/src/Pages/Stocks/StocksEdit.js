import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form} from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Popuputil from '../../Utils/Popup'
import LoadingPage from '../../Utils/LoadingPage'

export default class StocksEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selecteddepartments: "",
      selectedstockdefine: "",
      selectedwarehouse: "",
      open: false
    }
  }


  componentDidMount() {
    const { GetStock, GetWarehouses, match, history, GetDepartments, GetStockdefines } = this.props
    if (match.params.StockID) {
      GetStock(match.params.StockID)
      GetDepartments()
      GetStockdefines()
      GetWarehouses()
    } else {
      history.push("/Stocks")
    }
  }

  componentDidUpdate() {
    const { Departments, Stockdefines, Stocks, Warehouses } = this.props
    const { selected_record, isLoading } = Stocks
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.id !== 0
      && Departments.list.length > 0 && !Departments.isLoading
      && Warehouses.list.length > 0 && !Warehouses.isLoading
      && Stockdefines.list.length > 0 && !Stockdefines.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selecteddepartments: selected_record.departmentid,
        selectedstockdefine: selected_record.stockdefineID,
        selectedwarehouse: selected_record.warehouseID,
        isDatafetched: true
      })
    }
  }

  render() {
    const { Stocks, Warehouses, removeWarehousenotification, removeStocknotification, Departments, Stockdefines, removeStockdefinenotification, removeDepartmentnotification } = this.props
    const { selected_record } = Stocks
    if (Stocks.notifications && Stocks.notifications.length > 0) {
      let msg = Stocks.notifications[0]
      Popuputil(msg.type, msg.code, msg.description)
      removeStocknotification()
    }
    if (Warehouses.notifications && Warehouses.notifications.length > 0) {
      let msg = Warehouses.notifications[0]
      Popuputil(msg.type, msg.code, msg.description)
      removeWarehousenotification()
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
    const Warehouseoptions = Warehouses.list.map(warehouse => {
      return { key: warehouse.concurrencyStamp, text: warehouse.name, value: warehouse.concurrencyStamp }
    })




    return (
      Stockdefines.isLoading || Stockdefines.isDispatching || Stocks.isLoading || Stocks.isDispatching || Departments.isLoading || Departments.isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Stocks"}>
                  <Breadcrumb.Section >Ürünler</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Güncelle</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={this.handleSubmit}>
              <Form.Group widths='equal'>
                <Form.Field>
                  <label className='text-[#000000de]'>Ambar</label>
                  <Dropdown placeholder='Ambar' fluid selection options={Warehouseoptions} onChange={this.handleChangeWarehouse} value={this.state.selectedwarehouse} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Ürün</label>
                  <Dropdown placeholder='Ürün' fluid selection options={Stockdefineoptions} onChange={this.handleChangeStockdefine} value={this.state.selectedstockdefine} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths='equal'>
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input label="Barkod No" placeholder="Barkod No" name="barcodeno" fluid defaultValue={selected_record.barcodeno} />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Field>
                  <Form.Input label="Skt" placeholder="Skt" name="skt" fluid type='date' defaultValue={this.getLocalDate(selected_record.skt)} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Departmanlar</label>
                  <Dropdown placeholder='Departmanlar' fluid selection options={Departmentoptions} onChange={this.handleChangeDepartment} value={this.state.selecteddepartments} />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Stocks">
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
    const { EditStocks, history, fillStocknotification, Stocks } = this.props
    const data = formToObject(e.target)
    data.departmentid = this.state.selecteddepartments
    data.stockdefineID = this.state.selectedstockdefine
    data.warehouseID = this.state.selectedwarehouse

    let errors = []
    if (!data.departmentid || data.departmentid === '') {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Departman Seçili Değil' })
    }
    if (!data.warehouseID || data.warehouseID === '') {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Ambar Seçili Değil' })
    }
    if (!data.stockdefineID || data.stockdefineID === '') {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Ürün Seçili Değil' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillStocknotification(error)
      })
    } else {
      const response = { ...Stocks.selected_record, ...data }
      EditStocks(response, history)
    }
  }

  handleChangeDepartment = (e, { value }) => {
    this.setState({ selecteddepartments: value })
  }

  handleChangeStockdefine = (e, { value }) => {
    this.setState({ selectedstockdefine: value })
  }
  handleChangeWarehouse = (e, { value }) => {
    this.setState({ selectedwarehouse: value })
  }

  getLocalDate = (inputdate) => {
    if (inputdate) {
      let res = inputdate.split('T')
      return res[0]
    }
  }
}