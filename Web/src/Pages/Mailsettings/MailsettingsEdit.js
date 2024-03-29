import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class MailsettingsEdit extends Component {

  PAGE_NAME = "MailsettingsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { GetMailsetting, match, history, MailsettingID } = this.props
    let Id = MailsettingID || match?.params?.MailsettingID
    if (validator.isUUID(Id)) {
      GetMailsetting(Id)
    } else {
      history.push("/Mailsettings")
    }
  }

  componentDidUpdate() {
    const { Mailsettings } = this.props
    const { selected_record, isLoading } = Mailsettings
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Mailsettings, Profile, history } = this.props
    const { isLoading } = Mailsettings

    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Mailsettings"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.User[Profile.Language]} name="User" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Password[Profile.Language]} name="Password" type='password' />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Smtpport[Profile.Language]} name="Smtpport" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Smtphost[Profile.Language]} name="Smtphost" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Mailaddress[Profile.Language]} name="Mailaddress" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Isbodyhtml[Profile.Language]} name="Isbodyhtml" formtype="checkbox" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Issettingactive[Profile.Language]} name="Issettingactive" formtype="checkbox" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Mailsettings"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditMailsettings, Mailsettings, history, fillMailsettingnotification, Profile } = this.props

    const data = this.context.getForm(this.PAGE_NAME)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (!validator.isString(data.User)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Userrequired[Profile.Language] })
    }
    if (!validator.isString(data.Smtpport)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Smtpportrequired[Profile.Language] })
    }
    if (!validator.isString(data.Smtphost)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Smtphostrequired[Profile.Language] })
    }
    if (!validator.isString(data.Mailaddress)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Mailaddressrequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillMailsettingnotification(error)
      })
    } else {
      EditMailsettings({ data: { ...Mailsettings.selected_record, ...data }, history })
    }
  }
}
MailsettingsEdit.contextType = FormContext
