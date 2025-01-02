import React, { useContext, useEffect, } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import { FormContext } from '../../Provider/FormProvider'
import usePreviousUrl from '../../Hooks/usePreviousUrl'

export default function PatientvisitsCreate(props) {
  const PAGE_NAME = "PatientvisitsCreate"

  const { Patientvisits, Users, Patients, Patientdefines, Profile, closeModal, history } = props
  const { GetUsers, GetPatients, GetPatientdefines, AddPatientvisits, fillPatientvisitnotification } = props

  const { calculateRedirectUrl } = usePreviousUrl()
  const context = useContext(FormContext)

  const t = Profile?.i18n?.t

  const Usersoptions = (Users?.list || []).filter(u => u.Isactive && u.Isworker && u.Isworking).map(user => {
    return { key: user.Uuid, text: `${user.Name} ${user.Surname}`, value: user.Uuid }
  })

  const Patientsoptions = (Patients?.list || []).filter(u => u.Isactive && u.Isalive && !u.Isleft && !u.Ispreregistration).map(patient => {
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
    return { key: patient.Uuid, text: `${patientdefine.Firstname} ${patientdefine.Lastname}`, value: patient.Uuid }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = context.getForm(PAGE_NAME)
    let errors = []
    if (!validator.isUUID(data.PatientID)) {
      errors.push({ type: 'Error', code: t('Pages.Patientvisits.Page.Header'), description: t('Pages.Patientvisits.Messages.PatientRequired') })
    }
    if (!validator.isString(data.Contactname)) {
      errors.push({ type: 'Error', code: t('Pages.Patientvisits.Page.Header'), description: t('Pages.Patientvisits.Messages.ContactnameRequired') })
    }
    if (!validator.isString(data.Contactstatus)) {
      errors.push({ type: 'Error', code: t('Pages.Patientvisits.Page.Header'), description: t('Pages.Patientvisits.Messages.ContactstatusRequired') })
    }
    if (!validator.isISODate(data.Starttime)) {
      errors.push({ type: 'Error', code: t('Pages.Patientvisits.Page.Header'), description: t('Pages.Patientvisits.Messages.StarttimeRequired') })
    }
    if (!validator.isISODate(data.Endtime)) {
      errors.push({ type: 'Error', code: t('Pages.Patientvisits.Page.Header'), description: t('Pages.Patientvisits.Messages.EndtimeRequired') })
    }
    if (!validator.isUUID(data.ParticipateuserID)) {
      errors.push({ type: 'Error', code: t('Pages.Patientvisits.Page.Header'), description: t('Pages.Patientvisits.Messages.ParticipateuserRequired') })
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientvisitnotification(error)
      })
    } else {
      AddPatientvisits({
        data,
        history,
        redirectUrl: calculateRedirectUrl({ url: '/Patientvisits', usePrev: true }),
        closeModal,
      })
    }
  }


  useEffect(() => {
    GetUsers()
    GetPatientdefines()
    GetPatients()
  }, [])

  return (Patientvisits.isLoading || Patients.isLoading || Patientdefines.isLoading || Users.isLoading ? <LoadingPage /> :
    <Pagewrapper>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Patientvisits"}>
            <Breadcrumb.Section >{t('Pages.Patientvisits.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Patientvisits.Page.CreateHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
        {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
      </Headerwrapper>
      <Pagedivider />
      <Contentwrapper>
        <Form>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patientvisits.Column.Patient')} name="PatientID" options={Patientsoptions} formtype='dropdown' />
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patientvisits.Column.Participateuser')} name="ParticipateuserID" options={Usersoptions} formtype='dropdown' />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patientvisits.Column.Starttime')} name="Starttime" type="datetime-local" />
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patientvisits.Column.Endtime')} name="Endtime" type="datetime-local" />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patientvisits.Column.Contactname')} name="Contactname" />
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patientvisits.Column.Contactstatus')} name="Contactstatus" />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} placeholder={t('Pages.Patientvisits.Column.Info')} name="Info" />
          </Form.Group>
        </Form>
      </Contentwrapper>
      <Footerwrapper>
        <Gobackbutton
          history={history}
          redirectUrl={"/Patientvisits"}
          buttonText={t('Common.Button.Goback')}
        />
        <Submitbutton
          isLoading={Patientvisits.isLoading}
          buttonText={t('Common.Button.Create')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}
