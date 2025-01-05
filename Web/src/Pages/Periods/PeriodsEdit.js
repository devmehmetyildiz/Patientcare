import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class PeriodsEdit extends Component {

  PAGE_NAME = "PeriodsEdit"

  constructor(props) {
    super(props)
    const isDatafetched = false
    this.state = {
      isDatafetched
    }
  }

  componentDidMount() {
    const { GetPeriod, match, history, PeriodID } = this.props
    let Id = PeriodID || match?.params?.PeriodID
    if (validator.isUUID(Id)) {
      GetPeriod(Id)
    } else {
      history.push("/Periods")
    }
  }


  componentDidUpdate() {
    const { Periods } = this.props
    const { selected_record, isLoading } = Periods
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Periods, Profile, history } = this.props

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
              <Breadcrumb.Section>{t('Pages.Periods.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
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
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditPeriods, history, fillPeriodnotification, Periods, Profile } = this.props

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
      EditPeriods({ data: { ...Periods.selected_record, ...data }, history })
    }

  }
}
PeriodsEdit.contextType = FormContext