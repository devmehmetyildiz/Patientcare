import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Icon, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import FormInput from '../../Utils/FormInput'
import Literals from "./Literals"
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import PeriodsCreate from '../../Containers/Periods/PeriodsCreate'
export default class CheckperiodsCreate extends Component {

  PAGE_NAME = 'CheckperiodsCreate'

  constructor(props) {
    super(props)
    this.state = {
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetPeriods } = this.props
    GetPeriods()
  }

  componentDidUpdate() {
    const { Periods, Checkperiods, removeCheckperiodnotification, removePeriodnotification } = this.props
    Notification(Periods.notifications, removePeriodnotification)
    Notification(Checkperiods.notifications, removeCheckperiodnotification)
  }

  render() {
    const { Checkperiods, Periods, Profile, history } = this.props

    const Periodoptions = (Periods.list || []).filter(u => u.Isactive).map(period => {
      return { key: period.Uuid, text: period.Name, value: period.Uuid }
    })

    const Dayoptions = [
      { key: 0, text: Literals.Options.Dayoptions.value0[Profile.Language], value: 0 },
      { key: 1, text: Literals.Options.Dayoptions.value1[Profile.Language], value: 1 },
      { key: 2, text: Literals.Options.Dayoptions.value2[Profile.Language], value: 2 },
      { key: 3, text: Literals.Options.Dayoptions.value3[Profile.Language], value: 3 },
      { key: 4, text: Literals.Options.Dayoptions.value4[Profile.Language], value: 4 },
      { key: 5, text: Literals.Options.Dayoptions.value5[Profile.Language], value: 5 },
      { key: 6, text: Literals.Options.Dayoptions.value6[Profile.Language], value: 6 },
    ]

    const Periodtypeoption = [
      { key: 1, text: Literals.Options.Periodtypeoption.value0[Profile.Language], value: 1 },
    ]

    const addModal = (content) => {
      return <Modal
        onClose={() => { this.setState({ modelOpened: false }) }}
        onOpen={() => { this.setState({ modelOpened: true }) }}
        trigger={<Icon link name='plus' />}
        content={content}
      />
    }

    return (
      Checkperiods.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Checkperiods"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Occureddays[Profile.Language]} name="Occureddays" multiple options={Dayoptions} formtype="dropdown" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Periodtype[Profile.Language]} name="Periodtype" options={Periodtypeoption} formtype="dropdown" />
              </Form.Group>
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Periodstxt[Profile.Language]} name="Periods" multiple options={Periodoptions} formtype="dropdown" modal={addModal(<PeriodsCreate />)} />
              <Footerwrapper>
                {history && <Link to="/Checkperiods">
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

    const { AddCheckperiods, history, fillCheckperiodnotification, Periods, Profile } = this.props

    const data = formToObject(e.target)
    data.Periodtype = this.context.formstates[`${this.PAGE_NAME}/Periodtype`]
    data.Occureddays = this.context.formstates[`${this.PAGE_NAME}/Occureddays`].join(',')
    data.Periods = this.context.formstates[`${this.PAGE_NAME}/Periods`].map(id => {
      return (Periods.list || []).find(u => u.Uuid === id)
    })

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
    if (!validator.isNumber(data.Periodtype)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.PeriodTyperequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillCheckperiodnotification(error)
      })
    } else {
      AddCheckperiods({ data, history })
    }
  }
}
CheckperiodsCreate.contextType = FormContext