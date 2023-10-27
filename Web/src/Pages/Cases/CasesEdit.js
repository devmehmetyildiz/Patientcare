import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header, Icon, Modal, Popup } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import FormInput from '../../Utils/FormInput'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import { PATIENTMOVEMENTTYPE } from '../../Utils/Constants'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
export default class CasesEdit extends Component {

  PAGE_NAME = 'CasesEdit'

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetCase, match, history, GetDepartments, CaseID } = this.props
    let Id = CaseID || match?.params?.CaseID
    if (validator.isUUID(Id)) {
      GetCase(Id)
      GetDepartments()
    } else {
      history && history.push("/Cases")
    }
  }

  componentDidUpdate() {
    const { Departments, Cases, removeCasenotification, removeDepartmentnotification } = this.props
    const { selected_record, isLoading } = Cases
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && Departments.list.length > 0 && !Departments.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({ isDatafetched: true })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, Departments: selected_record.Departmentuuids.map(u => { return u.DepartmentID }) })
    }
    Notification(Cases.notifications, removeCasenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
  }

  render() {

    const { Cases, Departments, Profile, history } = this.props

    const Departmentoptions = (Departments.list || []).filter(u => u.Isactive).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    const casestatusOption = [
      {
        key: '-1',
        text: Literals.Options.caseStatusoption.value0[Profile.Language],
        value: -1,
      },
      {
        key: '0',
        text: Literals.Options.caseStatusoption.value1[Profile.Language],
        value: 0,
      },
      {
        key: '1',
        text: Literals.Options.caseStatusoption.value2[Profile.Language],
        value: 1,
      }
    ]

    const patientcasesOptions = PATIENTMOVEMENTTYPE.map(u => {
      return {
        key: u.value,
        text: u.Name,
        value: u.value
      }
    })

    const ispatientdepartmentselected = (this.context.formstates[`${this.PAGE_NAME}/Departments`] || []).map(id => {
      let isHave = false
      const department = (Departments.list || []).find(u => u.Uuid === id)
      if (department && department.Ishavepatients) {
        isHave = true
      }
      return isHave
    }).filter(u => u).length > 0

    const addModal = (content) => {
      return <Modal
        onClose={() => { this.setState({ modelOpened: false }) }}
        onOpen={() => { this.setState({ modelOpened: true }) }}
        trigger={<Icon link name='plus' />}
        content={content}
      />
    }

    return (
      Cases.isLoading || Cases.isDispatching || Departments.isLoading || Departments.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Cases"}>
                <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Shortname[Profile.Language]} name="Shortname" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Casecolor[Profile.Language]} name="Casecolor" attention="blue,red,green..." />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.CaseStatus[Profile.Language]} name="CaseStatus" options={casestatusOption} formtype="dropdown" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Departmentstxt[Profile.Language]} name="Departments" multiple options={Departmentoptions} formtype="dropdown" modal={addModal(<DepartmentsCreate />)} />
              </Form.Group>
              {ispatientdepartmentselected &&
                <Form.Group widths='equal'>
                  <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Patientstatus[Profile.Language]} name="Patientstatus" options={patientcasesOptions} formtype="dropdown" />
                  <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Iscalculateprice[Profile.Language]} name="Iscalculateprice" formtype="checkbox" />
                  <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Isroutinework[Profile.Language]} name="Isroutinework" formtype="checkbox" />
                </Form.Group>}
              <Footerwrapper>
                {history && <Link to="/Cases">
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </Link>}
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditCases, history, fillCasenotification, Departments, Cases, Profile } = this.props
    const data = formToObject(e.target)

    const ispatientdepartmentselected = (this.context.formstates[`${this.PAGE_NAME}/Departments`] || []).map(id => {
      let isHave = false
      const department = (Departments.list || []).find(u => u.Uuid === id)
      if (department && department.Ishavepatients) {
        isHave = true
      }
      return isHave
    }).filter(u => u).length > 0

    data.CaseStatus = this.context.formstates[`${this.PAGE_NAME}/CaseStatus`]
    data.Patientstatus = ispatientdepartmentselected ? this.context.formstates[`${this.PAGE_NAME}/Patientstatus`] : 0
    data.Iscalculateprice = ispatientdepartmentselected ? this.context.formstates[`${this.PAGE_NAME}/Iscalculateprice`] : false
    data.Isroutinework = ispatientdepartmentselected ? this.context.formstates[`${this.PAGE_NAME}/Isroutinework`] : false
    data.Departments = this.context.formstates[`${this.PAGE_NAME}/Departments`].map(id => {
      return (Departments.list || []).find(u => u.Uuid === id)
    })

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (!validator.isNumber(data.CaseStatus)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Casestatusrequired[Profile.Language] })
    }
    if (!validator.isNumber(data.Patientstatus)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Patientstatusrequired[Profile.Language] })
    }
    if (!validator.isString(data.Casecolor)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Casecolorrequired[Profile.Language] })
    }
    if (!validator.isString(data.Shortname)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Shortnamerequired[Profile.Language] })
    }
    if (!validator.isArray(data.Departments)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Departmentsrequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillCasenotification(error)
      })
    } else {
      EditCases({ data: { ...Cases.selected_record, ...data }, history })
    }
  }
}
CasesEdit.contextType = FormContext
