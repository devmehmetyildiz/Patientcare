import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
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

    const t = Profile?.i18n?.t

    const { isLoading } = Mailsettings

    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Mailsettings"}>
                <Breadcrumb.Section >{t('Pages.Mailsettings.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Mailsettings.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Mailsettings.Columns.Name')} name="Name" />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Mailsettings.Columns.User')} name="User" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Mailsettings.Columns.Password')} name="Password" type='password' />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Mailsettings.Columns.Smtpport')} name="Smtpport" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Mailsettings.Columns.Smtphost')} name="Smtphost" />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Mailsettings.Columns.Mailaddress')} name="Mailaddress" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Mailsettings.Columns.Isbodyhtml')} name="Isbodyhtml" formtype="checkbox" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Mailsettings.Columns.Issettingactive')} name="Issettingactive" formtype="checkbox" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Mailsettings"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditMailsettings, Mailsettings, history, fillMailsettingnotification, Profile } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Mailsettings.Page.Header'), description: t('Pages.Mailsettings.Messages.NameRequired') })
    }
    if (!validator.isString(data.User)) {
      errors.push({ type: 'Error', code: t('Pages.Mailsettings.Page.Header'), description: t('Pages.Mailsettings.Messages.UserRequired') })
    }
    if (!validator.isString(data.Password)) {
      errors.push({ type: 'Error', code: t('Pages.Mailsettings.Page.Header'), description: t('Pages.Mailsettings.Messages.PasswordRequired') })
    }
    if (!validator.isString(data.Smtpport)) {
      errors.push({ type: 'Error', code: t('Pages.Mailsettings.Page.Header'), description: t('Pages.Mailsettings.Messages.SmtpportRequired') })
    }
    if (!validator.isString(data.Smtphost)) {
      errors.push({ type: 'Error', code: t('Pages.Mailsettings.Page.Header'), description: t('Pages.Mailsettings.Messages.SmtphostRequired') })
    }
    if (!validator.isString(data.Mailaddress)) {
      errors.push({ type: 'Error', code: t('Pages.Mailsettings.Page.Header'), description: t('Pages.Mailsettings.Messages.MailaddressRequired') })
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
