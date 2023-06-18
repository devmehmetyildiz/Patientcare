import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import { Breadcrumb, Button } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'
import FormInput from '../../Utils/FormInput'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
export default class PatientstockmovementsCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedstock: "",
      selectedmovement: "",
    }
  }

  componentDidMount() {
    const { GetPatientstocks } = this.props
    GetPatientstocks()
  }

  componentDidUpdate() {
    const { Patientstockmovements, Patientstocks, removePatientstocknotification, removePatientstockmovementnotification } = this.props
    Notification(Patientstockmovements.notifications, removePatientstockmovementnotification)
    Notification(Patientstocks.notifications, removePatientstocknotification)
  }

  render() {
    const { Patientstockmovements, Patientstocks, Profile } = this.props

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
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
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
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddPatientstockmovements, history, fillPatientstockmovementnotification, Profile } = this.props
    const data = formToObject(e.target)
    data.StockID = this.state.selectedstock
    data.Movementtype = this.state.selectedmovement
    data.Movementdate = new Date()
    data.Newvalue = 0
    data.Prevvalue = 0
    data.Status = 0
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
      AddPatientstockmovements({ data, history })
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