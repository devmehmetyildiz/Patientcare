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

export default class MedicinesCreate extends Component {

  PAGE_NAME = "MedicinesCreate"

  componentDidMount() {
    const { GetDepartments, GetStockdefines, GetWarehouses } = this.props
    GetDepartments()
    GetStockdefines()
    GetWarehouses()
  }

  componentDidUpdate() {
    const { Stocks, Warehouses, removeWarehousenotification, removeStocknotification,
      Departments, Stockdefines, removeStockdefinenotification, removeDepartmentnotification } = this.props
    Notification(Stocks.notifications, removeStocknotification)
    Notification(Warehouses.notifications, removeWarehousenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Stockdefines.notifications, removeStockdefinenotification)
  }

  render() {
    const { Stocks, Warehouses, Departments, Stockdefines, Profile } = this.props

    const Departmentoptions = (Departments.list || []).filter(u => u.Isactive).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })
    const Stockdefineoptions = (Stockdefines.list || []).filter(u => u.Isactive && u.Ismedicine).map(define => {
      return { key: define.Uuid, text: define.Name, value: define.Uuid }
    })
    const Warehouseoptions = (Warehouses.list || []).filter(u => u.Isactive).map(warehouse => {
      return { key: warehouse.Uuid, text: warehouse.Name, value: warehouse.Uuid }
    })

    return (
      Stockdefines.isLoading || Stockdefines.isDispatching || Stocks.isLoading || Stocks.isDispatching || Departments.isLoading || Departments.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Medicines"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Warehouse[Profile.Language]} options={Warehouseoptions} name="WarehouseID" formtype='dropdown' />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Stockdefine[Profile.Language]} options={Stockdefineoptions} name="StockdefineID" formtype='dropdown' />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Barcodeno[Profile.Language]} name="Barcodeno" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Amount[Profile.Language]} name="Amount" step="0.01" type='number' />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Skt[Profile.Language]} name="Skt" type="date" defaultValue={'2023-06-20'} />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Department[Profile.Language]} options={Departmentoptions} name="DepartmentID" formtype='dropdown' />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Info[Profile.Language]} name="Info" />
              </Form.Group>
              <Footerwrapper>
                <Link to="/Medicines">
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Create[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddStocks, history, fillStocknotification, Profile } = this.props
    const data = formToObject(e.target)
    data.DepartmentID = this.context.formstates[`${this.PAGE_NAME}/DepartmentID`]
    data.StockdefineID = this.context.formstates[`${this.PAGE_NAME}/StockdefineID`]
    data.WarehouseID = this.context.formstates[`${this.PAGE_NAME}/WarehouseID`]
    data.Status = 0
    data.Source = "Single Request"
    data.Amount = parseFloat(data.Amount)
    data.Ismedicine = true
    data.Isonusage = false
    data.Order = 1
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
    if (!validator.isNumber(data.Amount)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.AmountRequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillStocknotification(error)
      })
    } else {
      AddStocks({ data, history, redirectUrl: '/Medicines' })
    }
  }

  getLocalDate = () => {
    var today = new Date();
    let test = today.toLocaleString('tr-TR', { timeZone: 'UTC' }).substring(0, 10)
    let value = today.toISOString().substring(0, 10)
    return '2023-06-20'
  }
}
MedicinesCreate.contextType = FormContext