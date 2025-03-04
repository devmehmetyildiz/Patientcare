import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import PeriodsCreate from '../../Containers/Periods/PeriodsCreate'
export default class TododefinesEdit extends Component {

  PAGE_NAME = "TododefinesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      modelOpened: false
    }
  }

  componentDidMount() {
    const { TododefineID, GetTododefine, match, history, GetPeriods } = this.props
    let Id = TododefineID || match?.params?.TododefineID
    if (validator.isUUID(Id)) {
      GetTododefine(Id)
      GetPeriods()
    } else {
      history.push("/Tododefines")
    }
  }

  componentDidUpdate() {
    const { Tododefines, Periods } = this.props
    const { selected_record, isLoading } = Tododefines
    if (selected_record && Object.keys(selected_record).length > 0 && !Periods.isLoading && !isLoading && selected_record.Id !== 0 && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true,
      })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, Periods: selected_record.Perioduuids.map(u => { return u.PeriodID }) })
    }
  }

  render() {

    const { Tododefines, Periods, Profile, history } = this.props

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
              <Breadcrumb.Section>{t('Pages.Tododefines.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
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
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditTododefines, history, fillTododefinenotification, Tododefines, Periods, Profile } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    data.Periods = data.Periods.map(id => {
      return (Periods.list || []).find(u => u.Uuid === id)
    }).filter(u => u)

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