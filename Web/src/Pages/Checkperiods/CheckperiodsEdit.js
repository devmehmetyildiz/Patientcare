import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Icon, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import FormInput from '../../Utils/FormInput'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import PeriodsCreate from '../../Containers/Periods/PeriodsCreate'
import Gobackbutton from '../../Common/Gobackbutton'
import Submitbutton from '../../Common/Submitbutton'
export default class CheckperiodsEdit extends Component {

  PAGE_NAME = 'CheckperiodsEdit'

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      modelOpened: false
    }
  }


  componentDidMount() {
    const { GetPeriods, GetCheckperiod, match, history, CheckperiodID } = this.props
    let Id = CheckperiodID || match?.params?.CheckperiodID
    if (validator.isUUID(Id)) {
      GetCheckperiod(Id)
      GetPeriods()
    } else {
      history.push("/Checkperiods")
    }

  }

  componentDidUpdate() {
    const { Periods, Checkperiods } = this.props
    const { selected_record, isLoading } = Checkperiods
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 &&
      Periods.list.length > 0 && !Periods.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, {
        ...selected_record,
        Periods: selected_record.Perioduuids.map(u => { return u.PeriodID })
      })
    }
  }

  render() {
    const { Checkperiods, Periods, Profile, history } = this.props

    const Periodoptions = (Periods.list || []).filter(u => u.Isactive).map(period => {
      return { key: period.Uuid, text: period.Name, value: period.Uuid }
    })

    const Periodtypeoption = [
      { key: 1, text: Literals.Options.Periodtypeoption.value0[Profile.Language], value: 1 },
    ]

    return (
      Checkperiods.isLoading || Checkperiods.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Checkperiods"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Occureddays[Profile.Language]} name="Occureddays" type='number' />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Periodtype[Profile.Language]} name="Periodtype" options={Periodtypeoption} formtype="dropdown" />
              </Form.Group>
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Periodstxt[Profile.Language]} name="Periods" multiple options={Periodoptions} formtype="dropdown" modal={PeriodsCreate} />
              <Footerwrapper>
                <Gobackbutton
                  history={history}
                  redirectUrl={"/Checkperiods"}
                  buttonText={Literals.Button.Goback[Profile.Language]}
                />
                <Submitbutton
                  isLoading={Checkperiods.isLoading}
                  buttonText={Literals.Button.Update[Profile.Language]}
                  submitFunction={this.handleSubmit}
                />
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditCheckperiods, history, fillCheckperiodnotification, Periods, Checkperiods, Profile } = this.props
    const data = formToObject(e.target)
    data.Periodtype = this.context.formstates[`${this.PAGE_NAME}/Periodtype`]
    data.Periods = this.context.formstates[`${this.PAGE_NAME}/Periods`].map(id => {
      return (Periods.list || []).find(u => u.Uuid === id)
    })
    data.Occureddays && (data.Occureddays = parseInt(data.Occureddays))

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (!validator.isArray(data.Periods)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Periodsrequired[Profile.Language] })
    }
    if (!validator.isNumber(data.Occureddays)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Occureddaysrequired[Profile.Language] })
    }
    if (!validator.isNumber(data.Periodtype)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.PeriodTyperequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillCheckperiodnotification(error)
      })
    } else {
      EditCheckperiods({ data: { ...Checkperiods.selected_record, ...data }, history })
    }
  }
}
CheckperiodsEdit.contextType = FormContext