import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Icon, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import Literals from './Literals'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import FormInput from '../../Utils/FormInput'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import PurchaseordersCreate from '../../Containers/Purchaseorders/PurchaseordersCreate'
import StockdefinesCreate from '../../Containers/Stockdefines/StockdefinesCreate'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
export default class PurchaseorderstocksCreate extends Component {

  PAGE_NAME = "PurchaseorderstocksCreate"

  constructor(props) {
    super(props)
    this.state = {
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetDepartments, GetStockdefines, GetPurchaseorders } = this.props
    GetDepartments()
    GetStockdefines()
    GetPurchaseorders()
  }

  render() {
    const { Purchaseorders, Purchaseorderstocks, Departments, Stockdefines, Profile } = this.props

    const Departmentoptions = (Departments.list || []).filter(u => u.Isactive).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })
    const Stockdefineoptions = (Stockdefines.list || []).filter(u => u.Isactive && !u.Issupply && !u.Ismedicine).map(define => {
      return { key: define.Uuid, text: define.Name, value: define.Uuid }
    })
    const Purchaseorderoptions = (Purchaseorders.list || []).filter(u => u.Isactive).map(order => {
      return { key: order.Uuid, text: order.Purchasenumber, value: order.Uuid }
    })

    return (
      Purchaseorderstocks.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Purchaseorderstocks"}>
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
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Purchaseorder[Profile.Language]} name="PurchaseorderID" options={Purchaseorderoptions} formtype='dropdown' modal={PurchaseordersCreate} />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Stockdefine[Profile.Language]} name="StockdefineID" options={Stockdefineoptions} formtype='dropdown' modal={StockdefinesCreate} />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Amount[Profile.Language]} name="Amount" step="0.01" type='number' />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Department[Profile.Language]} name="DepartmentID" options={Departmentoptions} formtype='dropdown' modal={DepartmentsCreate} />
              </Form.Group>
              <Footerwrapper>
                <Link to="/Purchaseorderstocks">
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
    const { AddPurchaseorderstocks, history, fillPurchaseorderstocknotification, Profile, closeModal } = this.props
    const data = formToObject(e.target)
    data.DepartmentID = this.context.formstates[`${this.PAGE_NAME}/DepartmentID`]
    data.StockdefineID = this.context.formstates[`${this.PAGE_NAME}/StockdefineID`]
    data.PurchaseorderID = this.context.formstates[`${this.PAGE_NAME}/PurchaseorderID`]
    data.Amount = parseFloat(data.Amount)
    data.Order = 0
    data.Ismedicine = false
    data.Issupply = false
    data.Isredprescription = false
    data.Isapproved = false

    let errors = []
    if (!validator.isUUID(data.DepartmentID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.DepartmentRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.PurchaseorderID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.PurchasenumberRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.StockdefineID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.StokdefineRequired[Profile.Language] })
    }
    if (!validator.isNumber(data.Amount)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.AmountRequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPurchaseorderstocknotification(error)
      })
    } else {
      AddPurchaseorderstocks({ data, history, closeModal })
    }
  }

  getLocalDate = () => {
    var curr = new Date();
    curr.setDate(curr.getDate() + 3);
    var date = curr.toISOString().substring(0, 10);
    return date
  }
}
PurchaseorderstocksCreate.contextType = FormContext