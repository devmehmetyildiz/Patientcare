import React, { Component } from 'react'
import { Link, } from 'react-router-dom'
import { Checkbox, Form } from 'semantic-ui-react'
import { Breadcrumb, Button } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import FormInput from '../../Utils/FormInput'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import { FormContext } from '../../Provider/FormProvider'
export default class MailsettingsCreate extends Component {

  PAGE_NAME = "MailsettingsCreate"

  componentDidUpdate() {
    const { removeMailsettingnotification, Mailsettings } = this.props
    Notification(Mailsettings.notifications, removeMailsettingnotification)
  }

  render() {

    const { Mailsettings, Profile, history } = this.props
    const { isLoading, isDispatching } = Mailsettings

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Mailsettings"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
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
              <Footerwrapper>
                {history && <Link to="/Mailsettings">
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </Link>}
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Create[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddMailsettings, history, fillMailsettingnotification, Profile } = this.props

    const data = formToObject(e.target)
    data.Isbodyhtml = this.context.formstates[`${this.PAGE_NAME}/Isbodyhtml`]
    data.Issettingactive = this.context.formstates[`${this.PAGE_NAME}/Issettingactive`]

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (!validator.isString(data.User)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Userrequired[Profile.Language] })
    }
    if (!validator.isString(data.Password)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Passwordsrequired[Profile.Language] })
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
      AddMailsettings({ data, history })
    }
  }
}
MailsettingsCreate.contextType = FormContext
