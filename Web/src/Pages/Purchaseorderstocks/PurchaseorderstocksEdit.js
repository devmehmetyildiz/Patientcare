import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
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
export default class PurchaseorderstocksEdit extends Component {
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
    const { GetPurchaseorderstock, GetPurchaseorders, match, history, GetDepartments, GetStockdefines } = this.props
    if (match.params.PurchaseorderstockID) {
      GetPurchaseorderstock(match.params.PurchaseorderstockID)
      GetDepartments()
      GetStockdefines()
      GetPurchaseorders()
    } else {
      history.push("/Purchaseorderstocks")
    }
  }

  componentDidUpdate() {
    const { Departments, Stockdefines, Purchaseorderstocks, Purchaseorders, removePurchaseordernotification,
      removePurchaseorderstocknotification, removeStockdefinenotification, removeDepartmentnotification } = this.props
    const { selected_record, isLoading } = Purchaseorderstocks
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.id !== 0
      && Departments.list.length > 0 && !Departments.isLoading
      && Purchaseorders.list.length > 0 && !Purchaseorders.isLoading
      && Purchaseorderstocks.list.length > 0 && !Purchaseorderstocks.isLoading
      && Stockdefines.list.length > 0 && !Stockdefines.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selecteddepartments: selected_record.departmentid,
        selectedstockdefine: selected_record.stockdefineID,
        selectedpurchaseorder: selected_record.purchaseorderID,
        isDatafetched: true
      })
      this.context.setFormstates(selected_record)
    }
    Notification(Purchaseorders.notifications, removePurchaseordernotification)
    Notification(Departments.notifications, removeDepartmentnotification)
    Notification(Stockdefines.notifications, removeStockdefinenotification)
    Notification(Purchaseorderstocks.notifications, removePurchaseorderstocknotification)
  }

  render() {
    const { Purchaseorderstocks, Purchaseorders, Departments, Stockdefines, Profile } = this.props

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
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
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
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditPurchaseorderstocks, history, fillPurchaseorderstocknotification, Purchaseorderstocks, Profile } = this.props
    const data = formToObject(e.target)
    data.DepartmentID = this.state.selecteddepartments
    data.StockdefineID = this.state.selectedstockdefine
    data.purchaseorderID = this.state.selectedpurchaseorder

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
      EditPurchaseorderstocks({ data: { ...Purchaseorderstocks.selected_record, ...data }, history })
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

  getLocalDate = (inputdate) => {
    if (inputdate) {
      let res = inputdate.split('T')
      return res[0]
    }
  }
}
PurchaseorderstocksEdit.contextType = FormContext