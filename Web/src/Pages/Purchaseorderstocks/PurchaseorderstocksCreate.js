import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
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

    Notification(Purchaseorders.notifications, removePurchaseordernotification)
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Stockdefines.notifications, removeStockdefinenotification)
    Notification(Purchaseorderstocks.notifications, removePurchaseorderstocknotification)
  }

  render() {
    const { Purchaseorders, Purchaseorderstocks, Departments, Stockdefines, Profile } = this.props

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
                <FormInput placeholder={Literals.Columns.Purchaseorder[Profile.Language]} value={this.state.selectedpurchaseorder} options={Purchaseorderoptions} onChange={this.handleChangePurchase} formtype='dropdown' />
                <FormInput placeholder={Literals.Columns.Stockdefine[Profile.Language]} value={this.state.selectedstockdefine} options={Stockdefineoptions} onChange={this.handleChangeStockdefine} formtype='dropdown' />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput placeholder={Literals.Columns.Barcodeno[Profile.Language]} name="Barcodeno" />
                <FormInput placeholder={Literals.Columns.Amount[Profile.Language]} name="Amount" step="0.01" type='number' />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput placeholder={Literals.Columns.Skt[Profile.Language]} name="Skt" type='date' defaultValue={this.getLocalDate()} />
                <FormInput placeholder={Literals.Columns.Department[Profile.Language]} value={this.state.selecteddepartments} options={Departmentoptions} onChange={this.handleChangeDepartment} formtype='dropdown' />
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
    const { AddPurchaseorderstocks, history, fillPurchaseorderstocknotification, Profile } = this.props
    const data = formToObject(e.target)
    data.Amount = parseFloat(data.Amount)
    data.DepartmentID = this.state.selecteddepartments
    data.StockdefineID = this.state.selectedstockdefine
    data.PurchaseorderID = this.state.selectedpurchaseorder
    data.Status = 0
    data.IsActive = true
    data.Maxamount = data.Amount
    data.Source = "Single Request"
    data.Isonusage = false
    data.Order = 1
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
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.AmountRequired[Profile.Language]})
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPurchaseorderstocknotification(error)
      })
    } else {
      AddPurchaseorderstocks({ data, history })
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