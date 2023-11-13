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
import Gobackbutton from '../../Common/Gobackbutton'
import Submitbutton from '../../Common/Submitbutton'
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

  render() {
    const { Checkperiods, Periods, Profile, history, closeModal } = this.props

    const Periodoptions = (Periods.list || []).filter(u => u.Isactive).map(period => {
      return { key: period.Uuid, text: period.Name, value: period.Uuid }
    })

    const Periodtypeoption = [
      { key: 1, text: Literals.Options.Periodtypeoption.value0[Profile.Language], value: 1 },
    ]

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
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
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
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Checkperiods"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Checkperiods.isLoading}
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { AddCheckperiods, history, fillCheckperiodnotification, Periods, Profile, closeModal } = this.props

    const data = this.context.getForm(this.PAGE_NAME)
    data.Periods = data.Periods.map(id => {
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
      AddCheckperiods({ data, history, closeModal })
    }
  }
}
CheckperiodsCreate.contextType = FormContext