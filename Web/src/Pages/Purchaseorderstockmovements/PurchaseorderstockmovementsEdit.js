import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
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
export default class PurchaseorderstockmovementsEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedstock: "",
      selectedmovement: "",
    }
  }


  componentDidMount() {
    const { GetPurchaseorderstockmovement, GetPurchaseorderstocks, match, history } = this.props
    if (match.params.PurchaseorderstockmovementID) {
      GetPurchaseorderstockmovement(match.params.PurchaseorderstockmovementID)
      GetPurchaseorderstocks()
    } else {
      history.push("/Purchaseorderstockmovement")
    }
  }

  componentDidUpdate() {
    const { Purchaseorderstocks, Purchaseorderstockmovements,
      removePurchaseorderstocknotification, removePurchaseorderstockmovementnotification } = this.props
    const { selected_record, isLoading } = Purchaseorderstockmovements
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && Purchaseorderstocks.list.length > 0 && !Purchaseorderstocks.isLoading
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selectedstock: selected_record.StockID,
        selectedmovement: selected_record.Movementtype,
        isDatafetched: true
      })
      this.context.setFormstates(selected_record)
    }
    Notification(Purchaseorderstockmovements.notifications, removePurchaseorderstockmovementnotification)
    Notification(Purchaseorderstocks.notifications, removePurchaseorderstocknotification)
  }

  render() {
    const { Purchaseorderstockmovements, Purchaseorderstocks, Profile } = this.props

    const Purchaseorderstockoptions = Purchaseorderstocks.list.map(stock => {
      return { key: stock.Uuid, text: `${stock.Stockdefine.Name} - ${stock.Barcodeno}`, value: stock.Uuid }
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
            <Form onSubmit={this.handleSubmit}>
              <FormInput placeholder={Literals.Columns.Stockdefine[Profile.Language]} value={this.state.selectedstock} options={Purchaseorderstockoptions} onChange={this.handleChangeStock} formtype='dropdown' />
              <Form.Group widths='equal'>
                <FormInput placeholder={Literals.Columns.Amount[Profile.Language]} name="Amount" type='number' />
                <FormInput placeholder={Literals.Columns.Movementtype[Profile.Language]} value={this.state.selectedmovement} options={Movementoptions} onChange={this.handleChangeMovement} fromtype='dropdown' />
              </Form.Group>
              <Footerwrapper>
                <Link to="/Purchaseorderstockmovements">
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
    const { EditPurchaseorderstockmovements, history, fillPurchaseorderstockmovementnotification, Profile, Purchaseorderstockmovements } = this.props
    const data = formToObject(e.target)
    data.Movementtype = this.state.selectedmovement
    data.StockID = this.state.selectedstock
    data.Amount = parseFloat(data.Amount)
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


  handleChangeStock = (e, { value }) => {
    this.setState({ selectedstock: value })
  }
  handleChangeMovement = (e, { value }) => {
    this.setState({ selectedmovement: value })
  }


  getLocalDate = () => {
    var curr = new Date();
    curr.setDate(curr.getDate() + 3);
    var date = curr.toISOString().substring(0, 10);
    return date
  }
}
PurchaseorderstockmovementsEdit.contextType = FormContext