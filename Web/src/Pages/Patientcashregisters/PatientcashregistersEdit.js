import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class PatientcashregistersEdit extends Component {

  PAGE_NAME = "PatientcashregistersEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { GetPatientcashregister, match, history, PatientcashregisterID } = this.props
    let Id = PatientcashregisterID || match?.params?.PatientcashregisterID
    if (validator.isUUID(Id)) {
      GetPatientcashregister(Id)
    } else {
      history.push("/Patientcashregisters")
    }
  }

  componentDidUpdate() {
    const { Patientcashregisters } = this.props
    const { selected_record, isLoading } = Patientcashregisters
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Patientcashregisters, Profile, history } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Patientcashregisters

    return (
      <Pagewrapper dimmer isLoading={isLoading}>
        <Headerwrapper>
          <Headerbredcrump>
            <Link to={"/Patientcashregisters"}>
              <Breadcrumb.Section >{t('Pages.Patientcashregisters.Page.Header')}</Breadcrumb.Section>
            </Link>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section >{t('Pages.Patientcashregisters.Page.EditHeader')}</Breadcrumb.Section>
          </Headerbredcrump>
        </Headerwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Form>
            <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Patientcashregisters.Column.Name')} name="Name" />
            <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Patientcashregisters.Column.Iseffectcompany')} name="Iseffectcompany" formtype='checkbox' />
          </Form>
        </Contentwrapper>
        <Footerwrapper>
          <Gobackbutton
            history={history}
            redirectUrl={"/Patientcashregisters"}
            buttonText={t('Common.Button.Goback')}
          />
          <Submitbutton
            isLoading={Patientcashregisters.isLoading}
            buttonText={t('Common.Button.Update')}
            submitFunction={this.handleSubmit}
          />
        </Footerwrapper>
      </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditPatientcashregisters, history, fillPatientcashregisternotification, Patientcashregisters, Profile } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Patientcashregisters.Page.Header'), description: t('Pages.Patientcashregisters.Messages.NameRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientcashregisternotification(error)
      })
    } else {
      EditPatientcashregisters({ data: { ...Patientcashregisters.selected_record, ...data }, history })
    }

  }
}
PatientcashregistersEdit.contextType = FormContext