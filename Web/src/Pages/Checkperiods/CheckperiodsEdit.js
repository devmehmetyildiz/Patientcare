import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
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
export default class CheckperiodsEdit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedPeriods: [],
      selectedDays: [],
      selectedType: null,
      isDatafetched: false,
    }
  }


  componentDidMount() {
    const { GetPeriods, GetCheckperiod, match, history, } = this.props
    if (validator.isUUID(match.params.CheckperiodID)) {
      GetCheckperiod(match.params.CheckperiodID)
      GetPeriods()
    } else {
      history.push("/Checkperiods")
    }

  }

  componentDidUpdate() {
    const { Periods, Checkperiods, removeCheckperiodnotification, removePeriodnotification } = this.props
    const { selected_record, isLoading } = Checkperiods
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 &&
      Periods.list.length > 0 && !Periods.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        selectedPeriods: selected_record.Periods.map(period => {
          return period.Uuid
        }), isDatafetched: true, selectedDays: selected_record.Occureddays.split(',').map(element => element.trim()), selectedType: selected_record.Periodtype
      })
      this.context.setFormstates(selected_record)
    }
    console.log('Checkperiods: ', Checkperiods);
    Notification(Periods.notifications, removePeriodnotification)
    Notification(Checkperiods.notifications, removeCheckperiodnotification)
  }

  render() {
    const { Checkperiods, Periods, Profile } = this.props

    const Periodoptions = Periods.list.map(period => {
      return { key: period.Uuid, text: period.Name, value: period.Uuid }
    })

    const Days = [
      "PAZARTESİ",
      "SALI",
      "ÇARŞAMBA",
      "PERŞEMBE",
      "CUMA",
      "CUMARTESİ",
      "PAZAR"
    ]
    const Dayoptions = Days.map(day => {
      return { key: day, text: day, value: day }
    })

    const Periodtypeoption = [
      { key: 1, text: Literals.Options.Periodtypeoption.value0[Profile.Language], value: 1 },
    ]

    return (
      Checkperiods.isLoading || Checkperiods.isDispatching || Periods.isLoading || Periods.isDispatching ? <LoadingPage /> :
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
            <Form onSubmit={this.handleSubmit}>
              <FormInput required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
              <Form.Group widths={"equal"}>
                <FormInput required placeholder={Literals.Columns.Occureddays[Profile.Language]} clearable search multiple options={Dayoptions} value={this.state.selectedDays} onChange={(e, { value }) => { this.setState({ selectedDays: value }) }} formtype="dropdown" />
                <FormInput required placeholder={Literals.Columns.Periodtype[Profile.Language]} clearable search options={Periodtypeoption} value={this.state.selectedType} onChange={(e, { value }) => { this.setState({ selectedType: value }) }} formtype="dropdown" />
              </Form.Group>
              <FormInput required placeholder={Literals.Columns.Periodstxt[Profile.Language]} clearable search multiple options={Periodoptions} value={this.state.selectedPeriods} onChange={(e, { value }) => { this.setState({ selectedPeriods: value }) }} formtype="dropdown" />
              <Footerwrapper>
                <Link to="/Checkperiods">
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditCheckperiods, history, fillCheckperiodnotification, Periods, Checkperiods, Profile } = this.props
    const { list } = Periods
    const { selectedDays, selectedPeriods, selectedType } = this.state
    const data = formToObject(e.target)
    data.Periods = selectedPeriods.map(station => {
      return list.find(u => u.Uuid === station)
    })
    var days = selectedDays.map((day) => {
      return day;
    }).join(", ")
    data.Occureddays = days
    data.Periodtype = parseInt(selectedType);

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (!validator.isArray(data.Periods)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Periodsrequired[Profile.Language] })
    }
    if (!validator.isString(data.Occureddays)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Occureddaysrequired[Profile.Language] })
    }
    if (!validator.isString(data.Occureddays)) {
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

  handleChange = (e, { value }) => {
    this.setState({ selectedstations: value })
  }
}
CheckperiodsEdit.contextType = FormContext