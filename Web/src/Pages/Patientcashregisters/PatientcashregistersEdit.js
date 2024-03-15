import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import Literals from './Literals'
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
    const { isLoading } = Patientcashregisters

    return (
      isLoading  ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patientcashregisters"}>
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
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Iseffectcompany[Profile.Language]} name="Iseffectcompany" formtype='checkbox' />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Patientcashregisters"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Patientcashregisters.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditPatientcashregisters, history, fillPatientcashregisternotification, Patientcashregisters, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
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