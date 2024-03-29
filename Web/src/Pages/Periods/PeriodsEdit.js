import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import Literals from './Literals'
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
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
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
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditPeriods, history, fillPeriodnotification, Periods, Profile } = this.props
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
      EditPeriods({ data: { ...Periods.selected_record, ...data }, history })
    }

  }
}
PeriodsEdit.contextType = FormContext