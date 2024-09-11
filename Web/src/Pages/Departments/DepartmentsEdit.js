import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Form } from 'semantic-ui-react'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'

export default function DepartmentsEdit(props) {

  const { GetDepartment, match, history, GetStations, DepartmentID, Departments,
    Profile, EditDepartments, fillDepartmentnotification, handleSelectedDepartment } = props

  const PAGE_NAME = "DepartmentsEdit"
  const [isDatafetched, setisDatafetched] = useState(false)
  const context = useContext(FormContext)
  const t = Profile?.i18n?.t

  useEffect(() => {
    let Id = DepartmentID || match?.params?.DepartmentID
    if (validator.isUUID(Id)) {
      GetDepartment(Id)
    } else {
      history.push("/Departments")
    }
  }, [])

  useEffect(() => {
    const { selected_record, isLoading } = Departments
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !isDatafetched) {
      setisDatafetched(true)
      handleSelectedDepartment({})
      context.setForm(PAGE_NAME, selected_record)
    }
  }, [Departments])

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = context.getForm(PAGE_NAME)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Departments.Page.Header'), description: t('Pages.Departments.Messages.NameRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillDepartmentnotification(error)
      })
    } else {
      EditDepartments({ data: { ...Departments.selected_record, ...data }, history })
    }
  }

  return (
    Departments.isLoading ? <LoadingPage /> :
      <Pagewrapper>
        <Headerwrapper>
          <Headerbredcrump>
            <Link to={"/Departments"}>
              <Breadcrumb.Section >{t('Pages.Departments.Page.Header')}</Breadcrumb.Section>
            </Link>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section>{t('Pages.Departments.Page.EditHeader')}</Breadcrumb.Section>
          </Headerbredcrump>
        </Headerwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Form>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Departments.Columns.Name')} name="Name" />
            <Form.Group widths={'equal'}>
              <FormInput page={PAGE_NAME} placeholder={t('Pages.Departments.Columns.Ishavepatients')} name="Ishavepatients" formtype="checkbox" />
              {context.formstates[`${PAGE_NAME}/Ishavepatients`]
                ? <FormInput page={PAGE_NAME} placeholder={t('Pages.Departments.Columns.Isdefaultpatientdepartment')} name="Isdefaultpatientdepartment" formtype="checkbox" />
                : null
              }
            </Form.Group>
            <Form.Group widths={'equal'}>
              <FormInput page={PAGE_NAME} placeholder={t('Pages.Departments.Columns.Ishavepersonels')} name="Ishavepersonels" formtype="checkbox" />
              {context.formstates[`${PAGE_NAME}/Ishavepersonels`]
                ? <FormInput page={PAGE_NAME} placeholder={t('Pages.Departments.Columns.Isdefaultpersoneldepartment')} name="Isdefaultpersoneldepartment" formtype="checkbox" />
                : null
              }
            </Form.Group>
          </Form>
        </Contentwrapper>
        <Footerwrapper>
          <Gobackbutton
            history={history}
            redirectUrl={"/Departments"}
            buttonText={t('Common.Button.Goback')}
          />
          <Submitbutton
            isLoading={Departments.isLoading}
            buttonText={t('Common.Button.Update')}
            submitFunction={handleSubmit}
          />
        </Footerwrapper>
      </Pagewrapper >
  )
}