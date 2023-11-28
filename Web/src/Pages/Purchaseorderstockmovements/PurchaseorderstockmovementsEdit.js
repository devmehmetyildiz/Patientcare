import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Form } from 'semantic-ui-react'
import LoadingPage from '../../Utils/LoadingPage'
import Literals from './Literals'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import FormInput from '../../Utils/FormInput'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import Gobackbutton from '../../Common/Gobackbutton'
import Submitbutton from '../../Common/Submitbutton'
export default class PurchaseorderstockmovementsEdit extends Component {

  PAGE_NAME = "PurchaseorderstockmovementsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { PurchaseorderstockmovementID, GetPurchaseorderstockmovement, GetPurchaseorderstocks, match, history, GetStockdefines } = this.props
    let Id = PurchaseorderstockmovementID || match?.params?.PurchaseorderstockmovementID
    if (validator.isUUID(Id)) {
      GetPurchaseorderstockmovement(Id)
      GetPurchaseorderstocks()
      GetStockdefines()
    } else {
      history.push("/Purchaseorderstockmovement")
    }
  }

  componentDidUpdate() {
    const { Purchaseorderstocks, Purchaseorderstockmovements } = this.props
    const { selected_record, isLoading } = Purchaseorderstockmovements
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && Purchaseorderstocks.list.length > 0 && !Purchaseorderstocks.isLoading
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {
    const { Purchaseorderstockmovements, Purchaseorderstocks, Profile, history, Stockdefines } = this.props

    const Purchaseorderstockoptions = (Purchaseorderstocks.list || []).filter(u => u.Isactive).map(stock => {
      if (stock.Barcodeno) {
        return { key: stock.Uuid, text: `${(Stockdefines.list || []).find(define => define.Uuid === stock.StockdefineID)?.Name} - ${stock.Barcodeno}`, value: stock.Uuid }
      }
      else {
        return { key: stock.Uuid, text: `${(Stockdefines.list || []).find(define => define.Uuid === stock.StockdefineID)?.Name}`, value: stock.Uuid }
      }
    })

    const Movementoptions = [
      { key: -1, text: "STOKDAN DÜŞME", value: -1 },
      { key: 1, text: "STOĞA EKLEME", value: 1 },
    ]

    return (
      Purchaseorderstocks.isLoading || Purchaseorderstocks.isDispatching || Purchaseorderstockmovements.isLoading || Purchaseorderstockmovements.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Purchaseorderstockmovements"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Stockdefine[Profile.Language]} name="StockID" options={Purchaseorderstockoptions} formtype='dropdown' />
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Amount[Profile.Language]} name="Amount" type='number' />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Movementtype[Profile.Language]} name="Movementtype" options={Movementoptions} formtype='dropdown' />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Purchaseorderstockmovements"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Purchaseorderstockmovements.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditPurchaseorderstockmovements, history, fillPurchaseorderstockmovementnotification, Profile, Purchaseorderstockmovements } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isNumber(data.Movementtype)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Movementrequired[Profile.Language] })
    }
    if (!validator.isUUID(data.StockID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Stockrequired[Profile.Language] })
    }
    if (!validator.isNumber(data.Amount)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Amountrequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPurchaseorderstockmovementnotification(error)
      })
    } else {
      EditPurchaseorderstockmovements({ data: { ...Purchaseorderstockmovements.selected_record, ...data }, history })
    }
  }

  getLocalDate = () => {
    var curr = new Date();
    curr.setDate(curr.getDate() + 3);
    var date = curr.toISOString().substring(0, 10);
    return date
  }
}
PurchaseorderstockmovementsEdit.contextType = FormContext