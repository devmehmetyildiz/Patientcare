import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Form } from 'semantic-ui-react'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import {
  CASE_STATUS_COMPLETE, CASE_STATUS_DEACTIVE, CASE_STATUS_PASSIVE, CASE_STATUS_START,
  PATIENTMOVEMENTTYPE, PERSONEL_CASE_TYPE_ANNUALPERMIT, PERSONEL_CASE_TYPE_PASSIVE,
  PERSONEL_CASE_TYPE_PERMIT, PERSONEL_CASE_TYPE_START, PERSONEL_CASE_TYPE_WORK
} from '../../Utils/Constants'


export default function CasesEdit(props) {
  const PAGE_NAME = 'CasesEdit'

  const { Cases, Departments, EditCases, fillCasenotification, GetCase, match, GetDepartments, CaseID, Profile, history } = props
  const Id = CaseID || match?.params?.CaseID

  const t = Profile?.i18n?.t

  const context = useContext(FormContext)

  const handleSubmit = (e) => {
    e.preventDefault()

    const t = Profile?.i18n?.t

    const data = context.getForm(PAGE_NAME)

    const ispatientdepartmentselected = data.Departments.map(id => {
      let isHave = false
      const department = (Departments.list || []).find(u => u.Uuid === id)
      if (department && department.Ishavepatients) {
        isHave = true
      }
      return isHave
    }).filter(u => u).length > 0

    const ispersoneldepartmentselected = (context.formstates[`${PAGE_NAME}/Departments`] || []).map(id => {
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
      return (Departments.list || []).filter(u => u.Isactive).find(u => u.Uuid === id)
    }).filter(u => u)

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
      EditCases({ data: { ...Cases.selected_record, ...data }, history })
    }
  }

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

  const ispatientdepartmentselected = (context.formstates[`${PAGE_NAME}/Departments`] || []).map(id => {
    let isHave = false
    const department = (Departments.list || []).find(u => u.Uuid === id)
    if (department && department.Ishavepatients) {
      isHave = true
    }
    return isHave
  }).filter(u => u).length > 0

  const ispersoneldepartmentselected = (context.formstates[`${PAGE_NAME}/Departments`] || []).map(id => {
    let isHave = false
    const department = (Departments.list || []).find(u => u.Uuid === id)
    if (department && department.Ishavepersonels) {
      isHave = true
    }
    return isHave
  }).filter(u => u).length > 0


  const { selected_record, isLoading } = Cases

  useEffect(() => {
    if (selected_record && validator.isObject(selected_record)) {
      context.setForm(PAGE_NAME, { ...selected_record, Departments: selected_record.Departmentuuids.map(u => { return u.DepartmentID }) })
    }
  }, [selected_record])

  useEffect(() => {
    if (validator.isUUID(Id)) {
      GetCase(Id)
      GetDepartments()
    } else {
      history && history.push("/Cases")
    }
  }, [])

  return (
    <Pagewrapper dimmer isLoading={isLoading}>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Cases"}>
            <Breadcrumb.Section>{t('Pages.Cases.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Cases.Page.CreateHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
      </Headerwrapper>
      <Pagedivider />
      <Contentwrapper>
        <Form>
          <Form.Group widths='equal'>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Cases.Label.Name')} name="Name" />
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Cases.Label.Shortname')} name="Shortname" />
          </Form.Group>
          <Form.Group widths='equal'>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Cases.Label.Casecolor')} name="Casecolor" attention="blue,red,green..." />
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Cases.Label.CaseStatus')} name="CaseStatus" options={casestatusOption} formtype="dropdown" />
          </Form.Group>
          <Form.Group widths='equal'>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Cases.Label.Departments')} name="Departments" multiple options={Departmentoptions} formtype="dropdown" modal={DepartmentsCreate} />
          </Form.Group>
          {ispatientdepartmentselected ?
            <Form.Group widths='equal'>
              <FormInput page={PAGE_NAME} required placeholder={t('Pages.Cases.Label.Patientstatus')} name="Patientstatus" options={patientcasesOptions} formtype="dropdown" />
              <FormInput page={PAGE_NAME} required placeholder={t('Pages.Cases.Label.Iscalculateprice')} name="Iscalculateprice" formtype="checkbox" />
              <FormInput page={PAGE_NAME} required placeholder={t('Pages.Cases.Label.Isroutinework')} name="Isroutinework" formtype="checkbox" />
            </Form.Group>
            : null
          }
          {ispersoneldepartmentselected ?
            <Form.Group widths='equal'>
              <FormInput page={PAGE_NAME} required placeholder={t('Pages.Cases.Label.Personelstatus')} name="Personelstatus" options={personelstatusOption} formtype="dropdown" />
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
          buttonText={t('Common.Button.Update')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}