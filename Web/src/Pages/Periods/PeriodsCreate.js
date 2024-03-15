import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class PeriodsCreate extends Component {

  PAGE_NAME = "PeriodsCreate"

  render() {

    const { Periods, Profile, history, closeModal } = this.props
    const { isLoading } = Periods

    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Periods"}>
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
              <Form.Field>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
              </Form.Field>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required type='time' placeholder={Literals.Columns.Occuredtime[Profile.Language]} name="Occuredtime" />
                <FormInput page={this.PAGE_NAME} required type='time' placeholder={Literals.Columns.Checktime[Profile.Language]} name="Checktime" />
              </Form.Group>
            </Form>
          </Contentwrapper>
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
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddPeriods, history, fillPeriodnotification, Profile, closeModal } = this.props

    const data = this.context.getForm(this.PAGE_NAME)

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