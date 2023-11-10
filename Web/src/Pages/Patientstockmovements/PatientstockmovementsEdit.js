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
import Gobackbutton from '../../Common/Gobackbutton'
import Submitbutton from '../../Common/Submitbutton'
export default class PatientstockmovementsEdit extends Component {

  PAGE_NAME = "PatientstockmovementsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { GetPatientstockmovement, GetPatientstocks, match, history, PatientstockmovementID, GetStockdefines } = this.props
    let Id = PatientstockmovementID || match?.params?.PatientstockmovementID
    if (validator.isUUID(Id)) {
      GetPatientstockmovement(Id)
      GetPatientstocks()
      GetStockdefines()
    } else {
      history.push("/Patientstockmovement")
    }
  }

  componentDidUpdate() {
    const { Patientstockmovements, Patientstocks, Stockdefines } = this.props
    const { selected_record, isLoading } = Patientstockmovements
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !Stockdefines.isLoading && !Patientstocks.isLoading
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {
    const { Patientstockmovements, Patientstocks, Profile, history, Stockdefines } = this.props

    const Patientstockoptions = (Patientstocks.list || []).filter(u => u.Isactive).map(stock => {
      if (stock.Barcodeno) {
        return { key: stock.Uuid, text: `${(Stockdefines.list || []).find(define => define.Uuid === stock.StockdefineID)?.Name} - ${stock.Barcodeno}`, value: stock.Uuid }
      }
      else {
        return { key: stock.Uuid, text: `${(Stockdefines.list || []).find(define => define.Uuid === stock.StockdefineID)?.Name}`, value: stock.Uuid }
      }
    })

    const Movementoptions = [
      { key: -1, text: Literals.Options.Movementoptions.value0[Profile.Language], value: -1 },
      { key: 1, text: Literals.Options.Movementoptions.value1[Profile.Language], value: 1 },
    ]

    return (
      Patientstockmovements.isLoading || Patientstockmovements.isDispatching ? <LoadingPage /> :
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
            <Form>
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Stockdefine[Profile.Language]} name="StockID" options={Patientstockoptions} formtype="dropdown" />
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Amount[Profile.Language]} name="Amount" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Movementtype[Profile.Language]} name="Movementtype" options={Movementoptions} formtype="dropdown" />
              </Form.Group>
              <Footerwrapper>
                <Gobackbutton
                  history={history}
                  redirectUrl={"/Patientstockmovements"}
                  buttonText={Literals.Button.Goback[Profile.Language]}
                />
                <Submitbutton
                  isLoading={Patientstockmovements.isLoading}
                  buttonText={Literals.Button.Update[Profile.Language]}
                  submitFunction={this.handleSubmit}
                />
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditPatientstockmovements, history, fillPatientstockmovementnotification, Patientstockmovements, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
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
}
PatientstockmovementsEdit.contextType = FormContext