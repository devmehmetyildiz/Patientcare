import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import Formatdate from '../../Utils/Formatdate'

export default class PatientsEdit extends Component {

  PAGE_NAME = "PatientsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { GetPatient, match, history, PatientID, GetPatientdefines } = this.props
    let Id = PatientID || match.params.PatientID
    if (validator.isUUID(Id)) {
      GetPatient(Id)
      GetPatientdefines()
    } else {
      history.push("/Patients")
    }
  }

  componentDidUpdate() {
    const { Patients, Patientdefines } = this.props
    const { selected_record, isLoading } = Patients
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !Patientdefines.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, {
        ...selected_record,
        Approvaldate: Formatdate(selected_record?.Approvaldate),
        Registerdate: Formatdate(selected_record?.Registerdate),
        Happensdate: Formatdate(selected_record?.Happensdate),
        Leavedate: Formatdate(selected_record?.Leavedate),
      })
    }
  }

  render() {

    const { Patients, Patientdefines, Profile, history, match, PatientID } = this.props
    const Id = match?.params?.PatientID || PatientID

    const { isLoading, selected_record } = Patients;
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === selected_record?.PatientdefineID);

    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patients"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Link to={"/Patients/" + Id}>
                <Breadcrumb.Section>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Approvaldate[Profile.Language]} name="Approvaldate" type='date' />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Registerdate[Profile.Language]} name="Registerdate" type='date' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Happensdate[Profile.Language]} name="Happensdate" type='date' />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Leavedate[Profile.Language]} name="Leavedate" type='date' />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Patients"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Patients.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { fillPatientnotification, Patients, EditPatients, history, Profile, PatientID, match } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    let Id = PatientID || match.params.PatientID
    if (!validator.isISODate(data.Approvaldate)) {
      data.Approvaldate = null
    }
    if (!validator.isISODate(data.Registerdate)) {
      data.Registerdate = null
    }
    if (!validator.isISODate(data.Happensdate)) {
      data.Happensdate = null
    }
    if (!validator.isISODate(data.Leavedate)) {
      data.Leavedate = null
    }

    let errors = []
    if (!validator.isISODate(data.Registerdate)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Registerdaterequired[Profile.Language] })
    }
    if (!validator.isISODate(data.Happensdate)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Happensdaterequired[Profile.Language] })
    }
    if (!validator.isISODate(data.Approvaldate)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Approvaldaterequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientnotification(error)
      })
    } else {
      EditPatients({ data: { ...Patients.selected_record, ...data }, history, redirectUrl: `/Patients/${Id}` })
    }
  }
}
PatientsEdit.contextType = FormContext