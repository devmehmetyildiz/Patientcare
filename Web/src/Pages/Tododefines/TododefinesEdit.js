import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Checkbox, Form } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import validator from '../../Utils/Validator'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import FormInput from '../../Utils/FormInput'
import { FormContext } from '../../Provider/FormProvider'
export default class TododefinesEdit extends Component {

  PAGE_NAME = "TododefinesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { TododefineID, GetTododefine, match, history, GetCheckperiods } = this.props
    let Id = TododefineID || match?.params?.TododefineID
    if (validator.isUUID(Id)) {
      GetTododefine(Id)
      GetCheckperiods()
    } else {
      history.push("/Tododefines")
    }
  }

  componentDidUpdate() {
    const { Tododefines, removeTododefinenotification, Checkperiods, removeCheckperiodnotification } = this.props
    const { notifications, selected_record, isLoading } = Tododefines
    if (selected_record && Object.keys(selected_record).length > 0 && !isLoading && selected_record.Id !== 0 && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true,
      })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, Checkperiods: selected_record.Checkperioduuids.map(u => { return u.CheckperiodID }) })
    }
    Notification(notifications, removeTododefinenotification)
    Notification(Checkperiods.notifications, removeCheckperiodnotification)
  }

  render() {

    const { Tododefines, Checkperiods, Profile } = this.props
    const { isLoading, isDispatching } = Tododefines

    const Checkperiodsoptions = (Checkperiods.list || []).filter(u => u.Isactive).map(checkperiod => {
      return { key: checkperiod.Uuid, text: checkperiod.Name, value: checkperiod.Uuid }
    })

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Tododefines"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Info[Profile.Language]} name="Info" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Checkperiods[Profile.Language]} name="Checkperiods" multiple options={Checkperiodsoptions} formtype='dropdown' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.IsRequired[Profile.Language]} name="IsRequired" formtype="checkbox" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.IsNeedactivation[Profile.Language]} name="IsNeedactivation" formtype="checkbox" />
              </Form.Group>
              <Footerwrapper>
                <Link to="/Tododefines">
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

    const { EditTododefines, history, removeTododefinenotification, Tododefines, Checkperiods, Profile } = this.props
    const data = formToObject(e.target)
    data.Checkperiods = this.context.formstates[`${this.PAGE_NAME}/Checkperiods`].map(id => {
      return (Checkperiods.list || []).find(u => u.Uuid === id)
    })
    data.IsRequired = this.context.formstates[`${this.PAGE_NAME}/IsRequired`] || false
    data.IsNeedactivation = this.context.formstates[`${this.PAGE_NAME}/IsNeedactivation`] || false

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
    }
    if (!validator.isArray(data.Checkperiods)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.CheckperiodsRequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        removeTododefinenotification(error)
      })
    } else {
      EditTododefines({ data: { ...Tododefines.selected_record, ...data }, history })
    }


  }

  boolValuechanger = (numberbool) => {
    if (numberbool === 1) {
      return true
    } else {
      return false
    }
  }

}
TododefinesEdit.contextType = FormContext