import React, { Component } from 'react'
import { Link, } from 'react-router-dom'
import { Divider, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import validator from '../../Utils/Validator'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import FormInput from '../../Utils/FormInput'
import { FormContext } from '../../Provider/FormProvider'
import Submitbutton from '../../Common/Submitbutton'
import Gobackbutton from '../../Common/Gobackbutton'
export default class PeriodsCreate extends Component {

  PAGE_NAME = "PeriodsCreate"

  render() {

    const { Periods, Profile, history } = this.props
    const { isLoading, isDispatching } = Periods

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Periods"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
          <Form>
              <Form.Field>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
              </Form.Field>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required type='time' placeholder={Literals.Columns.Occuredtime[Profile.Language]} name="Occuredtime" />
                <FormInput page={this.PAGE_NAME} required type='time' placeholder={Literals.Columns.Checktime[Profile.Language]} name="Checktime" />
              </Form.Group>
              <Footerwrapper>
                <Gobackbutton
                  history={history}
                  redirectUrl={"/Periods"}
                  buttonText={Literals.Button.Goback[Profile.Language]}
                />
                <Submitbutton
                  isLoading={Periods.isLoading}
                  buttonText={Literals.Button.Create[Profile.Language]}
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

    const { AddPeriods, history, fillPeriodnotification, Profile, closeModal } = this.props

    const data = formToObject(e.target)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (!validator.isString(data.Occuredtime)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Occuredtimerequired[Profile.Language] })
    }
    if (!validator.isString(data.Checktime)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Checktimerequired[Profile.Language] })
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