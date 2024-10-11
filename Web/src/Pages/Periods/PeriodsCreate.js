import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class PeriodsCreate extends Component {

  PAGE_NAME = "PeriodsCreate"

  render() {

    const { Periods, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Periods

    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Periods"}>
                <Breadcrumb.Section >{t('Pages.Periods.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Periods.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Field>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Periods.Column.Name')} name="Name" />
              </Form.Field>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required type='time' placeholder={t('Pages.Periods.Column.Occuredtime')} name="Occuredtime" />
                <FormInput page={this.PAGE_NAME} required type='time' placeholder={t('Pages.Periods.Column.Checktime')} name="Checktime" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Periods"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Periods.isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddPeriods, history, fillPeriodnotification, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Periods.Page.Header'), description: t('Pages.Periods.Messages.NameRequired') })
    }
    if (!validator.isString(data.Occuredtime)) {
      errors.push({ type: 'Error', code: t('Pages.Periods.Page.Header'), description: t('Pages.Periods.Messages.Occuredtimerequired') })
    }
    if (!validator.isString(data.Checktime)) {
      errors.push({ type: 'Error', code: t('Pages.Periods.Page.Header'), description: t('Pages.Periods.Messages.Checktimerequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPeriodnotification(error)
      })
    } else {
      AddPeriods({ data, history, closeModal })
    }
  }
}
PeriodsCreate.contextType = FormContext