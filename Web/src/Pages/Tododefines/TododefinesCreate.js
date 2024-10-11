import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import PeriodsCreate from '../../Containers/Periods/PeriodsCreate'
export default class TododefinesCreate extends Component {

  PAGE_NAME = "TododefinesCreate"

  componentDidMount() {
    const { GetPeriods } = this.props
    GetPeriods()
  }

  render() {

    const { Tododefines, Periods, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Tododefines

    const Periodsoptions = (Periods.list || []).filter(u => u.Isactive).map(period => {
      return { key: period.Uuid, text: period.Name, value: period.Uuid }
    })

    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Tododefines"}>
                <Breadcrumb.Section >{t('Pages.Tododefines.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Tododefines.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Tododefines.Column.Name')} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Tododefines.Column.Dayperiod')} name="Dayperiod" type="number" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Tododefines.Column.Info')} name="Info" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Tododefines.Column.Periods')} name="Periods" multiple options={Periodsoptions} formtype='dropdown' modal={PeriodsCreate} />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Tododefines.Column.IsRequired')} name="IsRequired" formtype="checkbox" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Tododefines.Column.IsNeedactivation')} name="IsNeedactivation" formtype="checkbox" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Tododefines"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Tododefines.isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddTododefines, history, fillTododefinenotification, Periods, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    data.Periods = data.Periods.map(id => {
      return (Periods.list || []).find(u => u.Uuid === id)
    })

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Tododefines.Page.Header'), description: t('Pages.Tododefines.Messages.NameRequired') })
    }
    if (!validator.isArray(data.Periods)) {
      errors.push({ type: 'Error', code: t('Pages.Tododefines.Page.Header'), description: t('Pages.Tododefines.Messages.PeriodsRequired') })
    }
    if (!validator.isNumber(data.Dayperiod)) {
      errors.push({ type: 'Error', code: t('Pages.Tododefines.Page.Header'), description: t('Pages.Tododefines.Messages.DayperiodRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillTododefinenotification(error)
      })
    } else {
      AddTododefines({ data, history, closeModal })
    }
  }
}
TododefinesCreate.contextType = FormContext