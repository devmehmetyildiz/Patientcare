import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Icon, Modal, } from 'semantic-ui-react'
import { Breadcrumb, Button } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'
import FormInput from '../../Utils/FormInput'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import { FormContext } from '../../Provider/FormProvider'
import { PATIENTMOVEMENTTYPE } from '../../Utils/Constants'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
export default class CasesCreate extends Component {

  PAGE_NAME = 'CasesCreate'

  constructor(props) {
    super(props)
    this.state = {
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetDepartments } = this.props
    GetDepartments()
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


    return (
      Cases.isLoading || Cases.isDispatching || Departments.isLoading || Departments.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Cases"}>
                <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
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
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Departmentstxt[Profile.Language]} name="Departments" multiple options={Departmentoptions} formtype="dropdown" modal={DepartmentsCreate} />
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
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Create[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddCases, history, Departments, fillCasenotification, Profile , closeModal} = this.props
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
    data.Iscalculateprice = ispatientdepartmentselected ? this.context.formstates[`${this.PAGE_NAME}/Iscalculateprice`] || false : false
    data.Isroutinework = ispatientdepartmentselected ? this.context.formstates[`${this.PAGE_NAME}/Isroutinework`] || false : false
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
      AddCases({ data, history , closeModal})
    }
  }
}
CasesCreate.contextType = FormContext