import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import {
  CASE_STATUS_COMPLETE, CASE_STATUS_DEACTIVE, CASE_STATUS_PASSIVE, CASE_STATUS_START,
  PATIENTMOVEMENTTYPE, PERSONEL_CASE_TYPE_ANNUALPERMIT, PERSONEL_CASE_TYPE_PASSIVE, PERSONEL_CASE_TYPE_PERMIT,
  PERSONEL_CASE_TYPE_START, PERSONEL_CASE_TYPE_WORK
} from '../../Utils/Constants'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton,
  Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
export default class CasesCreate extends Component {

  PAGE_NAME = 'CasesCreate'

  componentDidMount() {
    const { GetDepartments } = this.props
    GetDepartments()
  }

  render() {
    const { Cases, Departments, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t

    const Departmentoptions = (Departments.list || []).filter(u => u.Isactive).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    const casestatusOption = [
      {
        key: 0,
        text: t('Common.Cases.Type.Deactivate'),
        value: CASE_STATUS_DEACTIVE,
      },
      {
        key: 1,
        text: t('Common.Cases.Type.Passive'),
        value: CASE_STATUS_PASSIVE,
      },
      {
        key: 2,
        text: t('Common.Cases.Type.Complete'),
        value: CASE_STATUS_COMPLETE,
      },
      {
        key: 3,
        text: t('Common.Cases.Type.Start'),
        value: CASE_STATUS_START,
      },
    ]

    const personelstatusOption = [
      {
        key: 0,
        text: t('Common.Cases.Personel.Type.Passive'),
        value: PERSONEL_CASE_TYPE_PASSIVE,
      },
      {
        key: 1,
        text: t('Common.Cases.Personel.Type.Start'),
        value: PERSONEL_CASE_TYPE_START,
      },
      {
        key: 2,
        text: t('Common.Cases.Personel.Type.Work'),
        value: PERSONEL_CASE_TYPE_WORK,
      },
      {
        key: 3,
        text: t('Common.Cases.Personel.Type.Permit'),
        value: PERSONEL_CASE_TYPE_PERMIT,
      },
      {
        key: 4,
        text: t('Common.Cases.Personel.Type.Annualpermit'),
        value: PERSONEL_CASE_TYPE_ANNUALPERMIT,
      },
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

    const ispersoneldepartmentselected = (this.context.formstates[`${this.PAGE_NAME}/Departments`] || []).map(id => {
      let isHave = false
      const department = (Departments.list || []).find(u => u.Uuid === id)
      if (department && department.Ishavepersonels) {
        isHave = true
      }
      return isHave
    }).filter(u => u).length > 0


    return (
      Cases.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Cases"}>
                <Breadcrumb.Section>{t('Pages.Cases.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Cases.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Cases.Label.Name')} name="Name" />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Cases.Label.Shortname')} name="Shortname" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Cases.Label.Casecolor')} name="Casecolor" attention="blue,red,green..." />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Cases.Label.CaseStatus')} name="CaseStatus" options={casestatusOption} formtype="dropdown" />
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Cases.Label.Departments')} name="Departments" multiple options={Departmentoptions} formtype="dropdown" modal={DepartmentsCreate} />
              </Form.Group>
              {ispatientdepartmentselected ?
                <Form.Group widths='equal'>
                  <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Cases.Label.Patientstatus')} name="Patientstatus" options={patientcasesOptions} formtype="dropdown" />
                  <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Cases.Label.Iscalculateprice')} name="Iscalculateprice" formtype="checkbox" />
                  <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Cases.Label.Isroutinework')} name="Isroutinework" formtype="checkbox" />
                </Form.Group>
                : null
              }
              {ispersoneldepartmentselected ?
                <Form.Group widths='equal'>
                  <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Cases.Label.Personelstatus')} name="Personelstatus" options={personelstatusOption} formtype="dropdown" />
                </Form.Group>
                : null
              }
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Cases"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Cases.isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddCases, history, Departments, fillCasenotification, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)

    const ispatientdepartmentselected = data.Departments.map(id => {
      let isHave = false
      const department = (Departments.list || []).find(u => u.Uuid === id)
      if (department && department.Ishavepatients) {
        isHave = true
      }
      return isHave
    }).filter(u => u).length > 0

    const ispersoneldepartmentselected = (this.context.formstates[`${this.PAGE_NAME}/Departments`] || []).map(id => {
      let isHave = false
      const department = (Departments.list || []).find(u => u.Uuid === id)
      if (department && department.Ishavepersonels) {
        isHave = true
      }
      return isHave
    }).filter(u => u).length > 0

    data.Patientstatus = ispatientdepartmentselected ? data.Patientstatus : 0
    data.Personelstatus = ispersoneldepartmentselected ? data.Personelstatus : 0
    data.Iscalculateprice = ispatientdepartmentselected ? data.Iscalculateprice || false : false
    data.Isroutinework = ispatientdepartmentselected ? data.Isroutinework || false : false
    data.Departments = data.Departments.map(id => {
      return (Departments.list || []).find(u => u.Uuid === id)
    })
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Cases.Page.Header'), description: t('Pages.Cases.Messages.NameRequired') })
    }
    if (!validator.isNumber(data.CaseStatus)) {
      errors.push({ type: 'Error', code: t('Pages.Cases.Page.Header'), description: t('Pages.Cases.Messages.Casestatusrequired') })
    }
    if (!validator.isNumber(data.Patientstatus)) {
      errors.push({ type: 'Error', code: t('Pages.Cases.Page.Header'), description: t('Pages.Cases.Messages.Patientstatusrequired') })
    }
    if (!validator.isNumber(data.Personelstatus)) {
      errors.push({ type: 'Error', code: t('Pages.Cases.Page.Header'), description: t('Pages.Cases.Messages.Personelstatusrequired') })
    }
    if (!validator.isString(data.Casecolor)) {
      errors.push({ type: 'Error', code: t('Pages.Cases.Page.Header'), description: t('Pages.Cases.Messages.Casecolorrequired') })
    }
    if (!validator.isString(data.Shortname)) {
      errors.push({ type: 'Error', code: t('Pages.Cases.Page.Header'), description: t('Pages.Cases.Messages.Shortnamerequired') })
    }
    if (!validator.isArray(data.Departments)) {
      errors.push({ type: 'Error', code: t('Pages.Cases.Page.Header'), description: t('Pages.Cases.Messages.Departmentsrequired') })
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