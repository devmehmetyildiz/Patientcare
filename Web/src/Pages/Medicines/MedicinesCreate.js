import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
import StockdefinesCreate from '../../Containers/Stockdefines/StockdefinesCreate'
import WarehousesCreate from '../../Containers/Warehouses/WarehousesCreate'

export default class MedicinesCreate extends Component {

  PAGE_NAME = "MedicinesCreate"

  constructor(props) {
    super(props)
    this.state = {
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetDepartments, GetStockdefines, GetWarehouses } = this.props
    GetDepartments()
    GetStockdefines()
    GetWarehouses()
  }


  render() {
    const { Stocks, Warehouses, Departments, Stockdefines, Profile, history, closeModal } = this.props

    const Departmentoptions = (Departments.list || []).filter(u => u.Isactive && u.Ishavepatients).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })
    const Stockdefineoptions = (Stockdefines.list || []).filter(u => u.Isactive && u.Ismedicine && !u.Issupply).map(define => {
      return { key: define.Uuid, text: define.Name, value: define.Uuid }
    })
    const Warehouseoptions = (Warehouses.list || []).filter(u => u.Isactive && u.Ismedicine).map(warehouse => {
      return { key: warehouse.Uuid, text: warehouse.Name, value: warehouse.Uuid }
    })

    return (
      Stocks.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Medicines"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Warehouse[Profile.Language]} options={Warehouseoptions} name="WarehouseID" formtype='dropdown' modal={WarehousesCreate} />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Stockdefine[Profile.Language]} options={Stockdefineoptions} name="StockdefineID" formtype='dropdown' modal={StockdefinesCreate} />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Barcodeno[Profile.Language]} name="Barcodeno" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Amount[Profile.Language]} name="Amount" step="0.01" type='number' />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Skt[Profile.Language]} name="Skt" type="date" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Department[Profile.Language]} options={Departmentoptions} name="DepartmentID" formtype='dropdown' modal={DepartmentsCreate} />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Info[Profile.Language]} name="Info" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Medicines"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Stocks.isLoading}
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddStocks, history, fillStocknotification, Profile, Stockdefines, closeModal } = this.props
    const data = this.context.getForm(this.PAGE_NAME)

    data.Order = 0
    data.Ismedicine = true
    data.Issupply = false
    data.Isredprescription = (Stockdefines.list || []).find(u => u.Uuid === data.StockdefineID)?.Isredprescription || false
    data.Isapproved = false
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
      AddStocks({ data, history, redirectUrl: '/Medicines', closeModal })
    }
  }

}
MedicinesCreate.contextType = FormContext