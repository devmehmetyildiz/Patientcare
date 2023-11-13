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
import Gobackbutton from '../../Common/Gobackbutton'
import Submitbutton from '../../Common/Submitbutton'
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
    const { Cases, Departments, Profile, history, closeModal } = this.props

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
      Cases.isLoading || Cases.isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Cases"}>
                <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
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
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Cases"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Cases.isLoading}
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddCases, history, Departments, fillCasenotification, Profile, closeModal } = this.props
    const data = this.context.getForm(this.PAGE_NAME)

    const ispatientdepartmentselected = data.Departments.map(id => {
      let isHave = false
      const department = (Departments.list || []).find(u => u.Uuid === id)
      if (department && department.Ishavepatients) {
        isHave = true
      }
      return isHave
    }).filter(u => u).length > 0

    data.Patientstatus = ispatientdepartmentselected ? data.Patientstatus : 0
    data.Iscalculateprice = ispatientdepartmentselected ? data.Iscalculateprice || false : false
    data.Isroutinework = ispatientdepartmentselected ? data.Isroutinework || false : false
    data.Departments = data.Departments.map(id => {
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
      AddCases({ data, history, closeModal })
    }
  }
}
CasesCreate.contextType = FormContext