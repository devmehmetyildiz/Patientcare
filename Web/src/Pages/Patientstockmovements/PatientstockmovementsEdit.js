import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import { Breadcrumb, Button } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import { FormContext } from '../../Provider/FormProvider'
import FormInput from '../../Utils/FormInput'
export default class PatientstockmovementsEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedstock: "",
      selectedmovement: "",
    }
  }

  componentDidMount() {
    const { GetPatientstockmovement, GetPatientstocks, match, history } = this.props
    if (match.params.PatientstockmovementID) {
      GetPatientstockmovement(match.params.PatientstockmovementID)
      GetPatientstocks()
    } else {
      history.push("/Patientstockmovement")
    }
  }

  componentDidUpdate() {
    const { Patientstockmovements, Patientstocks, removePatientstocknotification, removePatientstockmovementnotification } = this.props
    const { selected_record, isLoading } = Patientstockmovements
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && Patientstocks.list.length > 0 && !Patientstocks.isLoading
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selectedstock: selected_record.stockID,
        selectedmovement: selected_record.movementtype,
        isDatafetched: true
      })
      this.context.setFormstates(selected_record)
    }
    Notification(Patientstockmovements.notifications, removePatientstockmovementnotification)
    Notification(Patientstocks.notifications, removePatientstocknotification)
  }

  render() {
    const { Patientstockmovements, Patientstocks,Profile } = this.props

    const Patientstockoptions = Patientstocks.list.map(stock => {
      return { key: stock.Uuid, text: `${stock.Stockdefine.Name} - ${stock.Barcodeno}`, value: stock.Uuid }
    })

    const Movementoptions = [
      { key: -1, text: Literals.Options.Movementoptions.value0[Profile.Language], value: -1 },
      { key: 1, text: Literals.Options.Movementoptions.value1[Profile.Language], value: 1 },
    ]

    return (
      Patientstocks.isLoading || Patientstocks.isDispatching || Patientstockmovements.isLoading || Patientstockmovements.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patientstockmovements"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
              <FormInput placeholder={Literals.Columns.Stockdefine[Profile.Language]} value={this.state.selectedstock} options={Patientstockoptions} onChange={this.handleChangeStock} formtype="dropdown" />
              <Form.Group widths='equal'>
                <FormInput placeholder={Literals.Columns.Amount[Profile.Language]} name="Amount" />
                <FormInput placeholder={Literals.Columns.Movementtype[Profile.Language]} value={this.state.selectedmovement} options={Movementoptions} onChange={this.handleChangeMovement} formtype="dropdown" />
              </Form.Group>
              <Footerwrapper>
                <Link to="/Patientstockmovements">
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
    const { EditPatientstockmovements, history, fillPatientstockmovementnotification, Patientstockmovements, Profile } = this.props
    const data = formToObject(e.target)
    data.StockID = this.state.selectedstock
    data.Movementtype = this.state.selectedmovement
    data.Movementdate = new Date()
    data.Movementtype && (data.Movementdate = parseInt(data.Movementtype))
    data.Amount && (data.Amount = parseFloat(data.Amount))

    let errors = []
    if (!validator.isNumber(data.Movementtype)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.MovementRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.StockID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.StockRequired[Profile.Language] })
    }
    if (!validator.isNumber(data.Amount)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.AmountRequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientstockmovementnotification(error)
      })
    } else {
      EditPatientstockmovements({ data: { ...Patientstockmovements.selected_record, ...data }, history })
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
PatientstockmovementsEdit.contextType = FormContext