import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import PurchaseordersCreate from '../../Containers/Purchaseorders/PurchaseordersCreate'
import StockdefinesCreate from '../../Containers/Stockdefines/StockdefinesCreate'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
export default class PurchaseorderstocksEdit extends Component {

  PAGE_NAME = "PurchaseorderstocksEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }


  componentDidMount() {
    const { PurchaseorderstockID, GetPurchaseorderstock, GetPurchaseorders, match, history, GetDepartments, GetStockdefines } = this.props
    let Id = PurchaseorderstockID || match?.params?.PurchaseorderstockID
    if (validator.isUUID(Id)) {
      GetPurchaseorderstock(Id)
      GetDepartments()
      GetStockdefines()
      GetPurchaseorders()
    } else {
      history.push("/Purchaseorderstocks")
    }
  }

  componentDidUpdate() {
    const { Departments, Stockdefines, Purchaseorderstocks, Purchaseorders } = this.props
    const { selected_record, isLoading } = Purchaseorderstocks
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.id !== 0
      && !Departments.isLoading
      && !Purchaseorders.isLoading
      && !Purchaseorderstocks.isLoading
      && !Stockdefines.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {
    const { Purchaseorderstocks, Purchaseorders, Departments, Stockdefines, Profile, history } = this.props

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
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Purchaseorder[Profile.Language]} name="PurchaseorderID" options={Purchaseorderoptions} formtype='dropdown' modal={PurchaseordersCreate} />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Stockdefine[Profile.Language]} name="StockdefineID" options={Stockdefineoptions} formtype='dropdown' modal={StockdefinesCreate} />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Department[Profile.Language]} name="DepartmentID" options={Departmentoptions} formtype='dropdown' modal={DepartmentsCreate} />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Purchaseorderstocks"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Purchaseorderstocks.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditPurchaseorderstocks, history, fillPurchaseorderstocknotification, Purchaseorderstocks, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)

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
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPurchaseorderstocknotification(error)
      })
    } else {
      EditPurchaseorderstocks({ data: { ...Purchaseorderstocks.selected_record, ...data }, history })
    }
  }

  getLocalDate = (inputdate) => {
    if (inputdate) {
      let res = inputdate.split('T')
      return res[0]
    }
  }
}
PurchaseorderstocksEdit.contextType = FormContext