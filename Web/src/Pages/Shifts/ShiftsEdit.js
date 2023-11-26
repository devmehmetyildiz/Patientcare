import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form, Icon, Modal } from 'semantic-ui-react'
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
import Submitbutton from '../../Common/Submitbutton'
import Gobackbutton from '../../Common/Gobackbutton'

export default class ShiftsEdit extends Component {

  PAGE_NAME = "ShiftsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { ShiftID, GetShift, match, history } = this.props
    let Id = ShiftID || match?.params?.ShiftID
    if (validator.isUUID(Id)) {
      GetShift(Id)
    } else {
      history.push("/Shifts")
    }
  }

  componentDidUpdate() {
    const { Shifts } = this.props
    const { selected_record, isLoading } = Shifts
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {
    const { Shifts, Profile, history } = this.props

    return (
      Shifts.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Shifts"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Priority[Profile.Language]} name="Priority" type='number' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Starttime[Profile.Language]} name="Starttime" type='time' />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Endtime[Profile.Language]} name="Endtime" type='time' />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Shifts"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Shifts.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditShifts, history, fillShiftnotification, Profile, Shifts } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (!validator.isString(data.Starttime)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Startimerequired[Profile.Language] })
    }
    if (!validator.isString(data.Endtime)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Endtimerequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillShiftnotification(error)
      })
    } else {
      EditShifts({ data: { ...Shifts.selected_record, ...data }, history })
    }
  }
}
ShiftsEdit.contextType = FormContext