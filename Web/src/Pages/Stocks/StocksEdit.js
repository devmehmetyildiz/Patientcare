import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'
import Literals from './Literals'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import FormInput from '../../Utils/FormInput'
import validator from '../../Utils/Validator'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import { FormContext } from '../../Provider/FormProvider'
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
    const { Departments, Stockdefines, Stocks, Warehouses,
      removeWarehousenotification, removeStocknotification, removeStockdefinenotification,
      removeDepartmentnotification } = this.props

    const { selected_record, isLoading } = Stocks
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && Departments.list.length > 0 && !Departments.isLoading
      && Warehouses.list.length > 0 && !Warehouses.isLoading
      && Stockdefines.list.length > 0 && !Stockdefines.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selecteddepartments: selected_record.DepartmentID,
        selectedstockdefine: selected_record.StockdefineID,
        selectedwarehouse: selected_record.WarehouseID,
        isDatafetched: true
      })
      this.context.setFormstates(selected_record)
    }
    Notification(Stocks.notifications, removeStocknotification)
    Notification(Warehouses.notifications, removeWarehousenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Stockdefines.notifications, removeStockdefinenotification)
  }

  render() {
    const { Stocks, Warehouses, Departments, Stockdefines, Profile } = this.props

    const Departmentoptions = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })
    const Stockdefineoptions = Stockdefines.list.map(define => {
      return { key: define.Uuid, text: define.Name, value: define.Uuid }
    })
    const Warehouseoptions = Warehouses.list.map(warehouse => {
      return { key: warehouse.Uuid, text: warehouse.Name, value: warehouse.Uuid }
    })

    return (
      Stockdefines.isLoading || Stockdefines.isDispatching || Stocks.isLoading || Stocks.isDispatching || Departments.isLoading || Departments.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Stocks"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group widths='equal'>
                <FormInput placeholder={Literals.Columns.Warehouse[Profile.Language]} options={Warehouseoptions} onChange={this.handleChangeWarehouse} value={this.state.selectedwarehouse} formtype='dropdown' />
                <FormInput placeholder={Literals.Columns.Stockdefine[Profile.Language]} options={Stockdefineoptions} onChange={this.handleChangeStockdefine} value={this.state.selectedstockdefine} formtype='dropdown' />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput placeholder={Literals.Columns.Barcodeno[Profile.Language]} name="Barcodeno" />
                <FormInput placeholder={Literals.Columns.Amount[Profile.Language]} name="Amount" step="0.01" type='number' />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput placeholder={Literals.Columns.Skt[Profile.Language]} name="Skt" type='date' defaultValue={this.getLocalDate()} />
                <FormInput placeholder={Literals.Columns.Department[Profile.Language]} value={this.state.selecteddepartments} options={Departmentoptions} onChange={this.handleChangeDepartment} formtype='dropdown' />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput placeholder={Literals.Columns.Info[Profile.Language]} name="Info" />
              </Form.Group>
              <Footerwrapper>
                <Link to="/Stocks">
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditStocks, history, fillStocknotification, Stocks, Profile } = this.props
    const data = formToObject(e.target)
    data.DepartmentID = this.state.selecteddepartments
    data.StockdefineID = this.state.selectedstockdefine
    data.WarehouseID = this.state.selectedwarehouse

    let errors = []
    if (!validator.isUUID(data.DepartmentID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.DepartmentRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.WarehouseID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.WarehouseRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.StockdefineID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.StokdefineRequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillStocknotification(error)
      })
    } else {
      EditStocks({ data: { ...Stocks.selected_record, ...data }, history })
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
StocksEdit.contextType = FormContext