import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'

export default function DepartmentsCreate(props) {

  const { Departments, AddDepartments, history, fillDepartmentnotification, Profile, closeModal } = props

  const PAGE_NAME = "DepartmentsCreate"
  const context = useContext(FormContext)
  const t = Profile?.i18n?.t

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = context.getForm(PAGE_NAME)
    data.Ishavepatients = data.Ishavepatients ? data.Ishavepatients : false
    data.Ishavepersonels = data.Ishavepersonels ? data.Ishavepersonels : false
    data.Isdefaultpatientdepartment = data.Isdefaultpatientdepartment ? data.Isdefaultpatientdepartment : false
    data.Isdefaultpersoneldepartment = data.Isdefaultpersoneldepartment ? data.Isdefaultpersoneldepartment : false

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Departments.Page.Header'), description: t('Pages.Departments.Messages.NameRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillDepartmentnotification(error)
      })
    } else {
      AddDepartments({ data, history, closeModal })
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
            <Breadcrumb.Section>{t('Pages.Departments.Page.CreateHeader')}</Breadcrumb.Section>
          </Headerbredcrump>
          {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
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
            buttonText={t('Common.Button.Create')}
            submitFunction={handleSubmit}
          />
        </Footerwrapper>
      </Pagewrapper >
  )
}
