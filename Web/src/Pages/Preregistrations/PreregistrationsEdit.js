import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form, } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import Literals from './Literals'
import FormInput from '../../Utils/FormInput'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Submitbutton from '../../Common/Submitbutton'
import Gobackbutton from '../../Common/Gobackbutton'
export default class PreregistrationsEdit extends Component {

  PAGE_NAME = 'PreregistrationsEdit'

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { GetPatientdefines, GetPatient, GetDepartments, GetCases, match, history } = this.props
    if (match.params.PatientID) {
      GetPatient(match.params.PatientID)
      GetPatientdefines()
      GetDepartments()
      GetCases()
    } else {
      history.push("/Preregistrations")
    }
  }

  componentDidUpdate() {
    const { Departments, Cases, Patientdefines, Patients } = this.props
    const { selected_record, isLoading } = Patients
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !Departments.isLoading
      && !Cases.isLoading
      && !Patientdefines.isLoading
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true,
      })
      const registerDate = new Date(selected_record?.Registerdate || '');
      const approvaldate = new Date(selected_record?.Approvaldate || '');
      const formattedregisterDate = `${registerDate.getFullYear()}-${String(registerDate.getMonth() + 1).padStart(2, '0')}-${String(registerDate.getDate()).padStart(2, '0')}`;
      const formattedapprovaldate = `${approvaldate.getFullYear()}-${String(approvaldate.getMonth() + 1).padStart(2, '0')}-${String(approvaldate.getDate()).padStart(2, '0')}`;
      this.context.setForm(this.PAGE_NAME, { ...selected_record, [`Registerdate`]: formattedregisterDate, ['Approvaldate']: formattedapprovaldate })
    }
  }


  render() {

    const { Patientdefines, Patients, Departments, Cases, history, Profile } = this.props
    const { isLoading, isDispatching } = Patients

    const Patientdefineoptions = (Patientdefines.list || []).filter(u => u.Isactive).map(define => {
      return { key: define.Uuid, text: `${define.Firstname} ${define.Lastname}-${define.CountryID}`, value: define.Uuid }
    })

    const Departmentoptions = (Departments.list || []).filter(u => u.Isactive).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    const Casesoptions = (Cases.list || []).filter(u => u.Isactive).filter(u => u.Casestatus !== 1).map(cases => {
      return { key: cases.Uuid, text: cases.Name, value: cases.Uuid }
    })

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Preregistrations"}>
                <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Patientdefine[Profile.Language]} name="PatientdefineID" options={Patientdefineoptions} formtype="dropdown" />
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Deparment[Profile.Language]} name="DepartmentID" options={Departmentoptions} formtype="dropdown" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Case[Profile.Language]} name="CaseID" options={Casesoptions} formtype="dropdown" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Registerdate[Profile.Language]} name="Registerdate" type='date' />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Happensdate[Profile.Language]} name="Happensdate" type='date' />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Preregistrations"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { fillPatientnotification, Patients, EditPatients, history, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    if (!validator.isISODate(data.Registerdate)) {
      data.Registerdate = null
    }
    if (!validator.isISODate(data.Approvaldate)) {
      data.Approvaldate = null
    }
    if (!validator.isISODate(data.Happensdate)) {
      data.Happensdate = null
    }

    let errors = []
    if (!validator.isUUID(data.PatientdefineID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Patientdefinerequired[Profile.Language] })
    }
    if (!validator.isUUID(data.DepartmentID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Departmentrequired[Profile.Language] })
    }
    if (!validator.isUUID(data.CaseID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.CaseID[Profile.Language] })
    }
    if (!validator.isISODate(data.Registerdate)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Registerdaterequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientnotification(error)
      })
    } else {
      EditPatients({ data: { ...Patients.selected_record, ...data }, history, redirectUrl: "/Preregistrations" })
    }
  }

}
PreregistrationsEdit.contextType = FormContext