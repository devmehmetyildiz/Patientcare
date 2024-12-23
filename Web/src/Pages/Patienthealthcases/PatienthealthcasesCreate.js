import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'

export default function PatienthealthcasesCreate(props) {
  const PAGE_NAME = "PatienthealthcasesCreate"

  const { AddPatienthealthcases, fillPatienthealthcasenotification, GetPatientdefines, GetPatients, GetPatienthealthcasedefines } = props
  const { Patienthealthcases, Patients, Patientdefines, Patienthealthcasedefines, Profile, history, closeModal } = props

  const context = useContext(FormContext)

  const t = Profile?.i18n?.t

  const Patientsoptions = (Patients?.list || []).filter(u => u.Isactive && u.Isalive && !u.Isleft && !u.Ispreregistration).map(patient => {
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
    return { key: patient.Uuid, text: `${patientdefine.Firstname} ${patientdefine.Lastname}`, value: patient.Uuid }
  })

  const Patienthealthcasedefinesoptions = (Patienthealthcasedefines?.list || []).filter(u => u.Isactive).map(define => {
    return { key: define.Uuid, text: `${define.Name}`, value: define.Uuid }
  })


  const handleSubmit = (e) => {
    e.preventDefault()
    const t = Profile?.i18n?.t
    const data = context.getForm(PAGE_NAME)
    let errors = []
    if (!validator.isString(data.PatientID)) {
      errors.push({ type: 'Error', code: t('Pages.Patienthealthcases.Page.Header'), description: t('Pages.Patienthealthcases.Messages.PatientRequired') })
    }
    if (!validator.isString(data.DefineID)) {
      errors.push({ type: 'Error', code: t('Pages.Patienthealthcases.Page.Header'), description: t('Pages.Patienthealthcases.Messages.DefineRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatienthealthcasenotification(error)
      })
    } else {
      AddPatienthealthcases({ data, history, closeModal })
    }
  }

  useEffect(() => {
    GetPatientdefines()
    GetPatients()
    GetPatienthealthcasedefines()
  }, [])

  return (
    Patienthealthcases.isLoading ? <LoadingPage /> :
      <Pagewrapper>
        <Headerwrapper>
          <Headerbredcrump>
            <Link to={"/Patienthealthcases"}>
              <Breadcrumb.Section >{t('Pages.Patienthealthcases.Page.Header')}</Breadcrumb.Section>
            </Link>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section>{t('Pages.Patienthealthcases.Page.CreateHeader')}</Breadcrumb.Section>
          </Headerbredcrump>
          {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
        </Headerwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Form>
            <Form.Group widths={'equal'}>
              <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patienthealthcases.Column.Patient')} name="PatientID" options={Patientsoptions} formtype='dropdown' />
              <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patienthealthcases.Column.Define')} name="DefineID" options={Patienthealthcasedefinesoptions} formtype='dropdown' />
            </Form.Group>
          </Form>
        </Contentwrapper>
        <Footerwrapper>
          <Gobackbutton
            history={history}
            redirectUrl={"/Patienthealthcases"}
            buttonText={t('Common.Button.Goback')}
          />
          <Submitbutton
            isLoading={Patienthealthcases.isLoading}
            buttonText={t('Common.Button.Create')}
            submitFunction={handleSubmit}
          />
        </Footerwrapper>
      </Pagewrapper >
  )
}
