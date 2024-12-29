import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
export default class MailsettingsCreate extends Component {

  PAGE_NAME = "MailsettingsCreate"

  render() {

    const { Mailsettings, Profile, history, closeModal } = this.props

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
              <Breadcrumb.Section>{t('Pages.Mailsettings.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Mailsettings.Column.Name')} name="Name" />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Mailsettings.Column.User')} name="User" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Mailsettings.Column.Password')} name="Password" type='password' />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Mailsettings.Column.Smtpport')} name="Smtpport" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Mailsettings.Column.Smtphost')} name="Smtphost" />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Mailsettings.Column.Mailaddress')} name="Mailaddress" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Mailsettings.Column.Isbodyhtml')} name="Isbodyhtml" formtype="checkbox" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Mailsettings.Column.Issettingactive')} name="Issettingactive" formtype="checkbox" />
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
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddMailsettings, history, fillMailsettingnotification, Profile, closeModal } = this.props

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
      AddMailsettings({ data, history, closeModal })
    }
  }
}
MailsettingsCreate.contextType = FormContext
